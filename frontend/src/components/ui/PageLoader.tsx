import { motion } from 'framer-motion';
import HeartLogo from './HeartLogo';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0e1d13] to-[#070e0a] z-50 overflow-hidden">
      {/* Background soft gold glow */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[#D4AF37]/5 blur-[80px] pointer-events-none" />

      <div className="relative mb-8 flex items-center justify-center w-40 h-40">
        {/* Outer slow golden ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-[#D4AF37]/10"
        />

        {/* Inner fast counter-rotating dashed ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border border-dashed border-[#D4AF37]/35"
        />
        
        {/* Pulsing brand logo in the center with shadow */}
        <motion.div
          animate={{ 
            scale: [0.94, 1.05, 0.94],
            filter: ['drop-shadow(0 0 10px rgba(212,175,55,0.15))', 'drop-shadow(0 0 20px rgba(212,175,55,0.3))', 'drop-shadow(0 0 10px rgba(212,175,55,0.15))']
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10"
        >
          <HeartLogo className="w-16 h-16 drop-shadow-md" />
        </motion.div>

        {/* Orbiting glowing particles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              rotate: [i * 120, i * 120 + 360],
            }}
            transition={{
              duration: 4 + i * 0.8,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-1.5 pointer-events-none"
          >
            <div 
              className="w-2 h-2 bg-[#D4AF37] rounded-full shadow-[0_0_12px_#D4AF37]"
              style={{
                top: '0%',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Brand Name Text with gold shine and breathing scale */}
      <div className="text-center relative">
        <motion.h2
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="font-display text-lg font-bold tracking-[0.35em] text-[#F5F3E9] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        >
          Akole Café
        </motion.h2>
        <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto mt-2.5" />
      </div>
    </div>
  );
}

