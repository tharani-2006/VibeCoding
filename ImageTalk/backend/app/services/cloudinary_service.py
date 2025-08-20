import cloudinary
import cloudinary.uploader
from fastapi import HTTPException

from ..config import settings


def init_cloudinary() -> None:
    """Initialize Cloudinary configuration."""
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
    )


async def upload_image(file_content: bytes, filename: str) -> str:
    """Upload image to Cloudinary and return public URL."""
    try:
        result = cloudinary.uploader.upload(
            file_content,
            public_id=f"imagetalk/images/{filename}",
            resource_type="image",
        )
        return result["secure_url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")


async def upload_audio(file_content: bytes, filename: str) -> str:
    """Upload audio to Cloudinary and return public URL."""
    try:
        result = cloudinary.uploader.upload(
            file_content,
            public_id=f"imagetalk/audio/{filename}",
            resource_type="video",  # Cloudinary treats audio as video
        )
        return result["secure_url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload audio: {str(e)}")
