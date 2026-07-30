"""Abstract base models shared across apps (no tables of their own)."""
from django.db import models


class TimeStampedModel(models.Model):
    """created_at/updated_at on every row (Laravel's $timestamps)."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SoftDeleteQuerySet(models.QuerySet):
    def delete(self):
        from django.utils import timezone

        return super().update(deleted_at=timezone.now())

    def alive(self):
        return self.filter(deleted_at__isnull=True)


class SoftDeleteModel(models.Model):
    """Opt-in soft deletes (Laravel's SoftDeletes trait).

    Default manager returns only live rows; use all_objects to include
    deleted ones (e.g. in admin or audits).
    """

    deleted_at = models.DateTimeField(null=True, blank=True, db_index=True)

    objects = SoftDeleteQuerySet.as_manager()
    all_objects = models.Manager()

    class Meta:
        abstract = True
        base_manager_name = "all_objects"

    def delete(self, using=None, keep_parents=False):
        from django.utils import timezone

        self.deleted_at = timezone.now()
        self.save(update_fields=["deleted_at"])

    def hard_delete(self):
        super().delete()


class PublishedQuerySet(models.QuerySet):
    def published(self):
        from django.utils import timezone

        return self.filter(
            status=PublishableModel.Status.PUBLISHED,
            published_at__lte=timezone.now(),
        )


class PublishableModel(models.Model):
    """Draft/published workflow with scheduling via published_at."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.DRAFT, db_index=True
    )
    published_at = models.DateTimeField(
        null=True,
        blank=True,
        db_index=True,
        help_text="Set automatically on first publish; set a future date to schedule.",
    )

    objects = PublishedQuerySet.as_manager()

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        from django.utils import timezone

        if self.status == self.Status.PUBLISHED and self.published_at is None:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)


class SeoModel(models.Model):
    """Per-page SEO overrides; frontend falls back to title/excerpt."""

    seo_title = models.CharField(
        max_length=70, blank=True, help_text="≤60 chars ideal. Falls back to the title."
    )
    seo_description = models.CharField(
        max_length=170, blank=True, help_text="≤155 chars ideal. Falls back to the excerpt/summary."
    )
    canonical_url = models.URLField(
        blank=True, help_text="Only when this content is republished from elsewhere."
    )

    class Meta:
        abstract = True
