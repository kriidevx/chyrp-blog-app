import React, { useEffect } from 'react';
import { X, Download, Share2, Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  onNavigate 
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) onNavigate(currentIndex - 1);
          break;
        case 'ArrowRight':
          if (currentIndex < images.length - 1) onNavigate(currentIndex + 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen) return null;

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with animated blur */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-3xl animate-pulse"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-blue-600/10 bg-[length:200%_200%] animate-gradient"></div>
      </div>

      {/* Main container */}
      <div className="relative w-full h-full max-w-7xl mx-auto p-4 flex flex-col">
        
        {/* Header with glassmorphism */}
        <div className="flex justify-between items-center mb-4 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl px-6 py-4 shadow-[0_25px_50px_rgba(37,99,235,0.15)]">
          <div className="flex items-center space-x-4">
            <span className="text-slate-50 font-semibold">
              {currentIndex + 1} of {images.length}
            </span>
            <div className="h-4 w-px bg-slate-300/30"></div>
            <div className="flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 scale-125 shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
                      : 'bg-slate-400/50 hover:bg-slate-300 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Action buttons with glow effects */}
            {[
              { icon: Heart, label: 'Like' },
              { icon: MessageCircle, label: 'Comment' },
              { icon: Share2, label: 'Share' },
              { icon: Download, label: 'Download' }
            ].map((action, index) => (
              <button
                key={index}
                className="p-3 text-slate-300 hover:text-white rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-cyan-500/20 border border-white/10 hover:border-blue-500/30 transition-all duration-300 transform-gpu hover:scale-110 group"
                title={action.label}
              >
                <action.icon className="w-5 h-5" />
                <div className="absolute inset-0 bg-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </button>
            ))}

            <div className="h-6 w-px bg-slate-300/30 mx-2"></div>
            
            <button
              onClick={onClose}
              className="p-3 text-slate-300 hover:text-white rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-red-500/20 hover:to-pink-500/20 border border-white/10 hover:border-red-500/30 transition-all duration-300 transform-gpu hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image container */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Navigation buttons */}
          {currentIndex > 0 && (
            <button
              onClick={prevImage}
              className="absolute left-4 z-10 p-4 text-slate-300 hover:text-white rounded-full bg-black/20 hover:bg-gradient-to-br hover:from-blue-600/30 hover:to-cyan-500/30 backdrop-blur-xl border border-white/20 hover:border-blue-500/40 transition-all duration-300 transform-gpu hover:scale-110 group"
            >
              <ChevronLeft className="w-8 h-8" />
              <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
            </button>
          )}

          {currentIndex < images.length - 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 z-10 p-4 text-slate-300 hover:text-white rounded-full bg-black/20 hover:bg-gradient-to-br hover:from-blue-600/30 hover:to-cyan-500/30 backdrop-blur-xl border border-white/20 hover:border-blue-500/40 transition-all duration-300 transform-gpu hover:scale-110 group"
            >
              <ChevronRight className="w-8 h-8" />
              <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
            </button>
          )}

          {/* Main image with advanced effects */}
          <div className="relative max-w-full max-h-full group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-cyan-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="relative max-w-full max-h-full object-contain rounded-2xl shadow-[0_25px_100px_rgba(37,99,235,0.3)] transition-all duration-500 transform-gpu group-hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Bottom info panel */}
        <div className="mt-4 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl px-6 py-4 shadow-[0_25px_50px_rgba(37,99,235,0.15)]">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-slate-50 font-semibold text-lg">Amazing Photo</h3>
              <p className="text-slate-300 text-sm">Captured with professional camera settings</p>
            </div>
            <div className="flex items-center space-x-4 text-slate-300 text-sm">
              <span>ISO 100</span>
              <span>f/2.8</span>
              <span>1/60s</span>
              <span>24mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;