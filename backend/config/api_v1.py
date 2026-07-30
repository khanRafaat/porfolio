"""API v1 router — each app plugs its urls in here as features land."""
from django.urls import include, path

urlpatterns = [
    path("blog/", include("apps.blog.urls")),
    path("portfolio/", include("apps.portfolio.urls")),
    # path("auth/", include("apps.accounts.urls")),
    path("portal/", include("apps.portal.urls")),
    # path("files/", include("apps.files.urls")),
]
