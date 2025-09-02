'use client';
import { useAudioRecorder } from 'react-audio-voice-recorder';

export default function AudioRecorder() {
  const { startRecording, stopRecording, recordingBlob } = useAudioRecorder();

  return (
    <div>
      <button onClick={startRecording} className="mr-2 bg-blue-600 text-white px-4 py-2 rounded">Start Recording</button>
      <button onClick={stopRecording} className="bg-red-600 text-white px-4 py-2 rounded">Stop</button>
      {recordingBlob && (
        <audio src={URL.createObjectURL(recordingBlob)} controls className="mt-2" />
      )}
    </div>
  );
}
