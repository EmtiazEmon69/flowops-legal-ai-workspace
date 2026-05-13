from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "FlowOps AI"
    api_prefix: str = "/api/v1"
    database_url: str = "sqlite:///./flowops.db"
    openai_api_key: str | None = None
    ai_mock_mode: bool = False

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
