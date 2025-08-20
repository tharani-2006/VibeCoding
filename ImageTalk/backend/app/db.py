from contextlib import contextmanager

from sqlmodel import SQLModel, Session, create_engine

from .config import settings


engine = create_engine(settings.DATABASE_URL, echo=False)


def init_db() -> None:
    # Import models here so SQLModel sees them before create_all
    from .models import Record  # noqa: F401

    SQLModel.metadata.create_all(engine)


@contextmanager
def session_scope() -> Session:
    """Provide a transactional scope around a series of operations."""
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# FastAPI dependency

def get_session():
    with Session(engine) as session:
        yield session
