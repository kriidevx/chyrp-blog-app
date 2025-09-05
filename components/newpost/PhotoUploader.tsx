'use client';
import React, { useRef, useState } from 'react';
import { ImageIcon, X } from 'lucide-react';

interface PhotoUploaderProps {
  onPhotoSelect?: (file: File) => void;
}

export default function PhotoUploader({ onPhotoSelect }: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onPhotoSelect?.(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover"
          />
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white 
              hover:scale-110 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 rounded-lg border-2 border-dashed border-slate-300 
            bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/50 
            transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3"
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