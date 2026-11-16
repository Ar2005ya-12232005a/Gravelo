from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, computed_field


class DetectionRecord(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    class_id: int
    label: str
    confidence: float
    x1: float
    y1: float
    x2: float
    y2: float
    area_ratio: float
    severity: str


class ReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    filename: str | None
    image_path: str = Field(exclude=True)  # internal, not sent to clients
    image_width: int
    image_height: int
    latitude: float | None
    longitude: float | None
    model_version: str
    detection_count: int
    created_at: datetime
    detections: list[DetectionRecord]

    @computed_field
    @property
    def image_url(self) -> str:
        return f"/media/{self.image_path}"


class ReportList(BaseModel):
    total: int
    limit: int
    offset: int
    items: list[ReportOut]


class StatsOut(BaseModel):
    total_reports: int
    total_detections: int
    by_label: dict[str, int]
    by_severity: dict[str, int]