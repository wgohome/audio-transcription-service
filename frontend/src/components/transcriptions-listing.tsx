import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns } from "./transcriptions-columns";
import { Input } from "./ui/input";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { getTranscriptions } from "@/data-access";

export default function TranscriptionListing() {

  const [searchTerm, setSearchTerm] = useState("");
  const filenameQuery = useDebounce(searchTerm, 1000);

  const transcriptionsQuery = useQuery({
    queryKey: ["get_transcriptions", filenameQuery],
    queryFn: async () => getTranscriptions(filenameQuery),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <>
      <Input
        className="my-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target?.value)}
        type="email"
        placeholder="Search by filename"
      />
      {/* API don't return specific error yet, when we do, we can display the more specific error here. */}
      {transcriptionsQuery.error && (<p className="text-sm text-red-500 my-3">Failed to retrieve transcriptions.</p>)}
      <DataTable columns={columns} data={transcriptionsQuery.data ?? []} />
    </>
  );
}
