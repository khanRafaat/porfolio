import logging

from django.conf import settings
from django.core.mail import EmailMessage
from rest_framework import permissions, status, viewsets
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import CaseStudy, ContactMessage, Service, SiteText
from .serializers import (
    CaseStudyDetailSerializer,
    CaseStudyListSerializer,
    ContactMessageSerializer,
    ServiceSerializer,
)

logger = logging.getLogger(__name__)


class CaseStudyViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.AllowAny,)
    lookup_field = "slug"
    search_fields = ("title", "summary", "body")
    filterset_fields = ("tag", "featured")

    def get_queryset(self):
        return CaseStudy.objects.published()

    def get_serializer_class(self):
        return (
            CaseStudyDetailSerializer
            if self.action == "retrieve"
            else CaseStudyListSerializer
        )


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ServiceSerializer
    pagination_class = None
    queryset = Service.objects.filter(is_active=True)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def site_text(_request):
    """All editable site strings as one {key: value} map."""
    return Response(dict(SiteText.objects.values_list("key", "value")))


class ContactView(APIView):
    """Public contact form: store the message, then email it to me.

    The DB write is the source of truth (visible in admin); email is
    best-effort so a broken SMTP config never loses a lead.
    """

    permission_classes = (permissions.AllowAny,)
    throttle_scope = "contact"
    throttle_classes = (ScopedRateThrottle,)

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if data.pop("website", ""):
            # Honeypot tripped — pretend success, store nothing.
            return Response({"ok": True}, status=status.HTTP_201_CREATED)

        msg = ContactMessage.objects.create(**data)

        try:
            EmailMessage(
                subject=f"[Portfolio] {msg.subject or 'New contact message'} — {msg.name}",
                body=(
                    f"From: {msg.name} <{msg.email}>\n"
                    f"Phone: {msg.phone or '-'}\n\n"
                    f"{msg.message}"
                ),
                to=[settings.CONTACT_EMAIL],
                reply_to=[msg.email],
            ).send(fail_silently=False)
        except Exception:  # pragma: no cover
            logger.exception("Contact email failed to send (message id=%s)", msg.id)

        return Response({"ok": True}, status=status.HTTP_201_CREATED)
