import React, { useRef } from 'react';
import { Video, Upload } from 'lucide-react';

interface VideoUploaderProps {
  onVideoSelect?: (file: File) => void;
}

export default function VideoUploader({ onVideoSelect }: VideoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onVideoSelect) {
      onVideoSelect(file);
    }
  };

  return (
    <div className="w-full p-8 rounded-lg border-2 border-dashed border-slate-300 
      bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/50 
      transition-all duration-300">
      
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 
          flex items-center justify-center">
          <Video className="w-8 h-8 text-white" />
        </div>
        
        <div className="text-center">
          <h3 className="font-medium text-slate-900 mb-1">Upload Video</h3>
          <p className="text-sm text-slate-500 mb-4">
            MP4, MOV, AVI up to 100MB
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-6 py-3 rounded-lg 
            bg-gradient-to-r from-blue-600 to-cyan-500 text-white
            hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <Upload className="w-5 h-5" />
          Choose Video File
        </button>
      </div>
    </div>
  );
}