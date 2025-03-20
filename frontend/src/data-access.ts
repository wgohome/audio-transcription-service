import { Transcription } from "./components/transcriptions-columns";
import { BASE_API_URL } from "./configurations";

type TServerTranscription = {
  id: number;
  filename: string;
  transcribed_text: string;
  created_at: string;
};

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
