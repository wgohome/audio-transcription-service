from unittest.mock import MagicMock, call
from backend.domain.transcription_repository import TranscriptionRepository
from backend.domain.trascription_service import TranscriptionService
from fastapi import UploadFile
import pytest

@pytest.mark.asyncio
async def test_TranscriptionService_transcribe_calls_validate():
    # Arrange
    file1 = MagicMock(spec=UploadFile, filename="test.mp3")
    async def file1read():
        return "1"
    file1.read.side_effect = file1read

    file2 = MagicMock(spec=UploadFile, filename="test2.mp3")
    async def file2read():
        return "2"
    file2.read.side_effect = file2read

    files: list[UploadFile] = [file1, file2]
    repo = MagicMock(spec=TranscriptionRepository)
    model = MagicMock(return_value={ "text": "transcribed text" })
    service = TranscriptionService(repo)

    # Act
    result = await service.transcribe(files, model)

    # Assert
    assert result.data is not None
    assert result.data[1].transcribed_text == "transcribed text"

    model.assert_has_calls([call("1"), call("2")])
