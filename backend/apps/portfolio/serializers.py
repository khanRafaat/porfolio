from rest_framework import serializers

from apps.common.media import public_media_url

from .models import CaseStudy, CaseStudyImage, Service


class CaseStudyListSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = CaseStudy
        fields = (
            "title", "slug", "tag", "summary", "tech_stack",
            "cover_image_url", "cover_image_alt", "featured",
            "published_at", "updated_at",
        )

    def get_cover_image_url(self, obj) -> str | None:
        return public_media_url(obj.cover_image)


class CaseStudyImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = CaseStudyImage
        fields = ("url", "alt", "caption")

    def get_url(self, obj) -> str | None:
        return public_media_url(obj.image)


class CaseStudyDetailSerializer(CaseStudyListSerializer):
    images = CaseStudyImageSerializer(many=True, read_only=True)

    class Meta(CaseStudyListSerializer.Meta):
        fields = CaseStudyListSerializer.Meta.fields + (
            "body", "video_url", "images", "seo_title", "seo_description", "canonical_url",
        )


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ("title", "description", "icon")


class ContactMessageSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=40, required=False, allow_blank=True, default="")
    subject = serializers.CharField(max_length=200, required=False, allow_blank=True, default="")
    message = serializers.CharField(max_length=5000)
    # Honeypot: real users never fill this; bots do. Field is hidden in the UI.
    website = serializers.CharField(required=False, allow_blank=True, default="")
