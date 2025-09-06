"use client";
import React, { useRef, useState } from "react";
import { Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoProps {
  src?: string;
  title?: string;
  thumbnail?: string;
}

export default function Video({ src, title = "Video", thumbnail }: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const goFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen)
      videoRef.current.requestFullscreen();
  };

  return (
    <div className="w-full rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 group">
      {/* Video Container */}
      <div className="relative bg-slate-900 aspect-video">
        {src ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={thumbnail}
            controls
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">No Video</span>
              </div>
              <p className="text-slate-500">No video selected</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4 flex items-center justify-between">
        {/* Mute / HD Info */}
        <button
          onClick={toggleMute}
          className="flex items-center gap-1 text-sm text-slate-500 p-2 rounded hover:bg-slate-100 transition-colors duration-200"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
          <span>HD Quality</span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={goFullscreen}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200"
        >
          <Maximize className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
