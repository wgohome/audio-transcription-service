from typing import NamedTuple

from fastapi import UploadFile

from backend.db_models import Transcription
from backend.domain.common_types import ValidationResult
from backend.filename_service import AudioFileService
from backend.transcription_repository import TranscriptionRepository


class TransribeResult(NamedTuple):
    data: list[Transcription] | None = None
    errors: list[ValidationResult] | None = None
    warnings: list[ValidationResult] | None = None


class TranscriptionService:
    def __init__(self, transcription_repository: TranscriptionRepository):
        self.repo = transcription_repository

    async def transcribe(
        self,
        files: list[UploadFile],
        model,  # typing with `Pipeline` causes further type issues
    ) -> TransribeResult:
        # Call validators here
        errors = AudioFileService.validate(files)
        if errors:
            return TransribeResult(errors=errors)

        existing_filenames = self.repo.get_existing_filenames(
            [file.filename or "" for file in files]
        )
        afs = AudioFileService(existing_filenames)

        transcriptions: list[Transcription] = []
        for file in files:
            assert file.filename is not None  # Make the type checker happy
            filename = afs.generate_filename(file.filename)
            result = model(await file.read())
            transcription = Transcription(
                filename=filename, transcribed_text=result["text"]
            )
            transcriptions.append(transcription)

        self.repo.create_transcriptions(transcriptions)

        return TransribeResult(data=transcriptions, warnings=afs.warnings)
