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
    cell: (props) => <span className="text-wrap">{JSON.stringify(props.getValue())}</span>,
  },
];
