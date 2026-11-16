from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    filename: Mapped[str | None] = mapped_column(String(255))
    image_path: Mapped[str] = mapped_column(String(255))
    image_width: Mapped[int]
    image_height: Mapped[int]
    latitude: Mapped[float | None] = mapped_column(Float, index=True)
    longitude: Mapped[float | None] = mapped_column(Float, index=True)
    model_version: Mapped[str] = mapped_column(String(100))
    detection_count: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, index=True
    )

    detections: Mapped[list["Detection"]] = relationship(
        back_populates="report", cascade="all, delete-orphan"
    )