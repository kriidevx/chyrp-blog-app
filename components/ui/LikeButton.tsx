import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface LikeButtonProps {
  initialLiked?: boolean;
  onLike?: (liked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function LikeButton({ 
  initialLiked = false, 
  onLike,
  size = 'md' 
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setIsAnimating(true);
    
    onLike?.(newLikedState);
    
    // Reset animation
    setTimeout(() => setIsAnimating(false), 600);
  };

  const sizes = {
    sm: { button: 'p-1.5', icon: 14, sparkle: 12 },
    md: { button: 'p-2', icon: 18, sparkle: 14 },
    lg: { button: 'p-3', icon: 24, sparkle: 18 }
  };

  const sizeConfig = sizes[size];

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`
          ${sizeConfig.button} rounded-full transition-all duration-300
          transform-gpu hover:scale-110 active:scale-95
          group relative overflow-hidden
          ${liked 
            ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 ring-2 ring-blue-400/30' 
            : 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30'
          }
          backdrop-blur-xl shadow-lg hover:shadow-xl
        `}
      >
        {/* Heart icon */}
        <Heart 
          size={sizeConfig.icon}
          className={`
            transition-all duration-300 relative z-10
            ${liked 
              ? 'text-blue-500 fill-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' 
              : 'text-slate-600 hover:text-blue-500'
            }
            ${isAnimating ? 'animate-pulse scale-125' : ''}
          `}
        />

        {/* Ripple effect */}
        <div className={`
          absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30
          scale-0 group-active:scale-150 transition-transform duration-300
        `} />

        {/* Glow effect when liked */}
        {liked && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/10 to-cyan-400/10 animate-pulse" />
        )}
      </button>

      {/* Floating sparkles animation */}
      {isAnimating && liked && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <Sparkles
              key={i}
              size={sizeConfig.sparkle}
              className={`
                absolute text-blue-400 animate-ping
                ${i % 2 === 0 ? 'text-cyan-400' : 'text-blue-500'}
              `}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 100}ms`,
                animationDuration: `${600 + i * 100}ms`
              }}
            />
          ))}
        </div>
      )}

      {/* Success burst effect */}
      {isAnimating && liked && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-ping" />
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" style={{ animationDelay: '150ms' }} />
        </div>
      )}
    </div>
  );
}
