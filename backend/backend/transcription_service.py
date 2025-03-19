import asyncio
from transformers import pipeline


async def server_loop(q):
    transcriber = pipeline(
        task="automatic-speech-recognition", model="openai/whisper-tiny"
    )
    while True:
        (string, response_q) = await q.get()
        out = transcriber(string)
        await response_q.put(out)


async def setup_transcriber_queue():
    q = asyncio.Queue()
    asyncio.create_task(server_loop(q))
    return q
