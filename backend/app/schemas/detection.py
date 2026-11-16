from typing import Literal
from pydantic import BaseModel


class BBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


class Detection(BaseModel):
    class_id: int
    label: str
    confidence: float
    bbox: BBox
    area_ratio: float
    severity: Literal["low", "medium", "high"]


class DetectionResponse(BaseModel):
    filename: str | None
    image_width: int
    image_height: int
    model_version: str
    inference_ms: float
    count: int
    summary: dict[str, int]  # e.g. {"pothole": 2, "crack": 1}
    detections: list[Detection]