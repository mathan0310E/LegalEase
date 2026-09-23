from fastapi import APIRouter
from app.config import settings
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api", tags=["Health"])


@router.get("/health")
def health_check():
    """Health check endpoint for container and cloud load balancer probes."""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "gemini_configured": gemini_service.is_configured(),
        "gemini_model": settings.GEMINI_MODEL
    }
