from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 56000
    DATABASE_URL: str
    smtp_port: int
    smtp_server: str
    smtp_user: str
    smtp_password: str
    OPENAI_API_KEY: str
    class Config:
        env_file = ".env"

settings = Settings()