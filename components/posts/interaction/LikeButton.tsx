'use client';

import React, { useState, memo } from 'react';
import { Heart, Sparkles, Loader2 } from 'lucide-react';

interface LikeButtonProps {
  likes: number;
  likedByUser: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const LikeButton = memo<LikeButtonProps>(({
  likes = 0,
  likedByUser = false,
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled || loading) return;
    
    setIsAnimating(true);
    onClick?.();
    
    // Reset animation after completion
    setTimeout(() => setIsAnimating(false), 600);
  };

  const sizes = {
    sm: { 
      button: 'p-1.5', 
      icon: 16, 
      sparkle: 10, 
      text: 'text-sm',
      loader: 12
    },
    md: { 
      button: 'p-2', 
      icon: 20, 
      sparkle: 12, 
      text: 'text-base',
      loader: 16
    },
    lg: { 
      button: 'p-3', 
      icon: 24, 
      sparkle: 16, 
      text: 'text-lg',
      loader: 20
    },
  };
  
  const s = sizes[size];

  const buttonClasses = `
    ${s.button} rounded-full flex items-center justify-center
    ${likedByUser 
      ? 'bg-red-50 border-red-200 shadow-md' 
      : 'bg-gray-100 hover:bg-gray-200 border-gray-200'
    }
    transition-all duration-300 transform
    ${disabled || loading 
      ? 'opacity-50 cursor-not-allowed' 
      : 'cursor-pointer hover:scale-110 active:scale-95'
    }
    border relative overflow-hidden
  `;

  return (
    <div className="flex items-center gap-2 relative">
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        aria-pressed={likedByUser}
        aria-label={`${likedByUser ? 'Unlike' : 'Like'} post (${likes} likes)`}
        className={buttonClasses}
        type="button"
      >
        {loading ? (
          <Loader2
            size={s.loader}
            className="text-gray-600 animate-spin"
          />
        ) : (
          <Heart
            size={s.icon}
            className={`transition-all duration-200 ${
              likedByUser 
                ? 'text-red-500 fill-red-500 scale-110' 
                : 'text-gray-600 hover:text-red-400'
            } ${isAnimating ? 'animate-pulse' : ''}`}
          />
        )}

        {/* Ripple effect */}
        {isAnimating && likedByUser && (
          <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-75" />
        )}
      </button>

      {/* Likes count with animation */}
      <span className={`
        ${s.text} text-gray-700 select-none font-medium transition-all duration-200
        ${isAnimating ? 'scale-110 text-red-600' : ''}
      `}>
        {likes.toLocaleString()}
      </span>

      {/* Sparkles animation for successful likes */}
      {isAnimating && likedByUser && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <Sparkles
              key={i}
              size={s.sparkle}
              className="absolute text-red-400 animate-bounce"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 100}ms`,
                animationDuration: '0.6s',
              }}
            />
          ))}
        </div>
      )}

      {/* Tooltip for disabled state */}
      {disabled && !loading && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-10">
          {likedByUser ? "You liked this post" : "Login to like"}
        </div>
      )}
    </div>
  );
});

LikeButton.displayName = 'LikeButton';

export default LikeButton;