from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel, Field


class Record(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    image_url: str
    text: str
    audio_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
