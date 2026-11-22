from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import uuid

from app.services.image_processor import process_image, MAX_FILE_SIZE

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png"
}


@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    # 1. Check declared file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail="Unsupported image format"
        )

    # 2. Read with a size limit
    contents = await file.read(MAX_FILE_SIZE + 1)
    await file.close()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image exceeds 10 MB limit"
        )

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty"
        )

    # 3. Validate actual image contents
    try:
        image, image_format = process_image(contents)

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    # 4. Generate unique filename
    file_id = str(uuid.uuid4())

    extension = {
        "JPEG": ".jpg",
        "PNG": ".png"
    }[image_format]

    filename = f"{file_id}{extension}"
    file_path = UPLOAD_DIR / filename

    # 5. Save validated image
    file_path.write_bytes(contents)

    # 6. Return response
    return {
        "message": "Image uploaded and validated successfully",
        "file_id": file_id,
        "filename": filename,
        "format": image_format,
        "width": image.width,
        "height": image.height,
        "size": len(contents)
    }