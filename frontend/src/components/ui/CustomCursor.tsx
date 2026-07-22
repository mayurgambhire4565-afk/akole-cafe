import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasPrecisePointer, setHasPrecisePointer] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring configuration for smooth, responsive lag on the outer element
  const springConfig = { damping: 28, stiffness: 240, mass: 0.5 };
  const trailX = useSpring(cursorX, springConfig);
  const trailY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Enable custom cursor only on devices with a mouse/trackpad
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setHasPrecisePointer(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setHasPrecisePointer(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (!hasPrecisePointer) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [hasPrecisePointer, isVisible, cursorX, cursorY]);

  useEffect(() => {
    if (!hasPrecisePointer) return;

    // Attach listeners to detect hover on interactive elements
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"], .cursor-pointer, button *, a *'
      );

      const onMouseEnter = () => setIsHovered(true);
      const onMouseLeave = () => setIsHovered(false);

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });

      return () => {
        interactiveElements.forEach((el) => {
          el.removeEventListener('mouseenter', onMouseEnter);
          el.removeEventListener('mouseleave', onMouseLeave);
        });
      };
    };

    let cleanup = addHoverListeners();

    // Re-attach listeners when DOM changes (Single Page Application page changes)
    const observer = new MutationObserver(() => {
      cleanup();
      cleanup = addHoverListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Enable custom cursor active style in CSS
    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      cleanup();
      observer.disconnect();
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [hasPrecisePointer]);

  if (!hasPrecisePointer || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999999] hidden md:block">
      {/* Outer Rotating, Glowing, and Dashed Custom Ring */}
      <motion.div
        className="fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
        style={{
          left: trailX,
          top: trailY,
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 240, damping: 28 }}
      >
        {/* Soft Golden Glow Aura Behind */}
        <motion.div
          className="absolute w-12 h-12 rounded-full"
          animate={{
            backgroundColor: isHovered ? 'rgba(212, 175, 55, 0.18)' : 'rgba(212, 175, 55, 0)',
            boxShadow: isHovered 
              ? '0 0 25px 5px rgba(212, 175, 55, 0.45)' 
              : '0 0 0px 0px rgba(212, 175, 55, 0)',
          }}
          transition={{ duration: 0.25 }}
        />

        {/* Outer Ring with rotating dashed stroke */}
        <motion.svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          className="w-12 h-12"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        >
          <circle
            cx="26"
            cy="26"
            r="23"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2.5"
            strokeDasharray={isHovered ? "8 3" : "4 8"}
            opacity={isHovered ? 1 : 0.85}
            className="transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
          />
        </motion.svg>
      </motion.div>

      {/* Inner Pinpoint Solid Golden Core */}
      <motion.div
        className="w-3 h-3 bg-[#D4AF37] rounded-full fixed -translate-x-1/2 -translate-y-1/2 shadow-[0_2px_6px_rgba(0,0,0,0.3),_0_0_8px_rgba(212,175,55,0.7)]"
        style={{
          left: cursorX,
          top: cursorY,
        }}
        animate={{
          scale: isHovered ? 0.4 : 1,
          backgroundColor: isHovered ? '#ffffff' : '#D4AF37',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      />
    </div>
  );
}
