from rest_framework import permissions, viewsets

from .models import Post
from .serializers import PostDetailSerializer, PostListSerializer


class PostViewSet(viewsets.ReadOnlyModelViewSet):
    """Public, published-only. Drafts are invisible here by design."""

    permission_classes = (permissions.AllowAny,)
    lookup_field = "slug"
    search_fields = ("title", "excerpt", "body")
    filterset_fields = ("category__slug",)
    ordering_fields = ("published_at",)

    def get_queryset(self):
        return (
            Post.objects.published()
            .select_related("category")
            .order_by("-published_at")
        )

    def get_serializer_class(self):
        return PostDetailSerializer if self.action == "retrieve" else PostListSerializer
