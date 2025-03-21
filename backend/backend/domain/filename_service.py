from datetime import datetime

from fastapi import UploadFile

from backend.domain.common_types import ValidationResult


# Scoped to each request
class AudioFileService:
    LIMIT = 10
    SUPPORTED_AUDIO_EXTENSIONS = [
        ".mp3",
        ".aac",
        ".ogg",
        ".wma",
        ".flac",
        ".alac",
        ".wav",
        ".aiff",
    ]

    def __init__(self, existing_filenames: list[str] = []):
        self.existing_filenames = existing_filenames
        self.warnings: list[ValidationResult] = []

    def generate_filename(self, original_name: str) -> str:
        if not self.existing_filenames or original_name not in self.existing_filenames:
            return original_name

        self.warnings.append(
            ValidationResult(
                context=original_name,
                message="Filename already exists. Appending timestamp to your filename.",
            )
        )
        name, ext = self.extract_file_extension(original_name)
        return f"{name}_{str(datetime.now())}.{ext}"

    @staticmethod
    def extract_file_extension(filename: str) -> tuple[str, str]:
        segments = filename.split(".")
        if len(segments) == 1:
            return (filename, "")
        return (".".join(segments[:-1]), segments[-1])

    @classmethod
    def validate(cls, files: list[UploadFile]) -> list[ValidationResult]:
        errors: list[ValidationResult] = []

        # Limit number of files
        if len(files) > cls.LIMIT:
            errors.append(
                ValidationResult(
                    context="files_batch",
                    message=f"Cannot upload more than {cls.LIMIT} files at once",
                )
            )

        for file in files:
            # Filename cannot be blank
            if not file.filename:
                errors.append(
                    ValidationResult(
                        context="files_batch", message="filename cannot be blank"
                    )
                )
            # Check file format
            assert file.filename is not None  # Make the type checker happy
            if not any(
                file.filename.endswith(ext) for ext in cls.SUPPORTED_AUDIO_EXTENSIONS
            ):
                errors.append(
                    ValidationResult(
                        context=file.filename,
                        message=f"Unsupported file format for {file.filename}",
                    )
                )
        return errors
