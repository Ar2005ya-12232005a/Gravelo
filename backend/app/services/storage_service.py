import uuid

from PIL import Image

from app.core.config import settings


def save_image(image: Image.Image) -> str:
    """Saves the image and returns its path relative to the storage folder."""
    settings.uploads_dir.mkdir(parents=True, exist_ok=True)
    name = f"{uuid.uuid4().hex}.jpg"
    image.save(settings.uploads_dir / name, format="JPEG", quality=90)
    return f"uploads/{name}"


def delete_image(relative_path: str) -> None:
    (settings.storage_dir / relative_path).unlink(missing_ok=True)