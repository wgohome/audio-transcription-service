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
  },
  {
    accessorKey: "transcribedText",
    header: "Transcription",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
];
