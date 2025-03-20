import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns, Transcription } from "./transcriptions-columns";
import { Input } from "./ui/input";
import { useState } from "react";
import { BASE_API_URL } from "@/configurations";
import { useDebounce } from "@uidotdev/usehooks";

type TServerTranscription = {
  id: number;
  filename: string;
  transcribed_text: string;
  created_at: string;
}

export default function TranscriptionListing() {

  const [searchTerm, setSearchTerm] = useState("");
  const filenameQuery = useDebounce(searchTerm, 1000);

  const query = useQuery({
    queryKey: ["transcriptions", filenameQuery],
    queryFn: async () => {
      // Let search API get the results
      if (filenameQuery) return [];

      const response = await fetch(`${BASE_API_URL}/transcriptions`);
      const rawData = await response.json();
      return rawData.map(
        (data: TServerTranscription): Transcription => ({
          id: data.id,
          filename: data.filename,
          transcribedText: data.transcribed_text,
          createdAt: new Date(data.created_at),
        })
      );
    },
  });

  const filteredQuery = useQuery({
    queryKey: ["filteredTranscriptions", filenameQuery],
    queryFn: async () => {
      // Avoid API call before user types in search bar
      if (!searchTerm) return [];

      const queryParams = new URLSearchParams({ filename: searchTerm });
      const response = await fetch(`${BASE_API_URL}/search?${queryParams}`);
      const rawData = await response.json();
      return rawData.map(
        (data: TServerTranscription): Transcription => ({
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
          type="email"
          placeholder="Search by filename"
        />
      </div>
      <DataTable columns={columns} data={filenameQuery ? filteredTranscriptions : transcriptions} />
    </>
  );
}
