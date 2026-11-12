import os
from pydantic_settings import BaseSettings, Field

class Settings(BaseSettings):
    DATABASE_URL: str = Field(default="sqlite:///./data/muletrace.db")
    JWT_SECRET: str = Field(default="supersecretkey")
    JWT_ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60)
    FRONTEND_URL: str = Field(default="http://localhost:5173")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
