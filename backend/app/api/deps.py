from fastapi import HTTPException, UploadFile

from app.core.config import settings
from app.db.session import SessionLocal


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def read_upload(file: UploadFile) -> bytes:
    if file.content_type not in settings.allowed_content_types:
        raise HTTPException(415, "Only JPEG and PNG images are supported")
    data = file.file.read()
    if len(data) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(413, f"File larger than {settings.max_upload_mb} MB")
    return data