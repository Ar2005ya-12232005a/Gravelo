import logging
from ultralytics import YOLO
from app.core.config import settings

logger = logging.getLogger(__name__)
_model: YOLO | None = None


def load_model() -> YOLO:
    global _model
    path = settings.model_file
    if not path.exists():
        raise FileNotFoundError(f"Model weights not found at {path}")
    logger.info("Loading model from %s", path)
    _model = YOLO(str(path))
    return _model


def get_model() -> YOLO:
    if _model is None:
        raise RuntimeError("Model is not loaded")
    return _model


def is_loaded() -> bool:
    return _model is not None