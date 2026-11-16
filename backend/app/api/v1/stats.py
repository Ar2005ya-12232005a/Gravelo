from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.detection import Detection
from app.models.report import Report
from app.schemas.report import StatsOut

router = APIRouter(tags=["stats"])


@router.get("/stats", response_model=StatsOut)
def stats(db: Session = Depends(get_db)):
    by_label = dict(db.execute(
        select(Detection.label, func.count()).group_by(Detection.label)
    ).all())
    by_severity = dict(db.execute(
        select(Detection.severity, func.count()).group_by(Detection.severity)
    ).all())
    return StatsOut(
        total_reports=db.scalar(select(func.count()).select_from(Report)),
        total_detections=sum(by_label.values()),
        by_label=by_label,
        by_severity=by_severity,
    )