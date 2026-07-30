from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


def health(_request):
    """Liveness probe for nginx/compose healthchecks and uptime monitors."""
    return JsonResponse({"status": "ok"})


urlpatterns = [
    # Non-default path: cuts bot noise hammering /admin/ (still enforce
    # strong passwords — obscurity is a supplement, not a control).
    path("sharnav/", admin.site.urls),
    path("api/health/", health, name="health"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/v1/", include("config.api_v1")),
]
