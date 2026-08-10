from functools import lru_cache
from hashlib import sha256
from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(Path(__file__).resolve().parents[2] / ".env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    cosmos_endpoint: str = Field(validation_alias=AliasChoices("COSMOS_ENDPOINT", "COSMOSDB_ENDPOINT"))
    cosmos_key: str = Field(validation_alias=AliasChoices("COSMOS_KEY", "COSMOSDB_KEY"))
    cosmos_database: str = "unesco-db"
    cosmos_users_container: str = "users"
    cosmos_chats_container: str = "chats"

    azure_openai_endpoint: str = Field(validation_alias="AZURE_OPENAI_ENDPOINT")
    azure_openai_api_key: str = Field(validation_alias="AZURE_OPENAI_API_KEY")
    azure_openai_chat_deployment: str = Field(validation_alias="AZURE_OPENAI_CHAT_DEPLOYMENT")
    azure_openai_api_version: str = "2024-12-01-preview"
    factcheck_api_key: str | None = Field(default=None, validation_alias="FACTCHECK_API_KEY")

    jwt_secret_raw: str = Field(default="", validation_alias="JWT_SECRET")
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 60 * 24 * 7
    cors_origins_raw: str = Field(default="http://localhost:5173", validation_alias="CORS_ORIGINS")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins_raw.split(",") if origin.strip()]

    @property
    def jwt_secret(self) -> str:
        if self.jwt_secret_raw:
            if len(self.jwt_secret_raw) < 32:
                raise RuntimeError("JWT_SECRET must be at least 32 characters")
            return self.jwt_secret_raw
        # Local compatibility for an existing .env. Production should set JWT_SECRET.
        return sha256(f"verifibot-jwt-v1:{self.cosmos_key}".encode()).hexdigest()


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
