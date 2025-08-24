import httpx
from fastapi import HTTPException

from ..config import settings


async def image_to_text(image_url: str) -> str:
    """Convert image to text using OpenRouter."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": settings.OPENROUTER_IMAGE_TO_TEXT_MODEL,
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": "Describe this image in detail:"},
                                {"type": "image_url", "image_url": {"url": image_url}}
                            ]
                        }
                    ],
                    "temperature": 0.7,
                    "timeout": 30.0
                }
            )
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")


async def text_to_speech(text: str) -> bytes:
    """Convert text to speech using OpenRouter."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/audio/speech",
                headers={
                    "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": settings.OPENROUTER_TEXT_TO_SPEECH_MODEL,
                    "input": text,
                    "voice": "female_01",
                    "response_format": "wav"
                },
                timeout=60.0
            )
            response.raise_for_status()
            return response.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate speech: {str(e)}")
