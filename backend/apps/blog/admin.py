from django.contrib import admin
from unfold.admin import ModelAdmin, StackedInline, TabularInline
from django.utils.html import format_html

from apps.common.media import public_media_url

from .models import Category, Post


@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ("name", "slug", "post_count")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)

    @admin.display(description="Posts")
    def post_count(self, obj):
        return obj.posts.count()


@admin.register(Post)
class PostAdmin(ModelAdmin):
    list_display = ("title", "category", "status", "published_at", "cover_preview")
    list_filter = ("status", "category")
    search_fields = ("title", "excerpt", "body")
    prepopulated_fields = {"slug": ("title",)}
    date_hierarchy = "published_at"
    actions = ["publish", "unpublish"]
    fieldsets = (
        (None, {"fields": ("title", "slug", "category", "status", "published_at")}),
        ("Content", {"fields": ("excerpt", "body", "cover_image", "cover_image_alt", "reading_minutes")}),
        ("SEO", {"classes": ("collapse",), "fields": ("seo_title", "seo_description", "canonical_url")}),
    )

    @admin.display(description="Cover")
    def cover_preview(self, obj):
        url = public_media_url(obj.cover_image)
        if not url:
            return "—"
        return format_html('<img src="{}" style="height:36px;border-radius:4px" />', url)

    @admin.action(description="Publish selected posts")
    def publish(self, request, queryset):
        for post in queryset:
            post.status = Post.Status.PUBLISHED
            post.save()

    @admin.action(description="Unpublish selected posts")
    def unpublish(self, request, queryset):
        queryset.update(status=Post.Status.DRAFT)
