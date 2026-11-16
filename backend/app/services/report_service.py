from sqlalchemy.orm import Session

from app.core.config import settings
from app.ml.inference import run_model, to_detections
from app.ml.preprocess import decode_image
from app.models.detection import Detection
from app.models.report import Report
from app.services import storage_service


def create_report(
    db: Session,
    data: bytes,
    filename: str | None,
    latitude: float | None,
    longitude: float | None,
) -> Report:
    image = decode_image(data)
    result, _ = run_model(image)
    dets = to_detections(result)

    image_path = storage_service.save_image(image)

    report = Report(
        filename=filename,
        image_path=image_path,
        image_width=image.width,
        image_height=image.height,
        latitude=latitude,
        longitude=longitude,
        model_version=settings.model_version,
        detection_count=len(dets),
        detections=[
            Detection(
                class_id=d["class_id"],
                label=d["label"],
                confidence=d["confidence"],
                x1=d["bbox"]["x1"],
                y1=d["bbox"]["y1"],
                x2=d["bbox"]["x2"],
                y2=d["bbox"]["y2"],
                area_ratio=d["area_ratio"],
                severity=d["severity"],
            )
            for d in dets
        ],
    )
    db.add(report)
    try:
        db.commit()
    except Exception:
        db.rollback()
        storage_service.delete_image(image_path)  # don't leave an orphan file
        raise
    return report


def delete_report(db: Session, report: Report) -> None:
    path = report.image_path
    db.delete(report)
    db.commit()
    storage_service.delete_image(path)