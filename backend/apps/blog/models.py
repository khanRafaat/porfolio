"""Blog — the SEO/AEO engine."""
from django.db import models
from django.utils.text import slugify

from apps.common.models import PublishableModel, SeoModel, TimeStampedModel


class Category(TimeStampedModel):
    """Topic clusters: Laravel, Spring Boot, System Design, ..."""

    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class Post(TimeStampedModel, PublishableModel, SeoModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.ForeignKey(
        Category, null=True, blank=True, on_delete=models.SET_NULL, related_name="posts"
    )
    excerpt = models.CharField(
        max_length=300, help_text="Short summary shown in lists; meta description fallback."
    )
    body = models.TextField(help_text="Markdown.")
    cover_image = models.ImageField(upload_to="blog/covers/", null=True, blank=True)
    cover_image_alt = models.CharField(max_length=200, blank=True)
    reading_minutes = models.PositiveSmallIntegerField(
        default=0, help_text="0 = computed automatically from the body on save."
    )

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:220]
        if not self.reading_minutes:
            self.reading_minutes = max(1, round(len(self.body.split()) / 220))
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title
