import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.routers import auth, documents, ai, templates, export, analytics, health
from app.utils.seed_demo import seed_demo_data

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("LegalEase")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed demo data
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    # Initialize demo data
    try:
        db = SessionLocal()
        seed_demo_data(db)
        db.close()
        logger.info("Demo data verified.")
    except Exception as e:
        logger.warning(f"Could not seed demo data on startup: {e}")

    yield
    logger.info("LegalEase backend shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    description="Enterprise AI-Powered Legal Document Generation Platform with Gemini",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router)
app.include_router(templates.router)
app.include_router(documents.router)
app.include_router(ai.router)
app.include_router(export.router)
app.include_router(analytics.router)
app.include_router(health.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to LegalEase AI Legal Document Generator API",
        "documentation": "/docs",
        "health": "/api/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=settings.DEBUG)
