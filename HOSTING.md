# Hosting Plan — Free-Tier Deployment

**Decision:** deploy on free-tier managed services instead of a paid VPS or
cPanel shared hosting. Estimated cost: **৳0/month**.

This document records the reasoning and the exact steps to get there. It
supersedes the earlier idea of self-hosting on a Bangladesh VPS or rewriting
the backend to run on cPanel.

---

## 1. Why free-tier, not VPS/cPanel

| Option | Monthly cost | Rework needed | Global performance |
|---|---|---|---|
| BD-local VPS (ServerBD etc.) | ৳500–1,500 | None (Docker works) | Fast in BD, slow overseas (~250–350ms to US/Canada) |
| cPanel shared hosting | ৳500–1,000 | Rewrite backend to Laravel or Node, drop Docker/Postgres/Redis/Celery/MinIO | Same overseas latency issue |
| **Free-tier (this plan)** | **৳0** | Config changes only, no code rewrite | Global edge network — consistently good everywhere |

Three factors drove this:

1. **Most of the target audience (freelance clients) is overseas.** A
   Bangladesh-based server is fast for BD visitors but adds real latency for
   US/Canada/EU visitors — exactly the audience worth the most per project.
   A global edge network (Vercel) serves both audiences well instead of
   trading one off against the other.
2. **cPanel would force a full backend rewrite** (Django → Laravel/Node,
   Postgres → MySQL, drop Celery/Redis/MinIO/Docker) to fit shared hosting's
   constraints — days of rework to reach a *worse* result than what's below.
3. **Free tiers fit a portfolio's actual traffic.** Low, spiky visits are
   exactly what free tiers are built for; paying monthly for idle capacity
   makes no sense at this stage.

---

## 2. The stack

