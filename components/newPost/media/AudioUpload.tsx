'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Mic, Upload, Trash2 } from 'lucide-react';
import AudioPlayer from '@/components/FeatherView/AudioPlayer';

interface AudioUploaderProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  loading?: boolean; // New prop to disable input when uploading
}

export default function AudioUploader({ value, onChange, loading }: AudioUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(value || null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [volume, setVolume] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recordingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setSelectedFile(value || null);
  }, [value]);

  // Validate file size max 6MB
  const validateFileSize = (file: File | null) => {
    if (file && file.size > 6 * 1024 * 1024) {
      alert('Audio file size must be less than 6MB');
      return false;
    }
    return true;
  };

  const updateVolume = () => {
    if (!analyserRef.current) return;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    let values = 0;
    for (let i = 0; i < bufferLength; i++) {
      values += dataArray[i];
    }

    const average = values / bufferLength;
    const normalizedVolume = average / 255;
    setVolume(normalizedVolume);

    animationFrameRef.current = requestAnimationFrame(updateVolume);
  };

  const startRecordingTimer = () => {
    setRecordingTime(0);
    recordingTimerRef.current = window.setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (recordingTimerRef.current !== null) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const toggleRecording = async () => {
    if (loading) return; // prevent while uploading
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;

        animationFrameRef.current = requestAnimationFrame(updateVolume);
        startRecordingTimer();

        let mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/wav';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '';
          }
        }

        const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        mediaRecorderRef.current = mediaRecorder;

        const localChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
          localChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          stopRecordingTimer();
          setVolume(0);

          const blob = new Blob(localChunks, { type: mimeType || 'audio/wav' });
          const ext = mimeType ? mimeType.split('/')[1] : 'wav';
          const file = new File([blob], `recording.${ext}`, { type: mimeType || 'audio/wav' });

          if (!validateFileSize(file)) {
            // Do not update if file too large
            return;
          }

          setSelectedFile(file);
          if (onChange) onChange(file);

          sourceRef.current?.disconnect();
          analyserRef.current?.disconnect();
          audioContextRef.current?.close();
          audioContextRef.current = null;
          analyserRef.current = null;
          sourceRef.current = null;
        };

        mediaRecorder.start();
        setRecording(true);
      } catch (error) {
        console.error('Microphone access denied or error:', error);
      }
    } else {
      mediaRecorderRef.current?.stop();
      setRecording(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;
    const file = e.target.files?.[0] || null;
    if (!validateFileSize(file)) return;
    setSelectedFile(file);
    if (onChange) onChange(file);
  };

  const removeFile = () => {
    if (loading) return;
    setSelectedFile(null);
    setVolume(0);
    setRecordingTime(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) onChange(null);
  };

  const formatTime = (timeInSec: number) => {
    const mins = Math.floor(timeInSec / 60);
    const secs = (timeInSec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const audioURL = selectedFile ? URL.createObjectURL(selectedFile) : null;

  return (
    <div className="w-full p-6 rounded-lg border-2 border-dashed border-slate-300 
      bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/50 
      transition-all duration-300">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={loading}
      />

      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg 
              bg-gradient-to-r from-blue-600 to-cyan-500 text-white
              hover:scale-105 transition-all duration-200 shadow-lg"
            disabled={loading}
          >
            <Upload className="w-4 h-4" />
            {selectedFile ? 'Re-upload Audio' : 'Upload Audio'}
          </button>

          <button
            onClick={toggleRecording}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg 
              ${recording ? 'bg-red-500 text-white' : 'bg-white border border-slate-300 text-slate-700'}
              hover:bg-slate-50 transition-all duration-200`}
            disabled={loading}
          >
            <Mic className="w-4 h-4" />
            {recording ? 'Stop' : 'Record'}
          </button>

          {recording && (
            <span className="text-red-600 font-mono text-sm ml-2">
              {formatTime(recordingTime)}
            </span>
          )}
        </div>

        {recording && (
          <div className="w-full bg-slate-200 rounded h-3 overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-400 transition-all duration-100"
              style={{ width: `${Math.min(volume * 100, 100)}%` }}
            />
          </div>
        )}

        {selectedFile && audioURL ? (
          <div className="mt-3 w-full">
            <AudioPlayer src={audioURL} title={selectedFile.name} />
            <div className="flex justify-end mt-2">
              <button
                onClick={removeFile}
                className="text-red-500 hover:text-red-700 flex items-center gap-1"
                aria-label="Remove audio file"
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center">
            Upload MP3, WAV, or record audio directly
          </p>
        )}
      </div>
    </div>
  );
}
