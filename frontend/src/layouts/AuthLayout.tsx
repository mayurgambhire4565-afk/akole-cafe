import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import { ArrowLeft, Loader2 } from 'lucide-react';
import React, { Suspense } from 'react';

export default function AuthLayout() {
  const location = useLocation();
  const isRegisterPage = location.pathname === '/register';

  const backToPath = isRegisterPage ? '/' : '/register';
  const backToLabel = isRegisterPage ? 'Back to Home' : 'Back to Sign Up';

  return (
    <div className="h-screen overflow-hidden flex bg-[#F8F4EA] dark:bg-[#0F1E15] transition-colors duration-300">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-[#D4AF37]/10">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=3840&q=100)',
          }}
        />
        {/* Luxury dark green overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1A12]/95 via-[#132A1D]/90 to-[#1A3324]/80" />

        {/* Decorative subtle gold light leak */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37] rounded-full blur-[150px] opacity-15" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#2E7D32] rounded-full blur-[150px] opacity-20" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col justify-between p-16 w-full"
        >
          <Link to="/" className="inline-block w-fit group">
            <Logo size={48} showText={true} textColor="text-cream-50" />
          </Link>

          <div>
            <blockquote className="mb-12">
              <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                Est. 2026 • Akole
              </span>
              <h1 className="text-5xl font-display font-bold text-cream-50 leading-[1.15] mb-6">
                Brewing Connections,<br/>
                <span className="text-[#D4AF37] italic font-serif font-light">Serving Memories</span>
              </h1>
              <p className="text-cream-100/70 text-base font-light leading-relaxed max-w-md">
                Step into a world where every cup tells a story. Savor handcrafted blends, luxury desserts, and a space designed to elevate your coffee experience.
              </p>
            </blockquote>

            {/* Features list */}
            <div className="flex items-center gap-10 border-t border-[#F8F4EA]/15 pt-8">
              {[
                { value: 'Premium', label: 'Coffee Beans' },
                { value: 'Artisan', label: 'Brewing Methods' },
                { value: 'Luxury', label: 'Atmosphere' },
              ].map(({ value, label }) => (
                <div key={label} className="group">
                  <p className="text-[#D4AF37] font-semibold text-lg font-display mb-1 transition-colors group-hover:text-white">{value}</p>
                  <p className="text-cream-200/50 text-[10px] tracking-widest uppercase">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col justify-start py-12 lg:py-16 relative bg-[#F8F4EA] dark:bg-[#0F1E15] transition-colors duration-300">
        

        {/* Mobile Header Logo */}
        <div className="lg:hidden flex items-center justify-center mb-10">
          <Link to="/" className="group">
            <Logo size={48} showText={true} textColor="text-[#3D2015] dark:text-cream-50" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto my-auto py-8"
        >
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8 text-gold-500" />
            </div>
          }>
            <Outlet />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
