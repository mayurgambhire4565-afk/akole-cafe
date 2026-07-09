import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { termsContent } from '@/constants/policies';

export default function TermsPage() {
  return (
    <div className="py-24 bg-[#F8F4EA] dark:bg-[#0F1E15] min-h-screen text-[#3C2415] dark:text-cream-100 transition-colors duration-300 font-sans">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-12 h-12 bg-[#3D2015]/5 dark:bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#1A3324] dark:text-[#D4AF37] tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-sm uppercase tracking-widest text-[#3C2415]/60 dark:text-cream-200/50 font-semibold">
            Last Updated: June 2026
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/40 dark:bg-[#132A1D]/45 backdrop-blur-md border border-[#3C2415]/10 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-xl space-y-6 leading-relaxed text-sm text-[#3C2415]/80 dark:text-cream-100/70"
        >
          {termsContent}
        </motion.div>
      </div>
    </div>
  );
}
