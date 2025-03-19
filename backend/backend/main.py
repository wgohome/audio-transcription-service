from backend.db_setup import SessionDep, create_db_and_tables
from backend.domain.generate_filename import generate_filename
from backend.models import Transcription
from fastapi import FastAPI, UploadFile
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import select
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


@app.post("/transcribe", response_model=list[Transcription])
async def upload_files_for_transcription(files: list[UploadFile], session: SessionDep):
    filenames = [file.filename for file in files]
    statement = select(Transcription.filename).where(
        Transcription.filename.in_(filenames)  # type: ignore
    )
    existing_transcriptions = session.exec(statement).all()

    transcriptions: list[Transcription] = []
    for file in files:
        if not file.filename:
            # Error handling
            continue
        formatted_filename = (
            generate_filename(file.filename, list(existing_transcriptions))
            if file.filename in existing_transcriptions
            else file.filename
        )

        audio_content = await file.read()
        result = models["transcriber_1"](audio_content)
        transcription = Transcription(
            filename=formatted_filename, transcribed_text=result["text"]
        )
        transcriptions.append(transcription)
        session.add(transcription)

    session.commit()

    # Bad! Many DB round trips per transcation. Needa check if ORM supports a better way or need manual SQL
    for transcription in transcriptions:
        session.refresh(transcription)

    return transcriptions


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
