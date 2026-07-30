from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import MyProjectViewSet, demo_projects

router = DefaultRouter()
router.register("projects", MyProjectViewSet, basename="my-project")

urlpatterns = [path("demo/", demo_projects, name="portal-demo"), *router.urls]
