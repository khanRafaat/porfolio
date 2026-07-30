"""File exchange via MinIO (feature 5).

Planned models:
    StoredFile — object key, owner, size, content type,
                 scan_status (pending/clean/infected) set by the
                 ClamAV Celery task before a file becomes downloadable
"""
