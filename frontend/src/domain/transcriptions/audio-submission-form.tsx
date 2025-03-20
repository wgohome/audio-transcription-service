import { cn } from "@/lib/utils";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { submitAudioFiles } from "./data-access";
import { useMutation } from "@tanstack/react-query";
import { Transcription } from "./transcriptions-columns";
import { ErrorResponse } from "react-router";
import { toast } from "sonner";

export default function AudioSubmissionForm() {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone();

  const audioSubmission = useMutation<Transcription[], ErrorResponse, readonly FileWithPath[]>({
    mutationFn: async () => submitAudioFiles(acceptedFiles),
    onMutate: () => { console.log("mutating"); },
    onSuccess: (_data) => {
      toast.success(`Audio files transcribed successfully.`);
      // TODO: Invalidate listing
    },
    onError: (error) => {
      console.log("Audio submission error: ", error);
      toast.error("Failed to submit audio files.");
    },
    onSettled: () => { console.log("settled"); },
  });

  const handleSubmit = useCallback(() => {
    audioSubmission.mutate(acceptedFiles);
  }, [acceptedFiles]);

  return (
    <div className="sm:w-full lg:w-1/2 mx-auto">
      <div className="flex flex-col">
        {/* File dropzone */}
        <div className="pt-8">
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
        {acceptedFiles?.length > 0 && <p className="font-bold pt-2 my-3">Files selected:</p>}
        {acceptedFiles.map((file) => (
          <p key={file.name} className="my-1">
            {file.name}
          </p>
        ))}

        {/* Error section */}
        <div className="hidden">
          <p className="text-left text-red-500 my-3">Error message goes here</p>
        </div>

        {/* Submit */}
        <div className="flex justify-center py-3">
          <Button className="w-[240px]" onClick={handleSubmit}>
            Transcribe
          </Button>
        </div>
      </div>
    </div>
  );
}
