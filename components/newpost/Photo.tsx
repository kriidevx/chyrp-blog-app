'use client';
import React from 'react';
import { Eye, Download } from 'lucide-react';

interface PhotoProps {
  src?: string;
  alt?: string;
  caption?: string;
}

export default function Photo({ 
  src = "/api/placeholder/400/300", 
  alt = "Photo", 
  caption 
}: PhotoProps) {
  return (
    <div className="w-full rounded-lg overflow-hidden bg-white shadow-lg 
      hover:shadow-xl transition-all duration-300 group">
      
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={src} 
          alt={alt}
          className="w-full h-64 object-cover transition-all duration-300 
            group-hover:scale-105"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 
          transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 
            flex gap-2">
            <button className="p-2 rounded-full bg-white/90 text-slate-700 
              hover:scale-110 transition-all duration-200">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full bg-white/90 text-slate-700 
              hover:scale-110 transition-all duration-200">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <div className="p-4">
          <p className="text-sm text-slate-600">{caption}</p>
        </div>
      )}
    </div>
  );
}