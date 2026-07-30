from rest_framework import serializers

from apps.common.media import public_media_url

from .models import Category, Post


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("name", "slug", "description")


class PostListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            "title", "slug", "category", "excerpt", "cover_image_url",
            "cover_image_alt", "reading_minutes", "published_at", "updated_at",
        )

    def get_cover_image_url(self, obj) -> str | None:
        return public_media_url(obj.cover_image)


class PostDetailSerializer(PostListSerializer):
    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + (
            "body", "seo_title", "seo_description", "canonical_url",
        )
