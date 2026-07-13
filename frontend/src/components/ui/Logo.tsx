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
          src="/gold-logo.png"
          alt="Akole Café Logo"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
