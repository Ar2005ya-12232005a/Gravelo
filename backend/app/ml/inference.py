import time
import numpy as np
from PIL import Image

from app.core.config import settings
from app.ml.model_loader import get_model
from app.ml.postprocess import severity_from_area


def run_model(image: Image.Image):
    """Returns the raw Ultralytics result and inference time in ms."""
    model = get_model()
    start = time.perf_counter()
    results = model.predict(
        image,
        imgsz=settings.img_size,
        conf=settings.conf_threshold,
        iou=settings.iou_threshold,
        device=settings.device,
        verbose=False,
    )
    ms = (time.perf_counter() - start) * 1000
    return results[0], ms


def to_detections(result) -> list[dict]:
    h, w = result.orig_shape
    names = result.names
    detections = []
    for box in result.boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        cls_id = int(box.cls[0])
        area_ratio = ((x2 - x1) * (y2 - y1)) / (w * h)
        detections.append({
            "class_id": cls_id,
            "label": names[cls_id],
            "confidence": round(float(box.conf[0]), 4),
            "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
            "area_ratio": round(area_ratio, 4),
            "severity": severity_from_area(area_ratio),
        })
    return detections


def render_annotated(result) -> np.ndarray:
    """Image with boxes drawn, as an RGB array."""
    return result.plot()[:, :, ::-1]  # plot() gives BGR, flip to RGB