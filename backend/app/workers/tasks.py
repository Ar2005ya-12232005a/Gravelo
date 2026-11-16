"""
tasks.py – Background Celery tasks (stub).

Wire these up once celery_app.py is configured.

Example:
    from app.workers.celery_app import celery_app
    from app.db.session import SessionLocal
    from app.services import report_service

    @celery_app.task(bind=True, max_retries=3)
    def async_create_report(self, data: bytes, filename: str, lat, lon):
        db = SessionLocal()
        try:
            report_service.create_report(db, data, filename, lat, lon)
        except Exception as exc:
            db.rollback()
            raise self.retry(exc=exc, countdown=5)
        finally:
            db.close()
"""
