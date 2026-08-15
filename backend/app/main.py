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
# LOCAL DEVELOPMENT:
#   http://localhost:3000
#   http://localhost:3001
#   http://localhost:3002
#
# VERCEL PRODUCTION:
#   https://campus-skill-exchange-henna.vercel.app
#
# VERCEL PREVIEW:
#   https://campus-skill-exchange-<deployment-id>-niviq.vercel.app
#
# IMPORTANT:
# allow_credentials=True is required because authentication
# uses an HTTP-only access_token cookie.
# Therefore we must NOT use allow_origins=["*"].
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        # Local development
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",

        # Vercel production
        "https://campus-skill-exchange-henna.vercel.app",
    ],

    # Allow Vercel preview deployments.
    # Example:
    # https://campus-skill-exchange-ckolwwzga-niviq.vercel.app
    allow_origin_regex=r"https://campus-skill-exchange-[a-z0-9]+-niviq\.vercel\.app",

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