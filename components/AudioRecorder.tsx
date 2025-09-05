import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Square, Send } from 'lucide-react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [waveform, setWaveform] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        // Simulate waveform data
        setWaveform(prev => [...prev.slice(-19), Math.random() * 100]);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setDuration(0);
    setWaveform([]);
    setHasRecording(false);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const sendRecording = () => {
    console.log('Sending audio recording...');
    setHasRecording(false);
    setDuration(0);
    setWaveform([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 600);
    const secs = Math.floor((seconds % 600) / 10);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center space-x-4">
        {/* Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25 animate-pulse' 
              : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-110 shadow-lg hover:shadow-blue-500/25'
          }`}
        >
          {isRecording ? (
            <Square className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Waveform Visualization */}
        <div className="flex-1 flex items-center space-x-1 h-12">
          {(isRecording || hasRecording) ? (
            <div className="flex items-end space-x-1 h-8">
              {waveform.map((height, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-t from-cyan-500 to-blue-600 w-1 rounded-full transition-all duration-100"
                  style={{ height: `${Math.max(height * 0.3, 4)}px` }}
                />
              ))}
            </div>
          ) : (
            <div className="text-slate-500 text-sm">Tap to record voice note</div>
          )}
        </div>

        {/* Duration */}
        {(isRecording || hasRecording) && (
          <div className="text-sm text-slate-700 font-mono min-w-[3rem]">
            {formatTime(duration)}
          </div>
        )}

        {/* Playback Controls */}
        {hasRecording && !isRecording && (
          <div className="flex space-x-2">
            <button
              onClick={togglePlayback}
              className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors duration-200"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-slate-700" />
              ) : (
                <Play className="w-4 h-4 text-slate-700" />
              )}
            </button>
            
            <button
              onClick={sendRecording}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="flex items-center justify-center mt-2 text-red-500 text-xs">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
          Recording...
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;