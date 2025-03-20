import AudioSubmissionForm from "../domain/transcriptions/audio-submission-form";
import TranscriptionListing from "../domain/transcriptions/transcriptions-listing";

export default function TranscriptionDashboard() {

  return (
    <div className="py-4">
      <h1 className="text-4xl text-center my-4">Audio Transcription Service</h1>
      <AudioSubmissionForm />
      <hr className="mb-4"/>
      <TranscriptionListing />
    </div>
  )
}
