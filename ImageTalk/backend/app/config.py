from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # SQLite file in backend working directory by default
    DATABASE_URL: str = "sqlite:///./imagetalk.db"

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # HuggingFace
    HUGGINGFACE_API_KEY: str = ""
    HUGGINGFACE_IMAGE_TO_TEXT_MODEL: str = "HuggingFaceM4/comparison"

settings = Settings()
