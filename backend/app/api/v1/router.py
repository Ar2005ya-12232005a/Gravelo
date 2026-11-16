from fastapi import APIRouter
from app.api.v1 import detect, health, reports, stats

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(detect.router)
api_router.include_router(reports.router)
api_router.include_router(stats.router)