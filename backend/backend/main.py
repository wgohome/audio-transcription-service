from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def read_root():
    return {"status": "up"}


@app.get("/transcriptions")
def get_transcriptions():
    return []


@app.get("/search")
def search_transcription_by_filename():
    return {}
