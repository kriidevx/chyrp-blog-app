import React, { useState, useEffect } from 'react';
import { TrendingUp, Users } from 'lucide-react';

interface LikeCountProps {
  count: number;
  showTrending?: boolean;
  showUsers?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function LikeCount({ 
  count, 
  showTrending = false, 
  showUsers = false,
  size = 'md' 
}: LikeCountProps) {
  const [displayCount, setDisplayCount] = useState(count);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (count !== displayCount) {
      setIsAnimating(true);
      
      // Animate count change
      const duration = 500;
      const steps = 10;
      const increment = (count - displayCount) / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        setDisplayCount(prev => {
          const newCount = Math.round(prev + increment);
          return currentStep >= steps ? count : newCount;
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setIsAnimating(false);
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [count, displayCount]);

  const formatCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const sizes = {
    sm: { text: 'text-xs', icon: 12, container: 'px-2 py-1' },
    md: { text: 'text-sm', icon: 14, container: 'px-3 py-1.5' },
    lg: { text: 'text-base', icon: 16, container: 'px-4 py-2' }
  };

  const sizeConfig = sizes[size];

  return (
    <div className={`
      inline-flex items-center gap-1.5 ${sizeConfig.container}
      bg-white/10 backdrop-blur-xl border border-white/20
      rounded-full shadow-lg hover:shadow-xl
      hover:bg-white/15 hover:border-white/30
      transition-all duration-300 group
      ${isAnimating ? 'ring-2 ring-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : ''}
    `}>
      {/* Icon */}
      {showUsers ? (
        <Users 
          size={sizeConfig.icon} 
          className="text-slate-500 group-hover:text-blue-500 transition-colors duration-200" 
        />
      ) : showTrending ? (
        <TrendingUp 
          size={sizeConfig.icon} 
          className="text-slate-500 group-hover:text-cyan-500 transition-colors duration-200" 
        />
      ) : null}

      {/* Count */}
      <span className={`
        ${sizeConfig.text} font-medium
        bg-gradient-to-r from-slate-700 to-slate-600
        bg-clip-text text-transparent
        group-hover:from-blue-600 group-hover:to-cyan-600
        transition-all duration-300
        ${isAnimating ? 'animate-pulse scale-110' : ''}
      `}>
        {formatCount(displayCount)}
      </span>

      {/* Trending indicator */}
      {showTrending && count > 0 && (
        <div className="flex items-center">
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse ml-0.5" style={{ animationDelay: '0.5s' }} />
        </div>
      )}

      {/* Glow effect when animating */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/5 to-cyan-400/5 animate-pulse pointer-events-none" />
      )}

      {/* Hover sparkle effect */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
