from django.contrib import admin
from unfold.admin import ModelAdmin, StackedInline, TabularInline
from django.utils.html import format_html

from apps.common.media import public_media_url

from .models import CaseStudy, CaseStudyImage, ContactMessage, Service, SiteText


class CaseStudyImageInline(TabularInline):
    model = CaseStudyImage
    extra = 1
    fields = ("preview", "image", "alt", "caption", "sort_order")
    readonly_fields = ("preview",)

    @admin.display(description="Preview")
    def preview(self, obj):
        url = public_media_url(obj.image) if obj.pk else None
        if not url:
            return "—"
        return format_html('<img src="{}" style="height:60px;border-radius:6px" />', url)


@admin.register(CaseStudy)
class CaseStudyAdmin(ModelAdmin):
    inlines = (CaseStudyImageInline,)
    list_display = ("title", "tag", "status", "featured", "sort_order", "cover_preview")
    list_filter = ("status", "featured", "tag")
    list_editable = ("featured", "sort_order")
    search_fields = ("title", "summary", "body")
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        (None, {"fields": ("title", "slug", "tag", "status", "published_at", "featured", "sort_order")}),
        ("Content", {"fields": ("summary", "body", "tech_stack", "cover_image", "cover_image_alt", "video_url")}),
        ("SEO", {"classes": ("collapse",), "fields": ("seo_title", "seo_description", "canonical_url")}),
    )

    @admin.display(description="Cover")
    def cover_preview(self, obj):
        url = public_media_url(obj.cover_image)
        if not url:
            return "—"
        return format_html('<img src="{}" style="height:36px;border-radius:4px" />', url)


@admin.register(Service)
class ServiceAdmin(ModelAdmin):
    list_display = ("title", "icon", "is_active", "sort_order")
    list_editable = ("is_active", "sort_order")
    search_fields = ("title", "description")


@admin.register(SiteText)
class SiteTextAdmin(ModelAdmin):
    list_display = ("key", "short_value", "note", "updated_at")
    search_fields = ("key", "value", "note")

    @admin.display(description="Value")
    def short_value(self, obj):
        return obj.value if len(obj.value) < 80 else obj.value[:77] + "…"


@admin.register(ContactMessage)
class ContactMessageAdmin(ModelAdmin):
    list_display = ("name", "email", "subject", "is_read", "created_at")
    list_filter = ("is_read",)
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("name", "email", "phone", "subject", "message", "created_at")
    actions = ["mark_read"]

    @admin.action(description="Mark selected as read")
    def mark_read(self, request, queryset):
        queryset.update(is_read=True)

    def has_add_permission(self, request):
        return False
