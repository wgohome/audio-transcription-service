import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { useCallback } from "react";

export default function AudioSubmissionForm() {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone();

  const handleSubmit = useCallback(() => {
    // TODO: Pass to parent?
    console.log(acceptedFiles);
  }, [acceptedFiles]);

  return (
    <div className="mx-2">
      <div className="flex flex-col">
        {/* File dropzone */}
        <div className="sm:w-full lg:w-1/2 mx-auto pt-8">
          <div
            {...getRootProps()}
            className={cn(
              "flex justify-center items-center h-32 border-dashed border-2 border-gray-200 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all select-none cursor-pointer"
            )}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the audio files here ...</p>
            ) : (
              <p>Drag & drop your audio files here, or click to select files</p>
            )}
          </div>
        </div>

        {/* Files selected */}
        {acceptedFiles.map((file) => (
          <p key={file.name} className="my-1">
            {file.name}
          </p>
        ))}

        {/* Error section */}
        <div className="">
          <p className="text-left text-red-500 my-3">Error message goes here</p>
        </div>

        {/* Submit */}
        <div className="flex flex-row-reverse py-3">
          <Button className="w-[240px]" onClick={handleSubmit}>Transcribe</Button>
        </div>
      </div>
    </div>
  );
}
