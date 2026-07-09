import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';
import api from '@/api/axios';

export default function ReserveTablePage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Form states
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await api.post('/reservations', {
        date,
        time,
        guestCount,
        name,
        email,
        phone,
        specialRequests,
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to confirm reservation. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#FDFBF7] dark:bg-[#0B150F] pt-24 pb-20 px-4 transition-colors duration-300">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-[#FDFBF7] dark:bg-[#112017] p-10 md:p-12 rounded-[24px] shadow-xl border border-[#3C2415]/10 dark:border-white/10 max-w-lg mx-auto"
        >
          <div className="w-20 h-20 bg-[#3C2415] dark:bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 border border-gold-500/30">
            <CheckCircle2 className="w-10 h-10 text-[#D4AF37] dark:text-[#3C2415]" />
          </div>
          <h2 className="text-3xl font-display font-bold text-[#3C2415] dark:text-[#FDFBF7] mb-4">Reservation Confirmed</h2>
          <p className="text-[#3C2415]/75 dark:text-cream-200/70 font-light mb-8 leading-relaxed">
            Thank you for booking with Akole Cafe. We have sent the confirmation details to your email. We look forward to welcoming you soon!
          </p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="bg-[#3C2415] hover:bg-[#281812] dark:bg-[#D4AF37] dark:hover:bg-[#C5A028] text-[#FDFBF7] dark:text-[#3C2415] px-8 py-3 rounded-[10px] font-bold text-xs uppercase tracking-widest transition-colors shadow-md border border-gold-500/20"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] dark:bg-[#0B150F] min-h-screen pt-24 pb-20 transition-colors duration-300">
      <div className="container-custom max-w-5xl px-4">
        
        {/* Header Hero Section */}
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Info Side (Left Column - 5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-5 space-y-8"
          >
            <div>
              <p className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mb-3">Book a Table</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#3C2415] dark:text-[#FDFBF7] leading-tight mb-6">
                Reserve Your <br />
                <span className="text-[#D4AF37] italic font-light">Experience</span>
              </h1>
              <div className="w-16 h-[2px] bg-[#D4AF37] mb-6"></div>
              <p className="text-[#3C2415]/70 dark:text-cream-200/70 text-lg font-light leading-relaxed max-w-sm">
                Whether it's a quiet morning espresso, a business lunch, or an evening gathering with friends, secure your spot at Akole Cafe.
              </p>
            </div>
            
            <div className="space-y-6 pt-4">
              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 bg-[#3C2415]/5 dark:bg-white/5 border border-[#3C2415]/10 dark:border-white/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#3C2415] dark:text-[#FDFBF7] text-sm mb-0.5">Opening Hours</h4>
                  <p className="text-[#3C2415]/60 dark:text-cream-200/50 text-xs font-light">Mon - Sun: 7:00 AM - 10:00 PM</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 bg-[#3C2415]/5 dark:bg-white/5 border border-[#3C2415]/10 dark:border-white/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#3C2415] dark:text-[#FDFBF7] text-sm mb-0.5">Large Groups</h4>
                  <p className="text-[#3C2415]/60 dark:text-cream-200/50 text-xs font-light leading-relaxed">
                    For parties larger than 8, please contact us directly at <br/>
                    <a href="https://wa.me/918432387067" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] font-semibold hover:underline">+91 8432387067</a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
 
          {/* Form Side (Right Column - 7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-7 bg-[#FDFBF7] dark:bg-[#112017] rounded-[24px] p-8 md:p-10 border border-[#3C2415]/10 dark:border-white/10 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37] pointer-events-none" />
                    <input 
                      type="date" 
                      required 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      disabled={isPending}
                      className="w-full bg-[#3C2415]/5 dark:bg-white/5 border border-[#3C2415]/10 dark:border-white/10 rounded-[10px] pl-10 pr-4 py-3 text-[#3C2415] dark:text-cream-50 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-sm disabled:opacity-55" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37] pointer-events-none" />
                    <input 
                      type="time" 
                      required 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      disabled={isPending}
                      className="w-full bg-[#3C2415]/5 dark:bg-white/5 border border-[#3C2415]/10 dark:border-white/10 rounded-[10px] pl-10 pr-4 py-3 text-[#3C2415] dark:text-cream-50 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-sm disabled:opacity-55" 
                    />
                  </div>
                </div>
              </div>
 
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">Guest Count</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37] pointer-events-none" />
                  <select 
                    required 
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    disabled={isPending}
                    className="w-full bg-[#3C2415]/5 dark:bg-white/5 border border-[#3C2415]/10 dark:border-white/10 rounded-[10px] pl-10 pr-4 py-3 text-[#3C2415] dark:text-cream-50 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-sm appearance-none disabled:opacity-55"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5">5 People</option>
                    <option value="6">6 People</option>
                    <option value="7">7 People</option>
                    <option value="8">8 People</option>
                  </select>
                </div>
              </div>
 
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPending}
                  className="w-full bg-[#3C2415]/5 dark:bg-white/5 border border-[#3C2415]/10 dark:border-white/10 rounded-[10px] px-4 py-3 text-[#3C2415] dark:text-cream-50 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-sm disabled:opacity-55" 
                />
              </div>
 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">Email</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                    className="w-full bg-[#3C2415]/5 dark:bg-white/5 border border-[#3C2415]/10 dark:border-white/10 rounded-[10px] px-4 py-3 text-[#3C2415] dark:text-cream-50 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-sm disabled:opacity-55" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">Phone</label>
                  <input 
                    type="tel" 
                    placeholder="+91 8432387067" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isPending}
                    className="w-full bg-[#3C2415]/5 dark:bg-white/5 border border-[#3C2415]/10 dark:border-white/10 rounded-[10px] px-4 py-3 text-[#3C2415] dark:text-cream-50 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-sm disabled:opacity-55" 
                  />
                </div>
              </div>
 
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70">Special Requests (Optional)</label>
                <textarea 
                  rows={3} 
                  placeholder="Any dietary requirements or special occasions?" 
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  disabled={isPending}
                  className="w-full bg-[#3C2415]/5 dark:bg-white/5 border border-[#3C2415]/10 dark:border-white/10 rounded-[10px] px-4 py-3 text-[#3C2415] dark:text-cream-50 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-sm resize-none disabled:opacity-55"
                ></textarea>
              </div>
 
              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-[#3C2415] hover:bg-[#281812] dark:bg-[#D4AF37] dark:hover:bg-[#C5A028] text-[#FDFBF7] dark:text-[#3C2415] py-3.5 rounded-[10px] font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.01] shadow-lg border border-gold-500/20 mt-4 flex items-center justify-center gap-2 disabled:opacity-75 disabled:hover:scale-100"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPending ? 'Confirming...' : 'Confirm Reservation'}
              </button>
            </form>
          </motion.div>
 
        </div>
      </div>
    </div>
  );
}
