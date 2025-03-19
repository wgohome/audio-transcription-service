import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns, Transcription } from "./transcriptions-columns";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCallback, useState } from "react";
import { BASE_API_URL } from "@/configurations";

export default function TranscriptionListing() {

  const [searchTerm, setSearchTerm] = useState("");

  const submitSearch = useCallback(() => {
    console.log("Clicked search button to search for:", searchTerm);
    setSearchTerm(t => t);
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

  const filteredQuery = useQuery({
    queryKey: ["filteredTranscriptions", searchTerm],
    queryFn: async () => {
      // Avoid API call before user types in search bar
      if (!searchTerm) return [];

      const queryParams = new URLSearchParams({ filename: searchTerm });
      const response = await fetch(`${BASE_API_URL}/search?${queryParams}`);
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

  const transcriptions = query.data ?? [];
  const filteredTranscriptions = filteredQuery.data ?? [];

  // TODO: handle query.isPending, query.error -> toast?

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
      <DataTable columns={columns} data={searchTerm ? filteredTranscriptions : transcriptions} />
    </>
  );
}
