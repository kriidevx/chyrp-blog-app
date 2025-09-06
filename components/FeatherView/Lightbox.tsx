'use client';
import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: { src: string; alt?: string; caption?: string }[];
  initialIndex?: number;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!images.length) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90%] max-h-[90%] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image */}
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt || ''}
          className="max-h-[80vh] max-w-[80vw] object-contain rounded-lg"
        />

        {/* Caption */}
        {images[currentIndex].caption && (
          <p className="text-white mt-2 text-center">{images[currentIndex].caption}</p>
        )}

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
