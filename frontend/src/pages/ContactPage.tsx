import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="bg-[#FDFBF7] dark:bg-[#0B150F] min-h-screen pt-24 pb-20 transition-colors duration-300">
      <div className="container-custom max-w-6xl px-4">
        
        {/* Header Section */}
        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 flex items-center justify-center -top-8 opacity-[0.03] md:opacity-5">
            <span className="text-8xl md:text-9xl font-display font-extrabold text-[#3C2415] dark:text-[#D4AF37] tracking-widest uppercase select-none">AKOLE</span>
          </div>
          <p className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mb-4 relative z-10">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#3C2415] dark:text-[#FDFBF7] leading-tight mb-6 relative z-10">
            Contact <span className="text-[#D4AF37] italic font-light">Us</span>
          </h1>
          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mb-6"></div>
          <p className="text-[#3C2415]/70 dark:text-cream-200/70 text-lg font-light max-w-2xl mx-auto leading-relaxed relative z-10">
            We'd love to hear from you. Whether you have a question about our specialty brews, partnership inquiries, or private bookings.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Info Card (Left Column - 5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-gradient-to-br from-[#1E110B] to-[#120805] text-[#FDFBF7] rounded-[24px] p-8 md:p-10 shadow-2xl border border-gold-500/20 relative overflow-hidden flex flex-col justify-between"
          >
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="font-display font-bold text-3xl text-[#D4AF37] mb-3">The Coffee Studio</h3>
              <p className="text-[#FDFBF7]/70 text-sm font-light leading-relaxed mb-12">
                Drop by to experience fresh specialty coffee brewing, meet our roasters, or discuss collaboration opportunities.
              </p>

              {/* Contact list */}
              <div className="space-y-8">
                
                <div className="flex gap-5 items-start">
                  <div className="w-11 h-11 bg-white/5 border border-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-1.5">Our Location</h4>
                    <p className="text-[#FDFBF7]/80 text-sm font-light leading-relaxed">
                      Akole, Maharashtra 422601<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <div className="w-11 h-11 bg-white/5 border border-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-1.5">Phone & WhatsApp</h4>
                    <a 
                      href="https://wa.me/918432387067" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#FDFBF7]/80 hover:text-[#D4AF37] text-sm font-light leading-relaxed transition-colors block"
                    >
                      +91 8432387067
                    </a>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <div className="w-11 h-11 bg-white/5 border border-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-1.5">Direct Email</h4>
                    <p className="text-[#FDFBF7]/80 text-sm font-light leading-relaxed">
                      hello@akolecafe.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <div className="w-11 h-11 bg-white/5 border border-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-1.5">Opening Hours</h4>
                    <p className="text-[#FDFBF7]/80 text-sm font-light leading-relaxed">
                      Mon-Fri: 7:00 AM - 11:00 PM<br />
                      Sat-Sun: 8:00 AM - 12:00 AM
                    </p>
                  </div>
                </div>

                {/* Premium WhatsApp Button */}
                <div className="pt-6 mt-4 border-t border-white/5">
                  <a 
                    href="https://wa.me/918432387067" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#25D366]/10 hover:border-[#25D366]/30 transition-all duration-500 overflow-hidden"
                  >
                    {/* Hover Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    
                    <div className="relative flex items-center gap-4 z-10">
                      <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.2)] group-hover:shadow-[0_0_25px_rgba(37,211,102,0.4)] group-hover:scale-110 transition-all duration-300">
                        <FaWhatsapp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-[#FDFBF7] font-display font-bold text-sm tracking-wide mb-1 group-hover:text-[#25D366] transition-colors">Chat on WhatsApp</p>
                        <p className="text-[#FDFBF7]/50 text-xs font-light tracking-wide">Typically replies instantly</p>
                      </div>
                    </div>

                    {/* Right Arrow */}
                    <div className="relative z-10 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#25D366]/50 group-hover:bg-[#25D366] transition-all duration-300">
                      <svg className="w-4 h-4 text-white/50 group-hover:text-white transform group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Form Card (Right Column - 7 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 bg-white dark:bg-[#112017] rounded-[24px] p-8 md:p-10 shadow-sm border border-[#3C2415]/5 dark:border-white/5"
          >
            <h3 className="font-display font-bold text-2xl text-[#1A3324] dark:text-[#FDFBF7] mb-8">Send us a Message</h3>
            
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-50 dark:bg-green-950/20 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-2xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7]">Message Sent!</h4>
                <p className="text-[#3C2415]/70 dark:text-cream-200/70 max-w-sm">
                  Thank you for reaching out. We will get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-[#D4AF37] font-semibold text-sm hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">Your Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-[#F5F3E9] dark:bg-white/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 text-[#1A3324] dark:text-cream-50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">Email Address</label>
                    <input 
                      type="email" 
                      required
                      className="w-full bg-[#F5F3E9] dark:bg-white/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 text-[#1A3324] dark:text-cream-50"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">Subject</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#F5F3E9] dark:bg-white/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 text-[#1A3324] dark:text-cream-50"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">Message</label>
                  <textarea 
                    required
                    rows={5}
                    className="w-full bg-[#F5F3E9] dark:bg-white/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 text-[#1A3324] dark:text-cream-50 resize-none"
                    placeholder="Your message here..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#1A3324] hover:bg-[#2C4A36] dark:bg-[#D4AF37] dark:hover:bg-[#C5A028] text-white dark:text-[#3C2415] py-4 rounded-xl font-bold tracking-wider text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
