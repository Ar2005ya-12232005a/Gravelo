import io

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import Response
from PIL import Image

from app.api.deps import read_upload
from app.ml.preprocess import InvalidImageError
from app.schemas.detection import DetectionResponse
from app.services import detection_service

router = APIRouter(tags=["detection"])


@router.post("/detect", response_model=DetectionResponse)
def detect(file: UploadFile = File(...)):
    """Stateless: analyses the image but saves nothing."""
    data = read_upload(file)
    try:
        return detection_service.analyze_image(data, file.filename)
    except InvalidImageError as e:
        raise HTTPException(400, str(e))


@router.post("/detect/annotated")
def detect_annotated(file: UploadFile = File(...)):
    data = read_upload(file)
    try:
        arr = detection_service.annotate_image(data)
    except InvalidImageError as e:
        raise HTTPException(400, str(e))
    buf = io.BytesIO()
    Image.fromarray(arr).save(buf, format="JPEG", quality=90)
    return Response(content=buf.getvalue(), media_type="image/jpeg")