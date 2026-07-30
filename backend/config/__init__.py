# Ensures the Celery app is loaded when Django starts, so shared_task
# decorators bind to it (analogous to Laravel registering queue workers
# through the app bootstrap).
from .celery import app as celery_app

__all__ = ("celery_app",)
