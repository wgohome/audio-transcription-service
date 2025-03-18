from backend.db import SessionDep, create_db_and_tables
from backend.models import Transcription
from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from sqlmodel import select


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/health")
def get_health():
    return {"status": "up"}


# TODO: To update to /transcribe endpoint that takes files later
@app.post("/transcriptions", response_model=list[Transcription])
def create_transcription(filenames: list[str], session: SessionDep):
    transcriptions = [Transcription(filename=filename) for filename in filenames]
    for transcription in transcriptions:
        session.add(transcription)
    session.commit()
    for transcription in transcriptions:
        session.refresh(transcription)
    return transcriptions


@app.get("/transcriptions", response_model=list[Transcription])
def get_transcriptions(session: SessionDep):
    statement = select(Transcription).where(Transcription.transcribed_text is not None)
    transcriptions = session.exec(statement).all()
    return transcriptions


@app.get("/search", response_model=list[Transcription])
def search_transcription_by_filename(filename: str, session: SessionDep):
    statement = select(Transcription).where(
        Transcription.filename.like(f"%{filename}%")  # type: ignore
    )
    transcriptions = session.exec(statement).all()
    return transcriptions
