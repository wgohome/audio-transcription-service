import datetime
from sqlmodel import Field, SQLModel


class Transcription(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    filename: str = Field(index=True)
    transcribed_text: str | None = Field(default=None)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)


class HeroCreate(SQLModel):
    filename: str = Field()
