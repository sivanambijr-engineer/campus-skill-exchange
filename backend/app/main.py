from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from app.config import settings
from app.database import engine, Base
from app.routers import (
    auth,
    users,
    skills,
    swaps,
    messages,
    reviews,
    ai,
)


# =========================================================
# DATABASE
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)


# =========================================================
# CORS
# =========================================================
#
# LOCAL DEVELOPMENT
#
# Frontend:
#   http://localhost:3001
#
# Backend:
#   http://localhost:8000
#
# IMPORTANT:
# These localhost origins are for development/testing.
# Before production deployment, replace them with your
# actual deployed frontend URL.
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ROUTERS
# =========================================================

app.include_router(
    auth.router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    users.router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    skills.router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    swaps.router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    messages.router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    reviews.router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    ai.router,
    prefix=settings.API_PREFIX,
)


# =========================================================
# ROOT ENDPOINT
# =========================================================

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "docs": "/docs",
        "health": "/api/health",
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected",
    }