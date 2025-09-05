'use client';
import React, { useRef } from 'react';
import { Mic, Upload } from 'lucide-react';

interface AudioUploaderProps {
  onAudioSelect?: (file: File) => void;
}

export default function AudioUploader({ onAudioSelect }: AudioUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAudioSelect) {
      onAudioSelect(file);
    }
  };

  return (
    <div className="w-full p-6 rounded-lg border-2 border-dashed border-slate-300 
      bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/50 
      transition-all duration-300">
      
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg 
              bg-gradient-to-r from-blue-600 to-cyan-500 text-white
              hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Upload className="w-4 h-4" />
            Upload Audio
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg 
            bg-white border border-slate-300 text-slate-700
            hover:bg-slate-50 transition-all duration-200">
            <Mic className="w-4 h-4" />
            Record
          </button>
        </div>
        
        <p className="text-sm text-slate-500 text-center">
          Upload MP3, WAV, or other audio files
        </p>
      </div>
    </div>
  );
}