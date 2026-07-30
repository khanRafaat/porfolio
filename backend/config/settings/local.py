"""Local development settings."""
from .base import *  # noqa: F403

DEBUG = True

ALLOWED_HOSTS = ["*"]

# Print emails to the console instead of sending (Laravel: MAIL_MAILER=log)
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
