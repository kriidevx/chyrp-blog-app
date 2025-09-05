import React, { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';

interface UploaderProps {
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect?: (files: FileList) => void;
  multiple?: boolean;
  title?: string;
  description?: string;
}

export default function Uploader({ 
  accept = "*/*",
  maxSize = 50,
  onFileSelect,
  multiple = false,
  title = "Upload Files",
  description = `Drag and drop files or click to browse (max ${maxSize}MB)`
}: UploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && onFileSelect) {
      onFileSelect(files);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && onFileSelect) {
      onFileSelect(files);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => fileInputRef.current?.click()}
      className="w-full p-8 rounded-lg border-2 border-dashed border-slate-300 
        bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/50 
        transition-all duration-300 cursor-pointer group"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 
          flex items-center justify-center group-hover:scale-110 transition-all duration-200">
          <Upload className="w-8 h-8 text-white" />
        </div>
        
        <div className="text-center">
          <h3 className="font-medium text-slate-900 mb-1">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <FileText className="w-4 h-4" />
          <span>All file types supported</span>
        </div>
      </div>
    </div>
  );
}