from fastapi import FastAPI

from app.api.routes import health, detection

app = FastAPI(
    title="RoadScan AI Backend",
    description="Computer Vision Road Defect Detection API",
    version="1.0.0"
)

app.include_router(
    health.router,
    prefix="/api/v1"
)

app.include_router(
    detection.router,
    prefix="/api/v1/detections"
)