import io
from PIL import Image, UnidentifiedImageError


class InvalidImageError(ValueError):
    pass


def decode_image(data: bytes) -> Image.Image:
    try:
        img = Image.open(io.BytesIO(data))
        img.load()  # forces full decode, so corrupt files fail here
    except (UnidentifiedImageError, OSError):
        raise InvalidImageError("File is not a valid image")
    return img.convert("RGB")