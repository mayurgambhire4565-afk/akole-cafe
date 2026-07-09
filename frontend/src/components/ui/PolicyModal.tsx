import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function PolicyModal({ isOpen, onClose, title, children }: PolicyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0A1A12]/60 dark:bg-black/75 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.45 }}
            className="relative bg-white dark:bg-[#132A1D] border border-[#3C2415]/10 dark:border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden text-left z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#3C2415]/10 dark:border-white/10 bg-gradient-to-r from-[#F8F4EA]/50 to-white dark:from-[#132A1D] dark:to-[#0F1E15]">
              <h3 className="text-xl font-display font-bold text-[#1A3324] dark:text-[#D4AF37] tracking-wide">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#3C2415]/5 dark:hover:bg-white/5 text-[#3C2415]/60 dark:text-cream-200/60 hover:text-[#1A3324] dark:hover:text-[#D4AF37] transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 font-sans text-sm text-[#3C2415]/80 dark:text-cream-100/70 leading-relaxed space-y-4 max-h-[60vh] scrollbar-thin scrollbar-thumb-[#3C2415]/10 dark:scrollbar-thumb-white/10">
              {children}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#3C2415]/10 dark:border-white/10 bg-gradient-to-r from-white to-[#F8F4EA]/30 dark:from-[#0F1E15] dark:to-[#132A1D] flex justify-end">
              <button
                onClick={onClose}
                className="bg-[#3D2015] dark:bg-[#D4AF37] text-white dark:text-[#3D2015] hover:bg-[#2C150D] dark:hover:bg-[#C5A028] px-5 py-2 rounded-xl font-semibold text-xs tracking-wider uppercase shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
