import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2, Navigation } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useLanguageStore } from '@/store/languageStore';

export default function ContactPage() {
  const { language } = useLanguageStore();
  const isMr = language === 'mr';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(isMr ? 'कृपया सर्व आवश्यक माहिती भरा' : 'Please fill all required fields');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    setIsSubmitted(true);
    toast.success(isMr ? 'तुमचा संदेश यशस्वीरीत्या पाठवला आहे! ☕' : 'Your message has been sent successfully! ☕');
  };

  const handleWhatsAppRedirect = () => {
    const greeting = isMr 
      ? `नमस्ते! मी अकोले कॅफे (Akole Cafe) बद्दल चौकशी करू इच्छितो.`
      : `Hello! I would like to inquire about Akole Cafe.`;
    
    const text = encodeURIComponent(
      `${greeting}\nName: ${formData.name || 'Customer'}\nSubject: ${formData.subject || 'General Inquiry'}\nMessage: ${formData.message || 'Hi, I would like to get in touch!'}`
    );
    window.open(`https://wa.me/918432387067?text=${text}`, '_blank');
  };

  return (
    <div className="bg-[#FDFBF7] dark:bg-[#0B150F] min-h-screen pt-24 pb-20 transition-colors duration-300">
      <div className="container-custom max-w-6xl px-4">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center -top-8 opacity-[0.03] md:opacity-5">
            <span className="text-8xl md:text-9xl font-display font-extrabold text-[#3C2415] dark:text-[#D4AF37] tracking-widest uppercase select-none">AKOLE</span>
          </div>
          <p className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mb-3 relative z-10">
            {isMr ? 'संपर्क साधा' : 'Get in Touch'}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#3C2415] dark:text-[#FDFBF7] leading-tight mb-4 relative z-10">
            Contact <span className="text-[#D4AF37] italic font-light">Us</span>
          </h1>
          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-[#3C2415]/70 dark:text-cream-200/70 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed relative z-10">
            {isMr 
              ? 'आमच्याशी संपर्क साधा. कॉफी, ऑर्डर किंवा टेबल बुकिंग बद्दल काहीही शंका असल्यास निसंकोच मेसेज करा.'
              : "We'd love to hear from you. Whether you have a question about our specialty brews, partnership inquiries, or private bookings."
            }
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
              <h3 className="font-display font-bold text-3xl text-[#D4AF37] mb-3">Akole Cafe & Studio</h3>
              <p className="text-[#FDFBF7]/70 text-sm font-light leading-relaxed mb-10">
                {isMr 
                  ? 'ताज्या ब्रूड कॉफी, अस्सल महाराष्ट्रीयन मेनू आणि रम्य वातावरणाचा आनंद घेण्यासाठी अकोले कॅफेला नक्की भेट द्या.'
                  : 'Drop by to experience fresh specialty coffee brewing, meet our roasters, or discuss collaboration opportunities.'
                }
              </p>

              {/* Contact list */}
              <div className="space-y-7">
                
                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 bg-white/5 border border-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-1">
                      {isMr ? 'कॅफेचा पत्ता' : 'Our Location'}
                    </h4>
                    <p className="text-[#FDFBF7]/80 text-sm font-light leading-relaxed">
                      Behind Akole Bus Stand,<br />
                      Bus Stand Road, Akole - 422601<br />
                      Dist. Ahilyanagar, Maharashtra, India
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 bg-white/5 border border-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-1">
                      {isMr ? 'फोन नंबर' : 'Phone & WhatsApp'}
                    </h4>
                    <a 
                      href="tel:+918432387067" 
                      className="text-[#FDFBF7]/90 hover:text-[#D4AF37] text-sm font-medium leading-relaxed transition-all duration-300 block hover:translate-x-1"
                    >
                      +91 8432387067
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 bg-white/5 border border-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-1">
                      {isMr ? 'ईमेल पत्ता' : 'Direct Email'}
                    </h4>
                    <a 
                      href="mailto:mayurkgambhire09@gmail.com" 
                      className="text-[#FDFBF7]/90 hover:text-[#D4AF37] text-sm font-medium leading-relaxed transition-all duration-300 block hover:translate-x-1"
                    >
                      mayurkgambhire09@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 bg-white/5 border border-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-1">
                      {isMr ? 'वेळ' : 'Opening Hours'}
                    </h4>
                    <p className="text-[#FDFBF7]/80 text-sm font-light leading-relaxed">
                      {isMr ? 'सर्व दिवस: सकाळी ७:०० - रात्री ११:००' : 'All Days: 7:00 AM - 11:00 PM'}
                    </p>
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <div className="pt-4 mt-2 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={handleWhatsAppRedirect}
                    className="w-full group relative flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#25D366]/10 hover:border-[#25D366]/30 transition-all duration-500 overflow-hidden text-left"
                  >
                    <div className="relative flex items-center gap-4 z-10">
                      <div className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.2)] group-hover:shadow-[0_0_25px_rgba(37,211,102,0.4)] group-hover:scale-110 transition-all duration-300">
                        <FaWhatsapp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-[#FDFBF7] font-display font-bold text-sm tracking-wide group-hover:text-[#25D366] transition-colors">
                          {isMr ? 'व्हॉट्सॲपवर मेसेज करा' : 'Chat on WhatsApp'}
                        </p>
                        <p className="text-[#FDFBF7]/50 text-xs font-light tracking-wide">
                          {isMr ? 'त्वरित उत्तर दिले जाईल' : 'Typically replies instantly'}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#25D366]/50 group-hover:bg-[#25D366] transition-all duration-300">
                      <Send className="w-3.5 h-3.5 text-white/50 group-hover:text-white transform group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Form Card (Right Column - 7 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 bg-white dark:bg-[#112017] rounded-[24px] p-8 md:p-10 shadow-sm border border-[#3C2415]/5 dark:border-white/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-display font-bold text-2xl text-[#1A3324] dark:text-[#FDFBF7]">
                    {isMr ? 'संदेश पाठवा' : 'Send us a Message'}
                  </h3>
                  <p className="text-xs text-[#3C2415]/60 dark:text-cream-200/60 mt-1">
                    {isMr 
                      ? 'आम्हाला तुमचा संदेश पाठवा, आम्ही लवकरच उत्तर देऊ.' 
                      : "Fill in the details below and we'll get back to you shortly."
                    }
                  </p>
                </div>
              </div>
              
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center mb-2 border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-2xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7]">
                    {isMr ? 'संदेश पाठवला!' : 'Message Sent!'}
                  </h4>
                  <p className="text-[#3C2415]/70 dark:text-cream-200/70 max-w-sm text-sm leading-relaxed">
                    {isMr
                      ? 'तुमचा संदेश अकोले कॅफे टीमकडे पोहोचला आहे. आम्ही २४ तासांच्या आत तुमच्याशी संपर्क साधू.'
                      : 'Thank you for reaching out to Akole Cafe. We will get back to you within 24 hours.'
                    }
                  </p>
                  <button 
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="mt-6 inline-flex items-center gap-2 text-[#D4AF37] font-semibold text-sm hover:underline"
                  >
                    {isMr ? '→ दुसरा संदेश पाठवा' : '→ Send Another Message'}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">
                        {isMr ? 'तुमचे नाव *' : 'Your Name *'}
                      </label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37]/30 text-[#1A3324] dark:text-cream-50 outline-none transition-all"
                        placeholder={isMr ? "तुमचे नाव" : "John Doe"}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">
                        {isMr ? 'ईमेल पत्ता *' : 'Email Address *'}
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37]/30 text-[#1A3324] dark:text-cream-50 outline-none transition-all"
                        placeholder={isMr ? "yourname@gmail.com" : "john@example.com"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">
                        {isMr ? 'फोन नंबर' : 'Phone Number'}
                      </label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37]/30 text-[#1A3324] dark:text-cream-50 outline-none transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">
                        {isMr ? 'विषय' : 'Subject'}
                      </label>
                      <input 
                        type="text" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37]/30 text-[#1A3324] dark:text-cream-50 outline-none transition-all"
                        placeholder={isMr ? "चौकशी / Booking inquiry" : "How can we help?"}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">
                      {isMr ? 'तुमचा संदेश *' : 'Your Message *'}
                    </label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37]/30 text-[#1A3324] dark:text-cream-50 resize-none outline-none transition-all"
                      placeholder={isMr ? "तुमचा संदेश येथे लिहा..." : "Write your message here..."}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1A3324] hover:bg-[#2C4A36] dark:bg-[#D4AF37] dark:hover:bg-[#C5A028] text-white dark:text-[#3C2415] py-4 rounded-xl font-bold tracking-wider text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-current" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {isLoading 
                      ? (isMr ? 'पाठवत आहे...' : 'Sending Message...')
                      : (isMr ? 'संदेश पाठवा' : 'Send Message')
                    }
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Google Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 w-full rounded-[24px] overflow-hidden shadow-md border border-[#3C2415]/10 dark:border-white/10 bg-white dark:bg-[#112017] p-2"
        >
          <div className="flex items-center justify-between p-4 bg-[#F5F3E9] dark:bg-white/5 rounded-2xl mb-2">
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <h4 className="font-display font-bold text-sm text-[#1A3324] dark:text-cream-50">
                  {isMr ? 'अकोले कॅफे नकाशा लोकेशन' : 'Akole Cafe Location Map'}
                </h4>
                <p className="text-xs text-[#3C2415]/60 dark:text-cream-200/60">Behind Akole Bus Stand, Bus Stand Road, Akole 422601</p>
              </div>
            </div>
            <a 
              href="https://maps.google.com/maps?q=Akole,%20Maharashtra%20422601"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#D4AF37] hover:underline"
            >
              {isMr ? 'नकाशा उघडा ↗' : 'Open Live Map ↗'}
            </a>
          </div>

          <div className="w-full h-[380px] rounded-xl overflow-hidden relative">
            <iframe
              src="https://maps.google.com/maps?q=Akole,%20Maharashtra%20422601&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Akole Cafe Location Map"
              className="w-[calc(100%+40px)] h-[calc(100%+75px)] -mt-[10px] -ml-[20px] filter contrast-105 dark:invert-[0.88] dark:hue-rotate-[180deg]"
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
