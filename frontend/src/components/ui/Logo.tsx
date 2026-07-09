import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
  textSize?: string;
}

export default function Logo({ 
  className = '', 
  size = 52, 
  showText = false, 
  textColor = 'text-[#1A3121] dark:text-cream-50',
  textSize
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div 
        className="rounded-full overflow-hidden relative shadow-md border border-[#D4AF37] bg-[#3D2015] flex-shrink-0"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img
          src="/logo.jpg"
          alt="Akole Café Logo"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover max-w-none transition-transform duration-300 hover:scale-105"
          style={{ width: '136%', height: '136%' }}
        />
      </div>
      {showText && (
        <span className={`font-display font-bold ${textSize || 'text-xl'} ${textColor} tracking-wide select-none`}>
          Akole <span className="text-[#D4AF37]">Café</span>
        </span>
      )}
    </div>
  );
}
