from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import init_db
from .routers.health import router as health_router

app = FastAPI(title="ImageTalk API", version="0.1.0")

# Allow frontend during development; tighten for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/")
def read_root() -> dict:
    return {"name": "ImageTalk API", "status": "ok"}


app.include_router(health_router, prefix="/api")
