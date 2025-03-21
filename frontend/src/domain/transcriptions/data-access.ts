import { FileWithPath } from "react-dropzone";
import { Transcription } from "./transcriptions-columns";
import { BASE_API_URL } from "@/configurations";

type TServerTranscription = {
  id: number;
  filename: string;
  transcribed_text: string;
  created_at: string;
};

export type ErrorResponse = {
  message: string;
}

export async function getTranscriptions(searchTerm: string) {
  if (searchTerm) {
    return await searchTranscriptions(searchTerm);
  } else {
    return await getTranscriptionsList();
  }
}

export async function getTranscriptionsList() {
  const response = await fetch(`${BASE_API_URL}/transcriptions`);
  const rawData = await response.json() as TServerTranscription[];
  return rawData.map(mapServerTranscriptionToClientTranscription);
}

export async function searchTranscriptions(searchTerm: string) {
  const queryParams = new URLSearchParams({ filename: searchTerm });
  const response = await fetch(`${BASE_API_URL}/search?${queryParams}`);
  const rawData = await response.json() as TServerTranscription[];
  return rawData.map(mapServerTranscriptionToClientTranscription);
}

function mapServerTranscriptionToClientTranscription(data: TServerTranscription): Transcription {
  return {
    id: data.id,
    filename: data.filename,
    transcribedText: data.transcribed_text,
    createdAt: new Date(data.created_at),
  };
}

export async function submitAudioFiles(files: readonly FileWithPath[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append(`files`, file);
  });

  const response = await fetch(`${BASE_API_URL}/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorContent = await response.json();
    if (!errorContent.detail || errorContent.detail.length === 0) {
      throw new Error("Failed to submit audio files.");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = errorContent.detail.map((detail: any) => {
      if (detail.message) {
        return detail.message;
      } else if (detail.type === "missing") {
        return "File is missing.";
      }
    }).join("; ");
    throw new Error(message);
  }

  return await response.json();
}
