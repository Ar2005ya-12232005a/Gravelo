from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]  # .../Gravelo/backend


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="ignore")

    app_name: str = "RoadScan AI"
    api_v1_prefix: str = "/api/v1"

    # Model
    model_path: str = "weights/best.pt"
    model_version: str = "yolo11s-baseline"
    img_size: int = 640            # same size the model was trained at
    conf_threshold: float = 0.25   # drop detections below this confidence
    iou_threshold: float = 0.45    # NMS overlap threshold
    device: str = "cpu"            # "cpu" or "0" for the first GPU

    # Uploads
    max_upload_mb: int = 10
    allowed_content_types: list[str] = ["image/jpeg", "image/png"]

    # Frontend dev servers (Vite and React defaults)
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Database (SQLite for now; switch by changing DATABASE_URL in .env)
    database_url: str = f"sqlite:///{(BASE_DIR / 'roadscan.db').as_posix()}"

    @property
    def storage_dir(self) -> Path:
        return BASE_DIR / "storage"

    @property
    def uploads_dir(self) -> Path:
        return self.storage_dir / "uploads"

    @property
    def model_file(self) -> Path:
        p = Path(self.model_path)
        return p if p.is_absolute() else BASE_DIR / p


settings = Settings()