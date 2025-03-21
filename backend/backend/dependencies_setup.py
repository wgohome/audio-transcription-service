from functools import lru_cache
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine

from backend.domain.transcription_repository import TranscriptionRepository
from backend.domain.trascription_service import TranscriptionService

sqlite_file_name = "transcriptions.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
connect_args = {"check_same_thread": False}


"""
DB session dependency
"""


@lru_cache
def get_db_engine():
    engine = create_engine(sqlite_url, connect_args=connect_args)
    return engine


def create_db_and_tables():
    SQLModel.metadata.create_all(get_db_engine())


def get_session():
    with Session(get_db_engine()) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


"""
TranscriptionRepository dependency
"""


def get_transcription_repository(db: SessionDep) -> TranscriptionRepository:
    return TranscriptionRepository(db)


TranscriptionRepositoryDep = Annotated[
    TranscriptionRepository, Depends(get_transcription_repository)
]


"""
TranscriptionService dependency
"""


def get_transcription_service(repo: TranscriptionRepositoryDep) -> TranscriptionService:
    return TranscriptionService(repo)


TranscriptionServiceDep = Annotated[
    TranscriptionService, Depends(get_transcription_service)
]
