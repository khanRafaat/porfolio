from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CaseStudyViewSet, ContactView, ServiceViewSet, site_text

router = DefaultRouter()
router.register("case-studies", CaseStudyViewSet, basename="case-study")
router.register("services", ServiceViewSet, basename="service")

urlpatterns = [
    path("site-text/", site_text, name="site-text"),
    path("contact/", ContactView.as_view(), name="contact"),
    *router.urls,
]
