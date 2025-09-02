'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Download, Trash2, BarChart3 } from 'lucide-react';

interface AudioRecorderProps {
  maxDuration?: number; // in seconds
  allowDownload?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  maxDuration = 300, // 5 minutes
  allowDownload = true,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setDuration(0);

      // Duration timer
      const timer = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
            clearInterval(timer);
          }
          return newDuration;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.volume = 1;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioBlob(null);
    setAudioURL('');
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice-note-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative p-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl">
      {/* Hidden audio element */}
      {audioURL && (
        <audio
          ref={audioRef}
          src={audioURL}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
      )}

      {/* Recording Interface */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Voice Note</h3>
          </div>
          {/* Timer */}
          <div className={`px-3 py-1 rounded-full text-sm font-mono ${
            isRecording 
              ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
              : 'bg-slate-800/50 text-gray-400 border border-slate-700/50'
          }`}>
            {formatTime(Math.floor(duration))}
            {isRecording && <span className="ml-1 animate-pulse">●</span>}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Record/Stop Button */}
            {!audioBlob ? (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white shadow-lg hover:shadow-cyan-500/25'
                }`}
              >
                {isRecording ? (
                  <Square className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
            ) : (
              // Play/Pause Button
              <button
                onClick={isPlaying ? pauseAudio : playAudio}
                className="p-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
            )}
          </div>

          {/* Action Buttons */}
          {audioBlob && (
            <div className="flex items-center space-x-2">
              {allowDownload && (
                <button
                  onClick={downloadRecording}
                  className="p-2 bg-slate-800/50 border border-slate-700/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 rounded-lg transition-all duration-300"
                  title="Download recording"
                >
                  <Download className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={deleteRecording}
                className="p-2 bg-slate-800/50 border border-slate-700/50 text-gray-400 hover:text-red-400 hover:border-red-400/50 rounded-lg transition-all duration-300"
                title="Delete recording"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar (when playing) */}
        {audioBlob && isPlaying && (
          <div className="space-y-2">
            <div className="w-full bg-slate-700 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatTime(Math.floor(currentTime))}</span>
              <span>{formatTime(Math.floor(duration))}</span>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!audioBlob && !isRecording && (
          <p className="text-sm text-gray-400 text-center">
            Click the microphone to start recording your voice note
          </p>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
