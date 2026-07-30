from rest_framework import permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Project
from .serializers import ProjectSerializer


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def demo_projects(_request):
    """Public demo preview for /portal — only projects flagged is_demo."""
    qs = Project.objects.filter(is_demo=True).prefetch_related(
        "milestones", "invoices", "updates"
    )
    return Response(ProjectSerializer(qs, many=True).data)


class MyProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """The real thing (used once the auth feature lands): a client sees
    only their own projects. IsAuthenticated is the DRF default here."""

    serializer_class = ProjectSerializer

    def get_queryset(self):
        return (
            Project.objects.filter(client=self.request.user, is_demo=False)
            .prefetch_related("milestones", "invoices", "updates")
        )
