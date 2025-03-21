from unittest.mock import MagicMock
from backend.domain.transcription_repository import TranscriptionRepository
from backend.domain.trascription_service import TranscriptionService
from fastapi import UploadFile
import pytest

@pytest.mark.asyncio
async def test_TranscriptionService_transcribe_calls_validate():
    # Arrange
    file1 = MagicMock(spec=UploadFile, filename="test.mp3")
    async def file1read():
        return b"1"
    file1.read.return_value = file1read

    file2 = MagicMock(spec=UploadFile, filename="test2.mp3")
    async def file2read():
        return b"2"
    file2.read.return_value = file2read

    files: list[UploadFile] = [file1, file2]

    repo = MagicMock(spec=TranscriptionRepository)
    model = MagicMock(side_effect=lambda x: {
        b"1": { "text": "a" },
        b"2": { "text": "b" },
    }.get(x, "default"))

    service = TranscriptionService(repo)

    # Act
    result = await service.transcribe(files, model)

    # Assert
    assert result.data is not None
    assert result.data[0].transcribed_text == "transcribed text"
