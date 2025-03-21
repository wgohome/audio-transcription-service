from datetime import datetime


def generate_filename(original_name: str, existing_filenames: list[str] = []) -> str:
    if not existing_filenames or original_name not in existing_filenames:
        return original_name
    name, ext = extract_file_extension(original_name)
    return f"{name}_{str(datetime.now())}.{ext}"


def extract_file_extension(filename: str) -> tuple[str, str]:
    segments = filename.split(".")
    if len(segments) == 1:
        return (filename, "")
    return (".".join(segments[:-1]), segments[-1])
