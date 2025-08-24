import httpx
from fastapi import HTTPException

from ..config import settings


async def image_to_text(image_url: str) -> str:
    """Convert image to text using Hugging Face BLIP model."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
                headers={"Authorization": f"Bearer {settings.HF_API_TOKEN}"},
                json={"inputs": image_url},
                timeout=30.0,
            )
            response.raise_for_status()
            result = response.json()
            return result[0]["generated_text"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")


async def text_to_speech(text: str) -> bytes:
    """Convert text to speech using Hugging Face TTS model."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api-inference.huggingface.co/models/facebook/fastspeech2-en-ljspeech",
                headers={"Authorization": f"Bearer {settings.HF_API_TOKEN}"},
                json={"inputs": text},
                timeout=60.0,
            )
            response.raise_for_status()
            return response.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate speech: {str(e)}")
