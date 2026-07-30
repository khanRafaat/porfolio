import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")

app = Celery("portfolio")

# All Celery config lives in Django settings under the CELERY_ namespace
app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discovers tasks.py in every installed app
app.autodiscover_tasks()
