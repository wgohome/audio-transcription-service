from backend.domain.filename_service import AudioFileService


def test_AudioFileService_generate_filename_without_duplicate_returns_original_name():
    filename = "test.mp3"
    afs = AudioFileService()

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
    assert result != "test.mp3"
    assert result.startswith("test")
    assert result.endswith(".mp3")
