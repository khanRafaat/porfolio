# Portfolio Platform

Personal portfolio + freelance lead-gen platform for **Khan Rafaat Abtahe** —
built as a real production system, not a static page: database-driven content,
a CMS, a client portal, and AI-agent-friendly SEO, all behind one domain.

**Live content is fully editable from the admin panel** — every headline, stat,
case study, blog post, service card, and even the hero photo caption comes from
the database. Zero redeploys for content changes.

## Architecture

```
Browser ── nginx :80
             ├── /api/*           → Django REST API (DRF)
             ├── /sharnav/*       → Django Admin CMS (django-unfold theme)
             ├── /django-static/* → Django static assets
             └── /*               → Next.js (App Router, SSR + ISR)

Django ── PostgreSQL 16 · Redis 7 (cache + Celery broker) · MinIO (S3 media)
Celery ── async jobs (email, future: AI indexing, file scanning)
```

Single-domain design: frontend and API share one origin, so there is no CORS
configuration and cookies behave identically in dev and production.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 |
| Backend | Django 6 · Django REST Framework · SimpleJWT · drf-spectacular |
| Admin/CMS | Django Admin + [django-unfold](https://unfoldadmin.com) |
| Data | PostgreSQL 16 · Redis 7 |
| Media | MinIO (S3-compatible), presigned URLs |
| Async | Celery |
| Edge | nginx (single-domain reverse proxy) |
| Dev env | Docker Compose (7 services), one-command start |

## Features

- **Public site** — home, case studies (with screenshot galleries + YouTube
  embeds), services, blog (markdown, categories, reading time), contact.
  Server-rendered with 60s ISR; dark mode by default with a persisted toggle.
- **CMS** — every string on the site lives in a `SiteText` key/value table;
  case studies, posts, and services are full models with draft/publish
  workflow, per-page SEO fields, and image uploads to MinIO.
- **Contact pipeline** — public form → DB (visible in admin, unread tracking)
  → email notification. Rate-limited (5/hour/IP) with a honeypot field.
  WhatsApp deep links + floating chat button.
- **Client portal (preview)** — projects with milestones, invoices, and
  update feeds. Currently shows demo data publicly; auth feature will scope
  it per client (endpoint already filters by `request.user`).
- **SEO / AEO** — dynamic `sitemap.xml`, JSON-LD (`BlogPosting`/`Article`),
  OpenGraph tags, `robots.txt` welcoming AI crawlers, and a CMS-generated
  [`/llms.txt`](https://llmstxt.org) index for AI agents.
- **Fail-soft frontend** — if the API is down or a content key is missing,
  pages render with built-in fallbacks instead of erroring.

## Quickstart

Requirements: Docker Desktop, Node.js (for the root scripts).

```bash
cp .env.example .env      # dev defaults work out of the box
yarn dev                  # frees the dev ports, then docker compose up --build
```

`yarn dev` kills anything squatting on the dev ports first (stray dev servers,
a native Postgres on 5432) — Docker's own processes are never touched.

First-time setup (in another terminal once containers are up):

```bash
yarn migrate                                  # apply DB migrations
yarn superuser                                # create your admin login
```

### Root scripts

| Command | What |
|---|---|
| `yarn dev` / `yarn dev:detached` | start everything (foreground / background) |
| `yarn stop` / `yarn down` | stop / stop + remove containers |
| `yarn fresh` | wipe volumes (DB included) and rebuild |
| `yarn logs` (`:django`, `:next`) | tail logs |
| `yarn migrate` / `yarn makemigrations` | Django migrations |
| `yarn superuser` / `yarn shell` | admin user / Django shell |

## URLs

| URL | What |
|---|---|
| http://localhost | Public site |
| http://localhost/sharnav/ | Admin CMS (non-default path on purpose) |
| http://localhost/api/docs/ | Swagger UI |
| http://localhost/api/health/ | Liveness probe |
| http://localhost/llms.txt | AI-agent content index |
| http://localhost:9001 | MinIO console (credentials in `.env`) |

## Public API (read-only, `AllowAny`)

```
GET /api/v1/blog/posts/                ?search= &category__slug= &page=
GET /api/v1/blog/posts/{slug}/
GET /api/v1/portfolio/case-studies/    ?featured=true &tag=
GET /api/v1/portfolio/case-studies/{slug}/
GET /api/v1/portfolio/services/
GET /api/v1/portfolio/site-text/       # {key: value} map of all site copy
GET /api/v1/portal/demo/               # demo portal projects only
POST /api/v1/portfolio/contact/        # rate-limited contact form
```

Everything else defaults to `IsAuthenticated` (secure by default).

## Layout

```
backend/            Django project
  config/           settings (base/local/production), urls, celery
  apps/
    accounts/       custom User (email login, admin/client roles)
    blog/           Category, Post
    portfolio/      CaseStudy (+gallery), Service, SiteText, ContactMessage
    portal/         Project, Milestone, Invoice, ProjectUpdate
    files/          (planned: scanned file exchange)
    common/         TimeStamped/SoftDelete/Publishable/Seo mixins, media helpers
frontend/           Next.js App Router
  app/              routes: / · /blog · /case-studies · /services · /contact · /portal
  app/llms.txt/     AI-agent index route
  components/       Navbar, Footer, LogoMark, ContactForm, Prose, ...
  lib/content.ts    typed, fail-soft API fetchers
nginx/              single-domain reverse proxy
scripts/            free-ports.js (pre-dev port cleanup)
```

## Security notes

- DRF is deny-by-default; public endpoints opt in explicitly.
- JWT strategy: short-lived access token in memory, refresh in an httpOnly
  cookie (lands with the auth feature). Argon2 password hashing.
- Contact endpoint: throttled + honeypot; submissions stored before email so
  a broken SMTP config never loses a lead.
- Admin lives at a non-default path with `X-Robots-Tag: noindex` — that cuts
  bot noise but is *not* a security control; strong passwords are. Add rate
  limiting + 2FA before public deployment.
- `ATOMIC_REQUESTS=True` — every request runs in a transaction.

## Production checklist (not yet done)

- [ ] Real SMTP credentials (`EMAIL_HOST*` env vars) for contact emails
- [ ] `DJANGO_DEBUG=0`, real `SECRET_KEY`, locked-down `ALLOWED_HOSTS`
- [ ] TLS at the edge; remove the exposed 5432/9000 dev ports
- [ ] Auth feature (JWT login) to make the portal per-client
- [ ] Admin login rate limiting + 2FA

## Roadmap

1. ~~Blog + CMS + public API~~ ✅
2. ~~Portfolio pages: case studies, services, contact~~ ✅
3. Auth (JWT) + real client portal
4. AI features: "ask my portfolio" RAG chat, AI project-brief wizard
5. Celery file pipeline (MinIO + ClamAV scanning)
6. Analytics + monetization
