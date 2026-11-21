import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(ENV_PATH)
load_dotenv()

DEFAULT_PG_URL = "postgresql://postgres:nwu12345@localhost:5432/notebridge"

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "NoteBridge API")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "nwu_notebridge_super_secret_key_change_in_production_2026")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    DATABASE_URL: str = os.getenv("DATABASE_URL", DEFAULT_PG_URL)
    
    @property
    def cors_origins(self) -> list[str]:
        raw = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000")
        return [origin.strip() for origin in raw.split(",") if origin.strip()]

settings = Settings()
