from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_db, read_upload
from app.ml.preprocess import InvalidImageError
from app.models.detection import Detection
from app.models.report import Report
from app.schemas.report import ReportList, ReportOut
from app.services import report_service

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("", response_model=ReportOut, status_code=201)
def create_report(
    file: UploadFile = File(...),
    latitude: float | None = Form(None, ge=-90, le=90),
    longitude: float | None = Form(None, ge=-180, le=180),
    db: Session = Depends(get_db),
):
    if (latitude is None) != (longitude is None):
        raise HTTPException(422, "Provide both latitude and longitude, or neither")
    data = read_upload(file)
    try:
        return report_service.create_report(db, data, file.filename, latitude, longitude)
    except InvalidImageError as e:
        raise HTTPException(400, str(e))


@router.get("", response_model=ReportList)
def list_reports(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    label: str | None = None,
    severity: str | None = None,
    db: Session = Depends(get_db),
):
    query = select(Report)
    if label:
        query = query.where(Report.detections.any(Detection.label == label))
    if severity:
        query = query.where(Report.detections.any(Detection.severity == severity))

    total = db.scalar(select(func.count()).select_from(query.subquery()))
    items = db.scalars(
        query.options(selectinload(Report.detections))  # one extra query, avoids N+1
        .order_by(Report.created_at.desc())
        .limit(limit)
        .offset(offset)
    ).all()
    return ReportList(total=total, limit=limit, offset=offset, items=items)


@router.get("/{report_id}", response_model=ReportOut)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.get(Report, report_id, options=[selectinload(Report.detections)])
    if report is None:
        raise HTTPException(404, "Report not found")
    return report


@router.delete("/{report_id}", status_code=204)
def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.get(Report, report_id)
    if report is None:
        raise HTTPException(404, "Report not found")
    report_service.delete_report(db, report)
    return None