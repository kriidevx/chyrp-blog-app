'use client';
import React from 'react';
import {
  FileText, Image, Quote, ExternalLink, Video, Music, Upload,
} from 'lucide-react';

const feathers = [
  { id: 'text', name: 'Text', icon: FileText, description: 'Publish textual blog entries' },
  { id: 'photo', name: 'Photo', icon: Image, description: 'Upload and display an image' },
  { id: 'quote', name: 'Quote', icon: Quote, description: 'Post a quotation' },
  { id: 'link', name: 'Link', icon: ExternalLink, description: 'Link out to another website' },
  { id: 'video', name: 'Video', icon: Video, description: 'Upload and display a video file' },
  { id: 'audio', name: 'Audio', icon: Music, description: 'Upload and play an audio file' },
 // { id: 'uploader', name: 'Uploader', icon: Upload, description: 'Upload and manage multiple files' },
];

interface FeathersSelectorProps {
  selectedFeather: string;
  setSelectedFeather: (val: string) => void;
  disabled?: boolean; // Added optional disabled prop
}

const FeathersSelector: React.FC<FeathersSelectorProps> = ({
  selectedFeather,
  setSelectedFeather,
  disabled = false,
}) => (
  <div className="h-full sticky top-0 p-6 border-r border-blue-100/50 bg-gradient-to-b from-blue-50/30 to-cyan-50/30 overflow-y-auto">
    <h3 className="text-lg font-semibold text-slate-800 mb-4">Feathers</h3>
    <div className="space-y-2">
      {feathers.map((feather) => (
        <button
          key={feather.id}
          onClick={() => !disabled && setSelectedFeather(feather.id)}
          disabled={disabled}
          className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${
            selectedFeather === feather.id
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105"
              : "bg-white/60 text-slate-700 hover:bg-blue-50 hover:shadow-md"
          } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
          <div className="flex items-center space-x-3">
            <feather.icon className="w-5 h-5" />
            <div>
              <div className="font-medium">{feather.name}</div>
              <div className={`text-xs ${selectedFeather === feather.id ? "text-blue-100" : "text-slate-500"}`}>
                {feather.description}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default FeathersSelector;
