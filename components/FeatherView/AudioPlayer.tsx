'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src?: string;
  title?: string;
}

export default function AudioPlayer({ src, title = "Audio Track" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const dur = audioRef.current.duration;
    setDuration(Number.isFinite(dur) && dur > 0 ? dur : 0);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    setCurrentTime(current >= 0 && current <= duration ? current : 0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    if (newTime >= 0 && newTime <= duration) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time) || time <= 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-slate-200 
      shadow-lg hover:shadow-xl transition-all duration-300">

      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        preload="metadata"
      />

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center justify-center w-12 h-12 rounded-full 
            bg-gradient-to-r from-blue-600 to-cyan-500 text-white
            hover:scale-110 transition-all duration-200 shadow-lg"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>

        <div className="flex-1">
          <h3 className="font-medium text-slate-900 mb-1">{title}</h3>
          <div className="flex items-center gap-2">
            <button onClick={toggleMute}>
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-slate-500" />}
            </button>

            <div
              className="flex-1 h-2 bg-slate-200 rounded-full cursor-pointer relative"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="text-sm text-slate-500">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
