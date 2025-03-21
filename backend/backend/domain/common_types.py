from typing import NamedTuple


class ValidationResult(NamedTuple):
    context: str | None
    message: str
