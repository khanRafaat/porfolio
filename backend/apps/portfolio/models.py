"""Public portfolio content: case studies, services, editable site text."""
from django.db import models
from django.utils.text import slugify

from apps.common.models import PublishableModel, SeoModel, TimeStampedModel


class CaseStudy(TimeStampedModel, PublishableModel, SeoModel):
    """A project deep-dive: problem → architecture → trade-offs → outcome."""

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    tag = models.CharField(
        max_length=60, help_text='Industry badge shown on cards, e.g. "Healthcare".'
    )
    summary = models.CharField(max_length=300, help_text="Card text + meta description fallback.")
    body = models.TextField(
        help_text="Markdown. Suggested sections: Problem, Architecture, Trade-offs, Outcomes."
    )
    tech_stack = models.JSONField(
        default=list, blank=True, help_text='Chips on the card, e.g. ["Laravel", "PostgreSQL"].'
    )
    cover_image = models.ImageField(upload_to="case-studies/", null=True, blank=True)
    cover_image_alt = models.CharField(max_length=200, blank=True)
    featured = models.BooleanField(default=False, help_text="Featured cards appear on the home page.")
    video_url = models.URLField(
        blank=True, help_text="YouTube link (watch/share/shorts URL) — embedded on the detail page."
    )
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name_plural = "case studies"
        ordering = ["sort_order", "-published_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:220]
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title


class Service(TimeStampedModel):
    """Freelance offering shown on the home page and services page."""

    class Icon(models.TextChoices):
        ARCHITECTURE = "architecture", "Architecture (layers)"
        CODE = "code", "Code (brackets)"
        INTEGRATION = "integration", "Integration (pulse)"
        AI = "ai", "AI (robot)"

    title = models.CharField(max_length=120)
    description = models.TextField()
    icon = models.CharField(max_length=20, choices=Icon.choices, default=Icon.CODE)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return self.title


class SiteText(TimeStampedModel):
    """Key/value store for every editable string on the site.

    The frontend fetches all entries as one JSON map and falls back to
    its built-in copy for any missing key — so deleting a row is always
    safe.
    """

    key = models.SlugField(
        max_length=100, unique=True,
        help_text='Referenced by the frontend, e.g. "hero_headline". Renaming breaks the reference.'
    )
    value = models.TextField()
    note = models.CharField(
        max_length=200, blank=True, help_text="Where this text appears (for your future self)."
    )

    class Meta:
        verbose_name = "site text"
        verbose_name_plural = "site texts"
        ordering = ["key"]

    def __str__(self) -> str:
        return self.key


class ContactMessage(TimeStampedModel):
    """Messages from the public contact form. Also emailed to CONTACT_EMAIL."""

    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} — {self.subject or self.message[:40]}"


class CaseStudyImage(TimeStampedModel):
    """Screenshot gallery for a case study (managed inline in admin)."""

    case_study = models.ForeignKey(
        CaseStudy, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="case-studies/gallery/")
    alt = models.CharField(max_length=200, blank=True, help_text="Describe the screenshot for SEO/accessibility.")
    caption = models.CharField(max_length=200, blank=True)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return self.alt or f"Image {self.pk}"
