import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '' 
}: ButtonProps) {
  const baseClasses = "relative font-semibold transition-all duration-300 transform-gpu overflow-hidden group";
  
  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-cyan-500 
      hover:from-blue-700 hover:to-cyan-600
      text-white shadow-lg shadow-blue-500/25
      ring-2 ring-blue-400/20 hover:ring-blue-400/40
      hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-400/20 before:to-blue-400/20
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    `,
    secondary: `
      bg-white/10 backdrop-blur-xl border border-white/20
      hover:bg-white/20 hover:border-white/30
      text-slate-900 hover:text-blue-600
      shadow-lg hover:shadow-xl
      hover:scale-102
    `,
    ghost: `
      bg-transparent border border-slate-300/50
      hover:bg-slate-100/50 hover:border-blue-400/50
      text-slate-700 hover:text-blue-600
      backdrop-blur-sm
    `
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-6 py-2.5 text-base rounded-xl",
    lg: "px-8 py-3.5 text-lg rounded-2xl"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Animated glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 animate-pulse" />
      </div>
    </button>
  );
}
