FROM python:3.12.2

RUN apt-get -y update

RUN apt-get -y upgrade

RUN apt-get install -y ffmpeg

RUN pip install poetry==1.8.3

ENV POETRY_NO_INTERACTION=1 \
  POETRY_VIRTUALENVS_IN_PROJECT=1 \
  POETRY_VIRTUALENVS_CREATE=1 \
  POETRY_CACHE_DIR=/tmp/poetry_cache

WORKDIR /app

COPY pyproject.toml poetry.lock ./
RUN touch README.md

RUN poetry install --without dev --no-root && rm -rf $POETRY_CACHE_DIR

COPY backend ./backend

RUN poetry install --without dev

EXPOSE 8000

CMD ["poetry", "run", "fastapi", "run", "backend/main.py", "--port", "8000"]
