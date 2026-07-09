interface HeartLogoProps {
  className?: string;
  size?: number;
}

export default function HeartLogo({ className = 'w-6 h-6', size }: HeartLogoProps) {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;
  return (
    <img 
      src="/gold-logo.png" 
      alt="Akole Café Brand Icon" 
      className={`object-contain ${className}`}
      style={style}
    />
  );
}
