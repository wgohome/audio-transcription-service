from backend.dependencies_setup import (
    SessionDep,
    TranscriptionRepositoryDep,
    TranscriptionServiceDep,
    create_db_and_tables,
)
from backend.db_models import Transcription
from fastapi import FastAPI, UploadFile
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline


# Model queues
models = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    models["transcriber_1"] = pipeline(
        task="automatic-speech-recognition", model="openai/whisper-tiny"
    )
    yield
    models.clear()


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def get_health():
    return {"status": "up"}


# For debugging purposes
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
def get_transcriptions(repo: TranscriptionRepositoryDep):
    return repo.get_transcriptions()


@app.get("/search", response_model=list[Transcription])
def search_transcription_by_filename(filename: str, repo: TranscriptionRepositoryDep):
    return repo.get_transcriptions(filename)


@app.post("/transcribe", response_model=list[Transcription])
async def upload_files_for_transcription(
    files: list[UploadFile], service: TranscriptionServiceDep
):
    result = await service.transcribe(files, models["transcriber_1"])
    if result.errors:
        return result.errors
    return result.data
