# Backend API Service

## Endpoints



## Setup

These are the versions of dependencies known to work with this project:

- Python version: 3.12.2
- Potery: 1.8.3

For initial setup, create a virtual environment using venv.

```bash
python -m venv venv
```

## Development

For development, activate the virtual environment. Poetry will detect the activated virtual environment.

For Unix/MacOS

```bash
source venv/bin/activate
```

For windows

```ps1
.\venv\Scripts\activate
```

To run the dev server

```bash
poetry run fastapi dev backend/main.py
```

To run ruff linters and formatter

```bash
poetry run ruff check
```

```bash
poetry run ruff format
```

## Build

Build docker image for backend

```bash
docker build -t ats-backend .
```

Run container

```bash
docker run -d --name ats-backend-c-0.1 -p 80:80 ats-backend
```
