"""Media URL helpers for MinIO/S3.

Presigned URLs are generated against the in-network endpoint
(http://minio:9000). Browsers can't resolve that hostname in dev, so we
rewrite to S3_PUBLIC_ENDPOINT_URL. In production both point at the same
public host and the rewrite is a no-op.
"""
from django.conf import settings


def public_media_url(field) -> str | None:
    if not field:
        return None
    url: str = field.url
    internal = settings.STORAGES["default"]["OPTIONS"]["endpoint_url"]
    public = settings.S3_PUBLIC_ENDPOINT_URL
    if internal and public and url.startswith(internal):
        return public + url[len(internal):]
    return url
