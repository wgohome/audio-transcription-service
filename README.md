# Audio Transcription Service

This is an audio transcription application which allows users to upload one or more audio files via a web UI, to receive transcription of their audio files. Users can also browse previously transcribed audio by searching by file name.

The application is served as a single-page-application (SPA) frontend web application connected to a RESTful backend API performs the inference task and stores transcriptions in a database.

In production, the frontend and backend can ideally be deployed separately. The frontend can be built and served via a CDN - the benefit of using a SPA framework - as this will be more cost effective. The backend API needs to be hosted on a server, that can be exposed via HTTPS. For this reason, a docker-compose build was not prepared, but separate dockerfiles were written for the frontend and backend respectively.

To run the frontend and backend docker builds, or to run locally, refer to the respective documentation:

- [Frontend](frontend/README.md)
- [Backend](backend/README.md)

![Architecture Diagram](docs/architecture_diagram.png)

The frontend is built on React + Vite as a SPA, providing a richer interactive user experience than the traditional (obsolete) server rendered pages. There is no requirement for SEO-optimization, therefore SPA is more suitable compared to Server Side Generation (SSG) / Server Side Rendering (SSR) / React Server Component (RSC) frameworks. The frontend communicated with the backend via HTTP/HTTPS requests, passing data in JSON format (the files are submitted using form data).

The backend API is build with FastAPI Python framework. The rich Python ecosystem gave us the benefit of libraries like Hugging Face's "transformers", which gives us convenient wrapper like "Pipeline" to run inference on pretrained models.

The backend system is represented by the right half of the diagram. On initial spin up of the backend server for the first time, the whisper-tiny model will be pulled from Hugging Face and downloaded to the server (or your local computer if running locally). The lag time should be factored in deployment planning if the app will be spin up in new/different compute instance frequently, and if cold start is a concern for the use case.

The application access the model using Hugging

