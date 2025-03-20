# Frontend

## Local development

A known version of node that works is 22.3.1.

```bash
npm install
npm run dev
```

## Building docker image

```bash
docker build -t ats-frontend .
```

```bash
docker run -d -p 3000:3000 ats-frontend
```
