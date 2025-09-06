'use client';
import React, { useRef, useState, useEffect } from 'react';
import { ImageIcon, X } from 'lucide-react';
import Photo from '@/components/newPost/mediaView/PhotoViewer';

interface PhotoUploaderProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  loading?: boolean; // New prop to disable input during upload
}

export default function PhotoUploader({ value, onChange, loading }: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(value || null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setSelectedFile(value || null);
  }, [value]);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, [selectedFile]);

  // Validate max 10MB file size
  const validateFileSize = (file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      alert('Image file size must be less than 10MB');
      return false;
    }
    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return; // Prevent selection during upload
    const file = event.target.files?.[0] || null;
    if (!validateFileSize(file)) return;
    setSelectedFile(file);
    if (onChange) onChange(file);
  };

  const clearPreview = () => {
    if (loading) return; // Prevent removal during upload
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onChange) onChange(null);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={loading}
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden">
          <Photo src={preview} caption={selectedFile?.name} />
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:scale-110 transition-all duration-200"
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => { if (!loading) fileInputRef.current?.click(); }}
          className="w-full h-48 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3"
        >
          <ImageIcon className="w-8 h-8 text-slate-400" />
          <div className="text-center">
            <p className="font-medium text-slate-600">Click to upload photo</p>
            <p className="text-sm text-slate-400">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
}
