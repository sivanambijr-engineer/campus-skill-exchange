import os
from pathlib import Path

from dotenv import load_dotenv


# =========================================================
# LOAD PROJECT ROOT .ENV
# =========================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]
ENV_FILE = PROJECT_ROOT / ".env"

load_dotenv(ENV_FILE)


class Settings:

    PROJECT_NAME: str = "Campus Skill Exchange API"

    PROJECT_VERSION: str = "1.0.0"

    API_PREFIX: str = "/api"


    # =====================================================
    # SECURITY
    # =====================================================

    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "campus_skill_exchange_dev_secret"
    )

    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7


    # =====================================================
    # DATABASE
    # =====================================================

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./campus_skill_exchange.db"
    )


    # =====================================================
    # FRONTEND
    # =====================================================

    FRONTEND_URL: str = os.getenv(
        "FRONTEND_URL",
        "http://localhost:3001"
    )


    # =====================================================
    # GOOGLE AUTH
    # =====================================================

    GOOGLE_CLIENT_ID: str = os.getenv(
        "GOOGLE_CLIENT_ID",
        ""
    )


settings = Settings()


# =========================================================
# STARTUP CONFIGURATION LOG
# =========================================================

print(
    f"[CONFIG] Loaded .env from: {ENV_FILE}"
)

print(
    f"[CONFIG] Frontend URL: {settings.FRONTEND_URL}"
)

print(
    "[CONFIG] Google Client ID loaded:",
    bool(settings.GOOGLE_CLIENT_ID)
)

if not settings.GOOGLE_CLIENT_ID:
    print(
        "[WARNING] GOOGLE_CLIENT_ID is empty. "
        "Google authentication is disabled."
    )