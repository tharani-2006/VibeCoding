import uuid
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlmodel import Session, select

from ..db import get_session
from ..models import Record
from ..services.cloudinary_service import upload_audio, upload_image
from ..services.openrouter_service import image_to_text, text_to_speech

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("/")
async def upload_image_endpoint(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
) -> dict:
    """Main endpoint: Upload image → Extract text → Generate speech → Store record."""
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Generate unique filename
        filename = f"{uuid.uuid4()}_{file.filename}"
        
        # Step 1: Upload image to Cloudinary
        image_url = await upload_image(file_content, filename)
        
        # Step 2: Extract text from image using OpenRouter
        text = await image_to_text(image_url)
        
        # Step 3: Generate speech from text using OpenRouter
        audio_content = await text_to_speech(text)
        
        # Step 4: Upload audio to Cloudinary
        audio_filename = f"{uuid.uuid4()}.wav"
        audio_url = await upload_audio(audio_content, audio_filename)
        
        # Step 5: Store record in database
        record = Record(
            image_url=image_url,
            text=text,
            audio_url=audio_url,
            created_at=datetime.utcnow(),
        )
        session.add(record)
        session.commit()
        session.refresh(record)
        
        return {
            "id": record.id,
            "image_url": record.image_url,
            "text": record.text,
            "audio_url": record.audio_url,
            "created_at": record.created_at.isoformat(),
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@router.get("/records")
def get_records(session: Session = Depends(get_session)) -> List[dict]:
    """Get all records from database."""
    records = session.exec(select(Record).order_by(Record.created_at.desc())).all()
    return [
        {
            "id": record.id,
            "image_url": record.image_url,
            "text": record.text,
            "audio_url": record.audio_url,
            "created_at": record.created_at.isoformat(),
        }
        for record in records
    ]
