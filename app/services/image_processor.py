from PIL import Image, UnidentifiedImageError
from io import BytesIO

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

ALLOWED_FORMATS = {"JPEG", "PNG"}


def process_image(contents: bytes):

    # 1. Check file size
    if len(contents) > MAX_FILE_SIZE:
        raise ValueError("Image exceeds 10 MB limit")

    # 2. Open and verify image
    try:
        image = Image.open(BytesIO(contents))

        if image.format not in ALLOWED_FORMATS:
            raise ValueError("Only JPEG and PNG images are allowed")

        image.verify()

        # 3. Reopen after verification
        image = Image.open(BytesIO(contents))

        # 4. Convert to RGB
        image_format = image.format
        image = image.convert("RGB")

        return image.copy(), image.format or "JPEG"

    except (UnidentifiedImageError, OSError):
        raise ValueError("Invalid or corrupted image")