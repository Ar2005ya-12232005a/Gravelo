from fastapi import APIRouter
from app.core.config import settings
from app.ml.model_loader import is_loaded

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    return {
        "status": "ok" if is_loaded() else "model_not_loaded",
        "model_loaded": is_loaded(),
        "model_version": settings.model_version,
    }