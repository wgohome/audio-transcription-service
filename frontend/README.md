# Frontend

## Local development

A known version of node that works is 22.3.1.

To run the frontend application:

```bash
npm install
npm run dev
```

## Building docker image

Build docker image for frontend

```bash
docker build -t ats-frontend .
```

Run container

```bash
docker run -d -p 3000:3000 ats-frontend
```
