import { useState } from 'react';
import AudioRecorder from '../AudioRecorder';

interface AudioProps {
  onUpload: (file: File) => Promise<string>;
}

export default function Audio({ onUpload }: AudioProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await onUpload(file);
      setPreview(url);
    } catch (error) {
      console.error('Error uploading audio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordingComplete = async (blob: Blob) => {
    const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
    try {
      setLoading(true);
      const url = await onUpload(file);
      setPreview(url);
    } catch (error) {
      console.error('Error uploading recording:', error);
    } finally {
      setLoading(false);
    }
  };
import React, { useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioProps {
  src?: string;
  title?: string;
}

export default function Audio({ src, title = "Audio Track" }: AudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");

  return (
    <div className="w-full p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-slate-200 
      shadow-lg hover:shadow-xl transition-all duration-300">
      
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center justify-center w-12 h-12 rounded-full 
            bg-gradient-to-r from-blue-600 to-cyan-500 text-white
            hover:scale-110 transition-all duration-200 shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-1" />
          )}
        </button>

        {/* Audio Info */}
        <div className="flex-1">
          <h3 className="font-medium text-slate-900 mb-1">{title}</h3>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-slate-500" />
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
            </div>
            <span className="text-sm text-slate-500">{duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}