import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns, Transcription } from "./transcriptions-columns";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCallback, useState } from "react";
import { BASE_API_URL } from "@/configurations";

export default function TranscriptionListing() {

  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");

  const submitSearch = useCallback(() => {
    console.log("Search for:", searchTerm);
  }, [searchTerm]);


  const query = useQuery({
    queryKey: ["transcriptions"],
    queryFn: async () => {
      const response = await fetch(`${BASE_API_URL}/transcriptions`);
      const rawData = await response.json();
      return rawData.map(
        (data): Transcription => ({
          id: data.id,
          filename: data.filename,
          transcribedText: data.transcribed_text,
          createdAt: new Date(data.created_at),
        })
      );
    },
  });

  const demoTranscriptions: Transcription[] = [
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
    },
  ];

  const transcriptions = query.data ?? [];

  return (
    <>
      <div className="flex gap-2 my-3">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target?.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitSearch();
            }
          }}
          type="email"
          placeholder="Search by filename"
        />
        {/* Using submit button and Enter to avoid having to debounce for now */}
        <Button variant="outline" onClick={() => submitSearch()}>
          Search
        </Button>
      </div>
      <DataTable columns={columns} data={transcriptions} />
    </>
  );
}
