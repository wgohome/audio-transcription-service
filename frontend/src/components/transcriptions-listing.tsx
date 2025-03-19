import { DataTable } from "./data-table";
import { columns, Transcription } from "./transcriptions-columns";

export default function TranscriptionListing() {

  const transcriptions: Transcription[] = [
    {
      id: 1,
      filename: "audio1.mp3",
      transcribedText: "Hello, world!",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)), // Random timestamp
    },
    {
      id: 2,
      filename: "audio2.mp3",
      transcribedText: "This is a test transcription.",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    },
    {
      id: 3,
      filename: "audio3.mp3",
      transcribedText: "Another example transcription.",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    },
    {
      id: 4,
      filename: "audio4.mp3",
      transcribedText: "Transcription for audio file 4.",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    },
    {
      id: 5,
      filename: "audio5.mp3",
      transcribedText: "Final example transcription.",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    }
  ];

  return (
    <>
      <DataTable columns={columns} data={transcriptions} />
    </>
  );
}
