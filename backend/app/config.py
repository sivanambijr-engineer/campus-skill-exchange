import os

class Settings:
    PROJECT_NAME: str = "Campus Skill Exchange API"
    PROJECT_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "campus_skill_exchange_super_secret_jwt_key_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 1 week
    
    # PostgreSQL by default, SQLite fallback for quick local testing
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgrespassword@localhost:5432/campus_skills_db"
    )

settings = Settings()
