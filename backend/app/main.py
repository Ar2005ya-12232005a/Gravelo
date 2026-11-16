import logging

from app.core.logging import configure_logging
configure_logging()
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import app.models  # noqa: F401  (registers tables with SQLAlchemy)
from app.api.v1.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.ml.model_loader import load_model

logger = logging.getLogger(__name__)

settings.uploads_dir.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)  # creates tables if they don't exist
    try:
        load_model()
    except FileNotFoundError as exc:
        logger.warning("Model weights not found — running without ML: %s", exc)
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)
app.mount("/media", StaticFiles(directory=settings.storage_dir), name="media")