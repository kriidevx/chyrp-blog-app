'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Video as VideoIcon, Upload, Trash2 } from 'lucide-react';
import VideoPlayer from '@/components/FeatherView/VideoPlayer';

interface VideoUploaderProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  loading?: boolean; // disables input/UI when true
}

export default function VideoUploader({ value, onChange, loading }: VideoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoFile, setVideoFile] = useState<File | null>(value || null);
  const [videoURL, setVideoURL] = useState<string | null>(null);

  useEffect(() => {
    setVideoFile(value || null);
  }, [value]);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoURL(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoURL(null);
    }
  }, [videoFile]);

  // Validate max 100MB
  const validateFileSize = (file: File | null) => {
    if (file && file.size > 100 * 1024 * 1024) {
      alert('Video file size must be less than 100MB');
      return false;
    }
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return; // prevent changes during upload
    const file = e.target.files?.[0] || null;
    if (!validateFileSize(file)) return;
    setVideoFile(file);
    if (onChange) onChange(file);
  };

  const removeFile = () => {
    if (loading) return;
    setVideoFile(null);
    setVideoURL(null);
    if (onChange) onChange(null);
  };

  if (videoURL && videoFile) {
    return (
      <div className="w-full flex flex-col gap-4">
        <VideoPlayer src={videoURL} title={videoFile.name} />
        <div className="flex justify-end">
          <button
            onClick={removeFile}
            className="text-red-500 hover:text-red-700 flex items-center gap-1"
            aria-label="Remove video file"
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full p-8 rounded-lg border-2 border-dashed border-slate-300
        bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/50
        transition-all duration-300 flex flex-col items-center gap-4"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={loading}
      />

      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500
        flex items-center justify-center"
      >
        <VideoIcon className="w-8 h-8 text-white" />
      </div>

      <div className="text-center">
        <h3 className="font-medium text-slate-900 mb-1">Upload Video</h3>
        <p className="text-sm text-slate-500 mb-4">MP4, MOV, AVI up to 100MB</p>
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-6 py-3 rounded-lg
          bg-gradient-to-r from-blue-600 to-cyan-500 text-white
          hover:scale-105 transition-all duration-200 shadow-lg"
        disabled={loading}
      >
        <Upload className="w-5 h-5" />
        Choose Video File
      </button>
    </div>
  );
}
