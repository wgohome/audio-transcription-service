from backend.db_models import Transcription
from sqlmodel import Session, select


class TranscriptionRepository:
    def __init__(self, db: Session):
        self.db = db

    # Get all transcriptions.
    # If filter is provided, return transcriptions with filenames
    # that partially match the provided filter.
    def get_transcriptions(
        self,
        filter: str | None = None,
    ) -> list[Transcription]:
        if filter:
            statement = select(Transcription).where(
                Transcription.filename.ilike(f"%{filter}%")  # type: ignore
            )
        else:
            statement = select(Transcription)
        return list(self.db.exec(statement).all())

    # Return transcription filenames with filename equal to the provided filenames.
    # Batched operation to check if a list of filenames already exists.
    def get_existing_filenames(self, filenames: list[str]) -> list[str]:
        if not filenames:
            raise ValueError("Filenames cannot be empty.")
        statement = select(Transcription.filename).where(
            Transcription.filename.in_(filenames)  # type: ignore
        )
        return list(self.db.exec(statement).all())

    def create_transcriptions(
        self, transcriptions: list[Transcription]
    ) -> list[Transcription]:
        for transcription in transcriptions:
            self.db.add(transcription)
        self.db.commit()
        for transcription in transcriptions:
            # Bad! Many DB round trips per transcation. Needa check if ORM supports a better way or need manual SQL
            self.db.refresh(transcription)
        return transcriptions
