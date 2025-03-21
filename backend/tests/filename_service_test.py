from unittest.mock import MagicMock
from backend.domain.filename_service import AudioFileService
from fastapi import UploadFile
import pytest


def test_AudioFileService_generate_filename_without_duplicate_returns_original_name():
    # Arrange
    filename = "test.mp3"
    afs = AudioFileService()

    # Act and Assert
    assert afs.generate_filename(filename) == filename

    # Subsequent call should not generate the same filename again
    assert afs.generate_filename(filename) != filename


def test_AudioFileService_generate_filename_with_duplicate_returns_original_name():
    # Arrange
    filename = "test.mp3"
    afs = AudioFileService([filename])

    # Act
    result = afs.generate_filename(filename)

    # Assert
    assert result != filename
    assert len(result) > len(filename)
    assert result.startswith("test")
    assert result.endswith(".mp3")


def test_AudioFileService_validate_exceed_limit():
    # Arrange
    files: list[UploadFile] = [
        MagicMock(spec=UploadFile, filename=f"audio{i}.mp3") for i in range(11)
    ]

    # Act
    errors = AudioFileService.validate(files)

    # Assert
    assert len(errors) > 0
    assert "cannot upload more than" in errors[0].message.lower()


def test_AudioFileService_validate_filename_cannot_be_blank():
    # Arrange
    files: list[UploadFile] = [MagicMock(spec=UploadFile, filename="")]

    # Act
    errors = AudioFileService.validate(files)

    # Assert
    assert len(errors) > 0
    assert "filename cannot be blank" in errors[0].message.lower()


@pytest.mark.parametrize(
    "filename, expected_error",
    [
        ("test.mp3", True),
        ("test.mp4", False),
        ("test", False),
    ],
)
def test_AudioFileService_validate_extension(filename: str, expected_error: bool):
    # Arrange
    files: list[UploadFile] = [MagicMock(spec=UploadFile, filename=filename)]

    # Act
    errors = AudioFileService.validate(files)

    # Assert
    assert (len(errors) == 0) == expected_error
