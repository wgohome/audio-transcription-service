import { ColumnDef } from "@tanstack/react-table";

export type Transcription = {
  id: number;
  filename: string;
  transcribedText: string;
  createdAt: Date;
};

export const columns: ColumnDef<Transcription>[] = [
  {
    accessorKey: "filename",
    header: "File Name",
    size: 50,
    cell: (props) => <span className="text-wrap">{props.getValue() as string}</span>,
  },
  {
    accessorKey: "transcribedText",
    header: "Transcription",
    maxSize: 10,
    cell: (props) => <span className="text-wrap">{props.getValue() as string}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    maxSize: 10,
    cell: (props) => <span className="text-wrap">{formatDate(props.getValue() as string)}</span>,
  },
];

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
