"""
celery_app.py – Celery application factory (stub).

Uncomment and configure when you add a broker (Redis / RabbitMQ).

Example .env additions:
    CELERY_BROKER_URL=redis://localhost:6379/0
    CELERY_RESULT_BACKEND=redis://localhost:6379/1
"""

# from celery import Celery
# from app.core.config import settings
#
# celery_app = Celery(
#     "gravelo",
#     broker=settings.celery_broker_url,
#     backend=settings.celery_result_backend,
#     include=["app.workers.tasks"],
# )
#
# celery_app.conf.update(
#     task_serializer="json",
#     result_serializer="json",
#     accept_content=["json"],
#     timezone="UTC",
#     enable_utc=True,
# )
