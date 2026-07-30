from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager


class User(AbstractUser):
    """Email-login user with a coarse role for RBAC.

    Defined before the first migration on purpose: swapping
    AUTH_USER_MODEL on a live database is one of the most painful
    migrations in Django, so we get it right from day one.

    Coarse roles live here; fine-grained permissions come from Django's
    built-in groups/permissions when the portal needs them.
    """

    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        CLIENT = "client", "Client"

    username = None
    email = models.EmailField("email address", unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CLIENT)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self) -> str:
        return self.email

    @property
    def is_client(self) -> bool:
        return self.role == self.Role.CLIENT