| Piece | Service | Replaces | Free tier limits worth knowing |
|---|---|---|---|
| Frontend (Next.js) | **[Vercel](https://vercel.com)** | `nextjs` container | Generous bandwidth/build minutes for hobby use; custom domain + free SSL included |
| Backend API (Django) | **[Render](https://render.com)** (free Web Service) | `django` container | **Sleeps after 15 min idle** — first request after a nap takes ~30–50s to wake. Acceptable for a portfolio, not for an app needing instant response 24/7 |
| Database (PostgreSQL) | **[Neon](https://neon.tech)** or **[Supabase](https://supabase.com)** | `postgres` container | Neon: ~0.5GB storage, autosuspend on idle (wakes in ~1s, better than Render's cold start). Supabase: 500MB DB, pauses after 1 week fully idle |
| Media storage (images, uploads) | **[Cloudflare R2](https://www.cloudflare.com/products/r2/)** | `minio` container | 10GB storage free, **zero egress fees** (this is the standout feature — most S3-alike free tiers charge for bandwidth out) |
| Redis / Celery broker | **[Upstash](https://upstash.com)** free Redis, *or skip Celery* | `redis` + `celery-worker` containers | Upstash: 10K commands/day free. Simpler option: send contact-form emails synchronously — no queue needed at low traffic |

Everything in the "Replaces" column can be **deleted from `docker-compose.yml`**
once migrated — `nginx`, `postgres`, `redis`, `minio`, `minio-init`, and
`celery-worker` all go away for production. Docker Compose still works great
for **local development** (keep it for that).

---

## 3. Migration steps

### 3.1 Database → Neon/Supabase

1. Create a free Postgres project at neon.tech (or supabase.com).
2. Copy the connection string they give you.
3. Set it as `DATABASE_URL` in Render's environment variables — same format
   Django already expects (`config/settings/base.py` reads it via
   `env.db("DATABASE_URL")`), so **no code change**.
4. Run migrations once against the new database:
   ```bash
   DATABASE_URL="<neon-connection-string>" python manage.py migrate
   ```

### 3.2 Media storage → Cloudflare R2

R2 is S3-compatible, so `django-storages` needs only new credentials, not a
new backend:

1. Create an R2 bucket in the Cloudflare dashboard, generate an API token.
2. Update these env vars (same names already used in `base.py` /
   `.env.example` — just point them at R2 instead of MinIO):
   ```
   S3_ENDPOINT_URL=https://<account-id>.r2.cloudflarestorage.com
   S3_ACCESS_KEY=<r2-access-key>
   S3_SECRET_KEY=<r2-secret-key>
   S3_BUCKET_NAME=<your-bucket>
   S3_PUBLIC_ENDPOINT_URL=<R2 public bucket URL or custom domain>
   ```
3. No changes needed to `apps/common/media.py` — the internal/public URL
   rewrite logic already handles this pattern (it exists precisely because
   dev used MinIO's internal-vs-public split).

### 3.3 Redis / Celery → Upstash, or drop it

**Recommended for now:** skip Celery entirely at this traffic level.
`ContactView` in `apps/portfolio/views.py` already sends email inline
(`fail_silently=False` inside the request) — that's fine until volume grows.
Remove `CELERY_BROKER_URL` usage and the `celery-worker` service from prod.

If you want to keep async jobs: create a free Upstash Redis database, set
`CELERY_BROKER_URL` to its connection string, and run the Celery worker as a
**separate free Render Background Worker** (not the same as the web service).

### 3.4 Backend → Render

1. New "Web Service" on Render, connect the GitHub repo
   (`khanRafaat/porfolio`), root directory `backend/`.
2. Build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
3. Start command: `gunicorn config.wsgi:application`
4. Environment variables: everything currently in `.env` — `DJANGO_SECRET_KEY`
   (generate a new production one), `DJANGO_DEBUG=0`, `DJANGO_ALLOWED_HOSTS`
   (Render's `.onrender.com` domain + your custom API subdomain),
   `DATABASE_URL` (from Neon), `S3_*` (from R2), `CONTACT_EMAIL`, `EMAIL_*`
   (real SMTP creds — see README's production checklist).
5. Switch `DJANGO_SETTINGS_MODULE` to `config.settings.production`.

### 3.5 Frontend → Vercel

1. Import the repo into Vercel, set root directory to `frontend/`.
2. Environment variables: `NEXT_PUBLIC_SITE_URL` (your final domain),
   `API_INTERNAL_URL` → **now a public URL**, not `http://django:8000`
   (e.g. `https://api.yourdomain.com`), since Vercel and Render aren't on the
   same private network the way Docker Compose containers are.
3. Deploy. Vercel builds and serves automatically on every push to `main`.

### 3.6 CORS (new requirement)

The current single-nginx-domain setup has **zero CORS config because it's
never needed** — frontend and API share one origin. Splitting to
`yourdomain.com` (Vercel) + `api.yourdomain.com` (Render) makes them
cross-origin, so add:

```bash
pip install django-cors-headers
```

```python
# settings/base.py
INSTALLED_APPS += ["corsheaders"]
MIDDLEWARE.insert(1, "corsheaders.middleware.CorsMiddleware")  # before CommonMiddleware
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[])
# e.g. CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3.7 Domain / DNS

1. Buy a domain (name-based, e.g. `rafaatabtahe.com` — see earlier
   discussion on SEO benefits of a name-domain).
2. Root domain (`rafaatabtahe.com`, `www.`) → **Vercel** (A/CNAME records
   Vercel provides in its dashboard). Free SSL, auto-issued.
3. `api.rafaatabtahe.com` → **Render** (CNAME to the `.onrender.com` host
   Render gives you). Free SSL there too.
4. Update `NEXT_PUBLIC_SITE_URL`, `API_INTERNAL_URL`, `CORS_ALLOWED_ORIGINS`,
   and `DJANGO_ALLOWED_HOSTS` to the real domain once DNS resolves.

---

## 4. Known trade-offs (be upfront about these)

- **Render free tier sleeps after 15 minutes idle.** The first API request
  after a nap takes 30–50 seconds while it wakes up — the *next* request is
  fast again. A contact-form submission during a cold start will feel slow
  but will still succeed. If this becomes a problem, Render's paid tier
  ($7/mo) removes sleeping — cheaper than any VPS option discussed earlier.
- **Free Postgres tiers have small storage caps** (Neon ~0.5GB) — plenty for
  text content and metadata; media files live in R2, not the database, so
  this shouldn't bind for a long time.
- **No single "docker compose up" for production anymore** — deploys happen
  via git push to each service (Vercel, Render). Local dev keeps using
  Docker Compose unchanged.

---

## 5. Rejected alternatives (for reference)

- **Bangladesh local VPS (ServerBD, ~৳500–1,500/mo):** works technically
  (full root, Docker-capable), but costs money for a portfolio and is slower
  for the overseas clients this site is meant to attract.
- **cPanel shared hosting:** would require abandoning Docker, Postgres,
  Celery, and MinIO, and rewriting the backend in Laravel or Node — the
  single biggest effort of any option, for a worse latency outcome than
  free-tier hosting.
- **International budget VPS (Hetzner/Contabo, ~$5/mo):** viable if this
  project ever needs `docker compose up` in production again (e.g. Celery
  becomes essential, or the project outgrows free tiers) — kept as the
  fallback plan, not the current one.

---

## 6. Checklist

- [ ] Buy domain
- [ ] Create Neon/Supabase Postgres project, run migrations
- [ ] Create Cloudflare R2 bucket, migrate `S3_*` env vars
- [ ] Decide: drop Celery (simplest) or wire Upstash + Render worker
- [ ] Add `django-cors-headers`, set `CORS_ALLOWED_ORIGINS`
- [ ] Deploy backend to Render, set `config.settings.production`, real
      `DJANGO_SECRET_KEY`, `DEBUG=0`, SMTP creds
- [ ] Deploy frontend to Vercel, set `NEXT_PUBLIC_SITE_URL` +
      `API_INTERNAL_URL` to the real API domain
- [ ] Point DNS: root → Vercel, `api.` subdomain → Render
- [ ] Submit `sitemap.xml` to Google Search Console + Bing Webmaster Tools
      (see prior SEO discussion)
