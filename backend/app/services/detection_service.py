from collections import Counter

from app.core.config import settings
from app.ml.inference import run_model, to_detections, render_annotated
from app.ml.preprocess import decode_image
from app.schemas.detection import DetectionResponse


def analyze_image(data: bytes, filename: str | None) -> DetectionResponse:
    image = decode_image(data)
    result, ms = run_model(image)
    detections = to_detections(result)
    return DetectionResponse(
        filename=filename,
        image_width=image.width,
        image_height=image.height,
        model_version=settings.model_version,
        inference_ms=round(ms, 1),
        count=len(detections),
        summary=dict(Counter(d["label"] for d in detections)),
        detections=detections,
    )


def annotate_image(data: bytes):
    image = decode_image(data)
    result, _ = run_model(image)
    return render_annotated(result)