import React, { useState } from 'react';
import { Play, Pause, Volume2, Maximize } from 'lucide-react';

interface VideoProps {
  src?: string;
  title?: string;
  thumbnail?: string;
}

export default function Video({ 
  src, 
  title = "Video", 
  thumbnail 
}: VideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full rounded-lg overflow-hidden bg-white shadow-lg 
      hover:shadow-xl transition-all duration-300 group">
      
      {/* Video Container */}
      <div className="relative bg-slate-900 aspect-video">
        {src ? (
          <video 
            className="w-full h-full object-cover"
            poster={thumbnail}
            controls
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 
                flex items-center justify-center mx-auto mb-3">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
              <p className="text-slate-500">No video selected</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-medium text-slate-900 mb-2">{title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Volume2 className="w-4 h-4" />
            <span>HD Quality</span>
          </div>
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200">
            <Maximize className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}