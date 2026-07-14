import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Users, Store, Coffee } from 'lucide-react';

export default function FranchisePage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F3E9] dark:bg-[#0B150F] transition-colors duration-300">
        <div className="text-center bg-white dark:bg-[#112017] p-12 rounded-3xl shadow-sm border border-[#3C2415]/5 dark:border-white/10 max-w-lg mx-auto">
          <div className="w-20 h-20 bg-[#1A3324] dark:bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#D4AF37] dark:text-[#3D2015]" />
          </div>
          <h2 className="text-3xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-4">Application Received</h2>
          <p className="text-[#3C2415]/70 dark:text-cream-200/70 mb-8">
            Thank you for your interest in joining the Akole Cafe family. Our franchise team will review your application and get back to you within 3-5 business days.
          </p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="bg-[#1A3324] hover:bg-[#112419] dark:bg-[#D4AF37] dark:hover:bg-[#C5A028] text-white dark:text-[#3D2015] px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-[1.01]"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F3E9] dark:bg-[#0B150F] min-h-screen py-24 transition-colors duration-300">
      <div className="container-custom max-w-6xl">
        <div className="text-center mb-20">
          <p className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mb-4">Partner With Us</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] leading-tight mb-6">
            Akole Cafe <span className="text-[#D4AF37] italic font-light">Franchise</span>
          </h1>
          <p className="text-[#3C2415]/70 dark:text-cream-200/70 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Join a rapidly growing premium coffee brand. We are looking for passionate partners to expand the Akole Cafe experience worldwide.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-12">
            <div>
              <h3 className="text-3xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-8">Why Choose Akole Cafe?</h3>
              <div className="space-y-6">
                {[
                  { icon: TrendingUp, title: "Proven Business Model", desc: "High ROI with streamlined operations and comprehensive training." },
                  { icon: Coffee, title: "Premium Quality Products", desc: "Access to our exclusive supply chain of high-grade beans." },
                  { icon: Store, title: "Architectural Support", desc: "Full interior design and build-out guidance for luxury aesthetic." },
                  { icon: Users, title: "Marketing & Community", desc: "National marketing support and local engagement strategies." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-5"
                  >
                    <div className="w-12 h-12 bg-white dark:bg-[#112017] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-[#3C2415]/5 dark:border-white/10">
                      <item.icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1A3324] dark:text-[#FDFBF7] text-lg mb-1">{item.title}</h4>
                      <p className="text-[#3C2415]/70 dark:text-cream-200/70 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-[#1A3324] dark:bg-[#112017] p-8 rounded-[32px] text-white border dark:border-white/10 shadow-lg">
              <h3 className="font-display font-bold text-2xl mb-6 text-[#D4AF37]">Investment Details</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-white/70">Franchise Fee</span>
                  <span className="font-bold text-[#D4AF37]">₹15,00,000</span>
                </li>
                <li className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-white/70">Estimated Initial Investment</span>
                  <span className="font-bold text-[#D4AF37]">₹45L - ₹65L</span>
                </li>
                <li className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-white/70">Royalty Fee</span>
                  <span className="font-bold text-[#D4AF37]">6% of Gross Sales</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-white/70">Space Required</span>
                  <span className="font-bold text-[#D4AF37]">800 - 1500 sq ft</span>
                </li>
              </ul>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#112017] rounded-[40px] p-8 md:p-10 shadow-sm border border-[#3C2415]/5 dark:border-white/10"
          >
            <h3 className="font-display font-bold text-2xl text-[#1A3324] dark:text-[#FDFBF7] mb-6">Submit Your Application</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3C2415] dark:text-cream-200">First Name</label>
                  <input type="text" required className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent dark:border-white/5 rounded-xl px-4 py-3 text-[#1A3324] dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3C2415] dark:text-cream-200">Last Name</label>
                  <input type="text" required className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent dark:border-white/5 rounded-xl px-4 py-3 text-[#1A3324] dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3C2415] dark:text-cream-200">Email</label>
                  <input type="email" required className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent dark:border-white/5 rounded-xl px-4 py-3 text-[#1A3324] dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3C2415] dark:text-cream-200">Phone</label>
                  <input type="tel" required className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent dark:border-white/5 rounded-xl px-4 py-3 text-[#1A3324] dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3C2415] dark:text-cream-200">City</label>
                  <input type="text" required className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent dark:border-white/5 rounded-xl px-4 py-3 text-[#1A3324] dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3C2415] dark:text-cream-200">State</label>
                  <input type="text" required className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent dark:border-white/5 rounded-xl px-4 py-3 text-[#1A3324] dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#3C2415] dark:text-cream-200">Liquid Capital Available</label>
                <select required className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent dark:border-white/5 rounded-xl px-4 py-3 text-[#1A3324] dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] appearance-none cursor-pointer">
                  <option value="" className="dark:bg-[#112017]">Select an option</option>
                  <option value="15-25" className="dark:bg-[#112017]">₹15L - ₹25L</option>
                  <option value="25-45" className="dark:bg-[#112017]">₹25L - ₹45L</option>
                  <option value="45-65" className="dark:bg-[#112017]">₹45L - ₹65L</option>
                  <option value="65+" className="dark:bg-[#112017]">₹65L+</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#3C2415] dark:text-cream-200">Prior Business/F&B Experience?</label>
                <textarea rows={3} required placeholder="Briefly describe your experience..." className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent dark:border-white/5 rounded-xl px-4 py-3 text-[#1A3324] dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#1A3324] hover:bg-[#112419] dark:bg-[#D4AF37] dark:hover:bg-[#C5A028] text-white dark:text-[#3D2015] py-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] shadow-md mt-4 cursor-pointer"
              >
                Submit Application
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
