"""
Base settings shared by every environment.

Laravel mapping: this file plays the role of config/*.php, with
django-environ standing in for env() + .env loading. Environment
selection happens via DJANGO_SETTINGS_MODULE (config.settings.local
vs config.settings.production) — the equivalent of APP_ENV.
"""
from datetime import timedelta
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env(
    DJANGO_DEBUG=(bool, False),
)

# In Docker the variables arrive via env_file; reading .env directly is a
# fallback for running manage.py outside a container (e.g. from the venv).
environ.Env.read_env(BASE_DIR.parent / ".env")

# ── Core ───────────────────────────────────────────────────────────────
SECRET_KEY = env("DJANGO_SECRET_KEY")
DEBUG = env("DJANGO_DEBUG")
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=[])

SITE_URL = env("SITE_URL", default="http://localhost")

INSTALLED_APPS = [
    "unfold",  # must come before django.contrib.admin
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "django_filters",
    "drf_spectacular",
    "storages",
    # Local apps
    "apps.common",
    "apps.accounts",
    "apps.blog",
    "apps.portfolio",
    "apps.portal",
    "apps.files",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ── Database ───────────────────────────────────────────────────────────
DATABASES = {"default": env.db("DATABASE_URL")}
# Wrap every request in a transaction — like doing DB::transaction()
# around each controller action. Rolls back automatically on exceptions.
DATABASES["default"]["ATOMIC_REQUESTS"] = True
DATABASES["default"]["CONN_MAX_AGE"] = 60

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ── Auth ───────────────────────────────────────────────────────────────
# Set BEFORE the first migration — swapping the user model later is one
# of Django's most painful migrations.
AUTH_USER_MODEL = "accounts.User"

# Argon2 first = strongest available hasher (Laravel: 'argon2id' driver)
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
]

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 10}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ── Cache (Redis) ──────────────────────────────────────────────────────
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": env("REDIS_URL", default="redis://redis:6379/0"),
    }
}

# ── DRF ────────────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    # Secure by default: every endpoint requires auth unless a view
    # explicitly opts into AllowAny (public blog endpoints will).
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_THROTTLE_CLASSES": (
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ),
    "DEFAULT_THROTTLE_RATES": {
        "anon": "60/min",
        "user": "300/min",
        # Contact form: strict — it triggers outbound email
        "contact": "5/hour",
    },
}

SIMPLE_JWT = {
    # Short-lived access token lives in frontend memory only;
    # refresh token travels in an httpOnly cookie (wired up in the auth feature).
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Portfolio Platform API",
    "DESCRIPTION": "Headless API powering the portfolio site and client portal.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

# ── Static & media ─────────────────────────────────────────────────────
# django-static/ prefix avoids any collision with Next.js /_next/static
STATIC_URL = "django-static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STORAGES = {
    # Media → MinIO. NOTE: presigned URLs are generated against
    # S3_ENDPOINT_URL (in-network). The files app will rewrite them to
    # S3_PUBLIC_ENDPOINT_URL for browser consumption in dev.
    "default": {
        "BACKEND": "storages.backends.s3.S3Storage",
        "OPTIONS": {
            "endpoint_url": env("S3_ENDPOINT_URL", default="http://minio:9000"),
            "access_key": env("S3_ACCESS_KEY", default=""),
            "secret_key": env("S3_SECRET_KEY", default=""),
            "bucket_name": env("S3_BUCKET_NAME", default="portfolio-media"),
            "region_name": "us-east-1",
            "signature_version": "s3v4",
            "file_overwrite": False,
            "default_acl": None,
            "querystring_auth": True,
        },
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

S3_PUBLIC_ENDPOINT_URL = env("S3_PUBLIC_ENDPOINT_URL", default="http://localhost:9000")

# ── Admin theme (django-unfold) ────────────────────────────────────────
UNFOLD = {
    "SITE_TITLE": "Rafaat Admin",
    "SITE_HEADER": "Khan Rafaat Abtahe",
    "SITE_SUBHEADER": "Portfolio CMS",
    "COLORS": {
        # Violet — matches the site's accent palette
        "primary": {
            "50": "245 243 255",
            "100": "237 233 254",
            "200": "221 214 254",
            "300": "196 181 253",
            "400": "167 139 250",
            "500": "139 92 246",
            "600": "124 58 237",
            "700": "109 40 217",
            "800": "91 33 182",
            "900": "76 29 149",
            "950": "46 16 101",
        },
    },
}

# ── Email / contact form ───────────────────────────────────────────────
# Local: console backend (set in local.py). Production: configure SMTP
# via these env vars (e.g. Gmail app password, SES, Resend, ...).
EMAIL_HOST = env("EMAIL_HOST", default="")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default="")
EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS", default=True)
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="portfolio@localhost")
# Where contact-form submissions are delivered:
CONTACT_EMAIL = env("CONTACT_EMAIL", default="rafaatabtahe@gmail.com")

# ── Celery ─────────────────────────────────────────────────────────────
CELERY_BROKER_URL = env("CELERY_BROKER_URL", default="redis://redis:6379/1")
CELERY_RESULT_BACKEND = env("REDIS_URL", default="redis://redis:6379/0")
CELERY_TASK_ACKS_LATE = True
CELERY_TASK_TIME_LIMIT = 300
CELERY_TASK_SOFT_TIME_LIMIT = 240
CELERY_TIMEZONE = "UTC"

# ── Next.js on-demand ISR revalidation ─────────────────────────────────
NEXTJS_INTERNAL_URL = env("NEXTJS_INTERNAL_URL", default="http://nextjs:3000")
REVALIDATE_SECRET = env("REVALIDATE_SECRET", default="")

# ── Security (nginx terminates the edge; Django sits behind it) ────────
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=["http://localhost"])
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# ── I18N ───────────────────────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ── Logging ────────────────────────────────────────────────────────────
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {"format": "{levelname} {asctime} {name} {message}", "style": "{"},
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "standard"},
    },
    "root": {"handlers": ["console"], "level": "INFO"},
}
