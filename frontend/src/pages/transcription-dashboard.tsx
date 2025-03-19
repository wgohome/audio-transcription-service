import AudioSubmissionForm from "../components/audio-submission-form";
import TranscriptionListing from "../components/transcriptions-listing";

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
