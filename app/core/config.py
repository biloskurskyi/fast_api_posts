from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    db_pool_size: int = 20
    db_max_overflow: int = 25
    secret_key: str = Field(min_length=32)
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    auto_reply_poll_interval_seconds: int = 5
    auto_reply_batch_size: int = 100
    max_request_body_bytes: int = 1_048_576


settings = Settings()
