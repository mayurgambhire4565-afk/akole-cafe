import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, X, CheckCircle2, Ticket, Loader2, CreditCard, QrCode, ShieldCheck, Mail, PhoneCall } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useLanguageStore } from '@/store/languageStore';

interface EventItem {
  id: string;
  title: string;
  titleMr: string;
  date: string;
  dateMr: string;
  time: string;
  timeMr: string;
  location: string;
  locationMr: string;
  image: string;
  description: string;
  descriptionMr: string;
  price: number;
}

const UPCOMING_EVENTS: EventItem[] = [
  {
    id: '1',
    title: 'Coffee Tasting Masterclass',
    titleMr: 'कॉफी टेस्टिंग मास्टरक्लास',
    date: 'Oct 24, 2026',
    dateMr: '२४ ऑक्टोबर २०२६',
    time: '10:00 AM - 12:00 PM',
    timeMr: 'सकाळी १०:०० ते दुपारी १२:००',
    location: 'Akole Cafe Main Branch',
    locationMr: 'अकोले कॅफे मुख्य शाखा',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&auto=format&fit=crop&q=80',
    description: 'Join our expert baristas for an exclusive tasting of rare single-origin beans from Ethiopia and Colombia.',
    descriptionMr: 'इथिओपिया आणि कोलंबियाच्या दुर्मिळ कॉफी बीन्सची चव अनुभवण्यासाठी आमच्या तज्ज्ञ बारिस्तांसोबत सहभागी व्हा.',
    price: 1500,
  },
  {
    id: '2',
    title: 'Latte Art Workshop',
    titleMr: 'लट्टे आर्ट वर्कशॉप',
    date: 'Nov 05, 2026',
    dateMr: '०५ नोव्हेंबर २०२६',
    time: '2:00 PM - 4:00 PM',
    timeMr: 'दुपारी २:०० ते संध्याकाळी ४:००',
    location: 'Akole Cafe Roastery',
    locationMr: 'अकोले कॅफे रोस्टरी',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1200&auto=format&fit=crop&q=80',
    description: 'Learn the secrets of creating beautiful latte art. Perfect for beginners and home brewers.',
    descriptionMr: 'कॉफीवर सुंदर लट्टे आर्ट डिझाइन करण्याचे कौशल्य शिका. नवशिक्यांसाठी उत्तम वर्कशॉप.',
    price: 2000,
  },
  {
    id: '3',
    title: 'Live Jazz & Evening Brews',
    titleMr: 'लाईव्ह जॅझ आणि ईव्हनिंग ब्र्यूज',
    date: 'Nov 12, 2026',
    dateMr: '१२ नोव्हेंबर २०२६',
    time: '7:00 PM - 10:00 PM',
    timeMr: 'संध्याकाळी ७:०० ते रात्री १०:००',
    location: 'Akole Cafe Main Branch',
    locationMr: 'अकोले कॅफे मुख्य शाखा',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&auto=format&fit=crop&q=80',
    description: 'Enjoy a relaxing evening of live jazz music paired with our signature coffee cocktails and desserts.',
    descriptionMr: 'लाईव्ह जॅझ संगीत, सिग्नेचर कॉफी कॉकटेल आणि खमंग डिझर्ट्सचा आनंददायी संध्याकाळ.',
    price: 500,
  },
  {
    id: '4',
    title: 'Espresso Extraction & Sourcing Symposium',
    titleMr: 'एस्प्रेसो एक्सट्रॅक्शन आणि सोर्सिंग चर्चासत्र',
    date: 'Nov 20, 2026',
    dateMr: '२० नोव्हेंबर २०२६',
    time: '11:00 AM - 2:00 PM',
    timeMr: 'सकाळी ११:०० ते दुपारी २:००',
    location: 'Akole Roastery & Labs',
    locationMr: 'अकोले रोस्टरी अँड लॅब्स',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&auto=format&fit=crop&q=80',
    description: 'A technical masterclass into the science of espresso extraction, TDS profiling, and fair-trade sourcing practices.',
    descriptionMr: 'एस्प्रेसो एक्सट्रॅक्शन सायन्स, टीडीएस प्रोफायलिंग आणि भारतीय कॉफी इस्टेट्स बद्दल तांत्रिक मास्टरक्लास.',
    price: 2500,
  },
  {
    id: '5',
    title: 'Barista Championship & Brewing Face-off',
    titleMr: 'बारिस्ता चॅम्पियनशिप स्पर्धा',
    date: 'Dec 05, 2026',
    dateMr: '०५ डिसेंबर २०२६',
    time: '5:00 PM - 9:00 PM',
    timeMr: 'संध्याकाळी ५:०० ते रात्री ९:००',
    location: 'Akole Cafe Main Branch Patio',
    locationMr: 'अकोले कॅफे मेन ब्रँच पॅटिओ',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&auto=format&fit=crop&q=80',
    description: 'Watch the region\'s top baristas compete in a thrilling multi-round pour-over precision and creative latte art tournament.',
    descriptionMr: 'परिसरातील अव्वल बारिस्तांची थरारक कॉफी बनवण्याची स्पर्धा. तिकीटात अमर्याद कॉफी टेस्टिंग समाविष्ट.',
    price: 750,
  },
  {
    id: '6',
    title: 'Coffee & Dessert Pairing Gala',
    titleMr: 'कॉफी आणि डिझर्ट पेअरिंग गॅला',
    date: 'Dec 18, 2026',
    dateMr: '१८ डिसेंबर २०२६',
    time: '6:30 PM - 9:30 PM',
    timeMr: 'संध्याकाळी ६:३० ते रात्री ९:३०',
    location: 'Akole Cafe Main Branch',
    locationMr: 'अकोले कॅफे मुख्य शाखा',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop&q=80',
    description: 'An premium sensory journey featuring a multi-course tasting menu pairing rare coffees with custom-curated pastries.',
    descriptionMr: 'विशेष कॉफी आणि मास्टर शेफ्सच्या पेस्ट्री व चॉकोलेट्सचे अनोखे कॉम्बिनेशन गॅला.',
    price: 3000,
  }
];

export default function EventsPage() {
  const { language } = useLanguageStore();
  const isMr = language === 'mr';

  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  
  // Attendee Form State
  const [ticketCount, setTicketCount] = useState(1);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'razorpay'>('upi');
  const [transactionRef, setTransactionRef] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedPassId, setConfirmedPassId] = useState('');

  const handleBookClick = (event: EventItem) => {
    setSelectedEvent(event);
    setStep('details');
    setTicketCount(1);
    setTransactionRef('');
  };

  const handleGoToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName || !attendeePhone || !attendeeEmail) {
      toast.error(isMr ? 'कृपया तुमचे नाव, फोन आणि ईमेल भरा' : 'Please enter your name, phone and email');
      return;
    }
    setStep('payment');
  };

  const handleProcessPaymentAndBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'upi' && !transactionRef) {
      toast.error(isMr ? 'कृपया UPI UTR / ट्रांझॅक्शन आयडी प्रविष्ट करा' : 'Please enter UPI Transaction UTR Reference');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);

    const generatedPassId = `AKL-EVT-${Math.floor(10000 + Math.random() * 90000)}`;
    setConfirmedPassId(generatedPassId);
    setStep('confirmed');

    // Trigger Notification simulation
    toast.success(
      isMr
        ? `ऍडव्हान्स पेमेंट स्वीकारले! पास तिकीट ${attendeeEmail} आणि ${attendeePhone} वर पाठवले आहे 🎟️`
        : `Advance Payment Received! Ticket receipt sent to ${attendeeEmail} & ${attendeePhone} 🎟️`
    );
  };

  const handleWhatsAppPass = () => {
    if (!selectedEvent) return;
    const text = encodeURIComponent(
      isMr
        ? `🎟️ *अकोले कॅफे - इव्हेंट पास पावती*\n\nपास आयडी: ${confirmedPassId}\nकार्यक्रम: ${selectedEvent.titleMr}\nनाव: ${attendeeName}\nफोन: ${attendeePhone}\nतारीख: ${selectedEvent.dateMr}\nवेळ: ${selectedEvent.timeMr}\nपास संख्या: ${ticketCount} नग\nएकूण जमा रक्कम: ₹${selectedEvent.price * ticketCount} (PAID)`
        : `🎟️ *AKOLE CAFE - EVENT PASS RECEIPT*\n\nPass Ticket ID: ${confirmedPassId}\nEvent: ${selectedEvent.title}\nAttendee: ${attendeeName}\nPhone: ${attendeePhone}\nDate: ${selectedEvent.date}\nTime: ${selectedEvent.time}\nTickets: ${ticketCount}\nTotal Paid: ₹${selectedEvent.price * ticketCount} (PAID)`
    );
    window.open(`https://wa.me/918432387067?text=${text}`, '_blank');
  };

  return (
    <div className="bg-[#F5F3E9] dark:bg-[#0B150F] min-h-screen pt-24 pb-20 transition-colors duration-300">
      <div className="container-custom max-w-6xl px-4">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <p className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mb-3">
            {isMr ? 'कार्यक्रम आणि वर्कशॉप्स' : 'Gatherings & Workshops'}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] leading-tight mb-4">
            Cafe <span className="text-[#D4AF37] italic font-light">Events</span>
          </h1>
          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-[#3C2415]/70 dark:text-cream-200/70 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            {isMr
              ? 'कॉफी टेस्टिंग मास्टरक्लासपासून लाईव्ह म्युझिक संध्याकाळपर्यंत, अकोले कॅफेमधील आगामी कार्यक्रमांचा आनंद घ्या.'
              : "From coffee tasting masterclasses to live music evenings, discover what's happening at Akole Cafe and join our community."
            }
          </p>
        </div>

        {/* Events Grid */}
        <div className="space-y-10">
          {UPCOMING_EVENTS.map((event, i) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white dark:bg-[#112017] rounded-[28px] overflow-hidden shadow-sm border border-[#3C2415]/5 dark:border-white/5 flex flex-col md:flex-row group"
            >
              <div className="md:w-2/5 aspect-video md:aspect-auto relative overflow-hidden">
                <img 
                  src={event.image} 
                  alt={isMr ? event.titleMr : event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 md:p-10 md:w-3/5 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-3">
                    {isMr ? event.titleMr : event.title}
                  </h2>
                  <p className="text-[#3C2415]/70 dark:text-cream-200/70 text-sm md:text-base leading-relaxed mb-6">
                    {isMr ? event.descriptionMr : event.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2.5 text-[#3C2415] dark:text-cream-200">
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-medium text-xs md:text-sm">{isMr ? event.dateMr : event.date}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[#3C2415] dark:text-cream-200">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-medium text-xs md:text-sm">{isMr ? event.timeMr : event.time}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[#3C2415] dark:text-cream-200 sm:col-span-2">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-medium text-xs md:text-sm">{isMr ? event.locationMr : event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#3C2415]/10 dark:border-white/10 pt-6 mt-4">
                  <div className="font-bold text-xl md:text-2xl text-[#1A3324] dark:text-[#FDFBF7]">
                    ₹{event.price} <span className="text-xs text-[#3C2415]/60 dark:text-cream-200/50 font-medium">/{isMr ? ' व्यक्ती' : ' person'}</span>
                  </div>
                  <button 
                    onClick={() => handleBookClick(event)}
                    className="bg-[#1A3324] hover:bg-[#2C4A36] dark:bg-[#D4AF37] dark:hover:bg-[#C5A028] text-white dark:text-[#3C2415] px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <Ticket className="w-4 h-4" />
                    {isMr ? 'पास बुक करा' : 'Book Pass'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Event Booking & Advance Payment Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#112017] rounded-[28px] max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#3C2415]/10 dark:border-white/10 relative my-8"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full bg-black/5 dark:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* STEP 1: Attendee Details */}
              {step === 'details' && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-[#1A3324] dark:text-[#FDFBF7]">
                        {isMr ? selectedEvent.titleMr : selectedEvent.title}
                      </h3>
                      <p className="text-xs text-[#D4AF37] font-semibold">
                        {isMr ? selectedEvent.dateMr : selectedEvent.date} • {isMr ? selectedEvent.timeMr : selectedEvent.time}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleGoToPayment} className="space-y-4 mt-6">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70 block mb-1">
                        {isMr ? 'पूर्ण नाव *' : 'Full Name *'}
                      </label>
                      <input 
                        type="text" 
                        required
                        value={attendeeName}
                        onChange={(e) => setAttendeeName(e.target.value)}
                        className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm outline-none text-[#1A3324] dark:text-cream-50"
                        placeholder={isMr ? "तुमचे नाव" : "John Doe"}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70 block mb-1">
                          {isMr ? 'ईमेल पत्ता (पावतीसाठी) *' : 'Email Address *'}
                        </label>
                        <input 
                          type="email" 
                          required
                          value={attendeeEmail}
                          onChange={(e) => setAttendeeEmail(e.target.value)}
                          className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm outline-none text-[#1A3324] dark:text-cream-50"
                          placeholder="yourname@gmail.com"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70 block mb-1">
                          {isMr ? 'फोन नंबर (SMS/WhatsApp) *' : 'Phone Number *'}
                        </label>
                        <input 
                          type="tel" 
                          required
                          value={attendeePhone}
                          onChange={(e) => setAttendeePhone(e.target.value)}
                          className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm outline-none text-[#1A3324] dark:text-cream-50"
                          placeholder="+91 8432387067"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70 block mb-1">
                        {isMr ? 'तिकीट संख्या (Pass Quantity)' : 'Number of Passes'}
                      </label>
                      <select 
                        value={ticketCount}
                        onChange={(e) => setTicketCount(Number(e.target.value))}
                        className="w-full bg-[#F5F3E9] dark:bg-white/5 border border-transparent focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm outline-none text-[#1A3324] dark:text-cream-50"
                      >
                        <option value={1}>1 Pass (₹{selectedEvent.price})</option>
                        <option value={2}>2 Passes (₹{selectedEvent.price * 2})</option>
                        <option value={3}>3 Passes (₹{selectedEvent.price * 3})</option>
                        <option value={4}>4 Passes (₹{selectedEvent.price * 4})</option>
                        <option value={5}>5 Passes (₹{selectedEvent.price * 5})</option>
                      </select>
                    </div>

                    <div className="p-4 bg-[#F5F3E9] dark:bg-white/5 rounded-2xl flex items-center justify-between my-2 border border-[#D4AF37]/20">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#3C2415]/70 dark:text-cream-200/70 block">
                          {isMr ? 'एकूण ऍडव्हान्स पेमेंट (Total Amount):' : 'Advance Payment Due:'}
                        </span>
                        <span className="text-xs text-[#3C2415]/50 dark:text-cream-200/50">
                          {isMr ? 'बुकिंगसाठी ऍडव्हान्स पेमेंट आवश्यक आहे' : 'Required to confirm ticket pass'}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-[#1A3324] dark:text-[#D4AF37]">
                        ₹{selectedEvent.price * ticketCount}
                      </span>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#1A3324] hover:bg-[#2C4A36] dark:bg-[#D4AF37] dark:hover:bg-[#C5A028] text-white dark:text-[#3C2415] py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      {isMr ? 'पेमेंटसाठी पुढे जा (Proceed to Payment)' : 'Proceed to Payment (₹' + (selectedEvent.price * ticketCount) + ')'}
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 2: Advance Payment Step */}
              {step === 'payment' && (
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#1A3324] dark:text-[#FDFBF7]">
                        {isMr ? 'ऍडव्हान्स पेमेंट करा' : 'Advance Payment Required'}
                      </h3>
                      <p className="text-xs text-[#3C2415]/60 dark:text-cream-200/60">
                        {isMr ? 'पेमेंट पूर्ण झाल्यावर पास कन्फर्म होईल.' : 'Complete advance payment to confirm booking pass.'}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-[#D4AF37]">₹{selectedEvent.price * ticketCount}</span>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        paymentMethod === 'upi'
                          ? 'bg-[#1A3324] text-white border-[#1A3324] dark:bg-[#D4AF37] dark:text-[#3C2415] dark:border-[#D4AF37]'
                          : 'bg-[#F5F3E9] dark:bg-white/5 border-transparent text-[#3C2415]/70 dark:text-cream-200/70'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" /> UPI / QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        paymentMethod === 'card'
                          ? 'bg-[#1A3324] text-white border-[#1A3324] dark:bg-[#D4AF37] dark:text-[#3C2415] dark:border-[#D4AF37]'
                          : 'bg-[#F5F3E9] dark:bg-white/5 border-transparent text-[#3C2415]/70 dark:text-cream-200/70'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        paymentMethod === 'razorpay'
                          ? 'bg-[#1A3324] text-white border-[#1A3324] dark:bg-[#D4AF37] dark:text-[#3C2415] dark:border-[#D4AF37]'
                          : 'bg-[#F5F3E9] dark:bg-white/5 border-transparent text-[#3C2415]/70 dark:text-cream-200/70'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Razorpay
                    </button>
                  </div>

                  <form onSubmit={handleProcessPaymentAndBook} className="space-y-4">
                    {paymentMethod === 'upi' && (
                      <div className="bg-[#F5F3E9] dark:bg-white/5 p-4 rounded-2xl border border-[#D4AF37]/20 text-center space-y-3">
                        <p className="text-xs font-bold text-[#1A3324] dark:text-cream-50 uppercase tracking-wider">
                          {isMr ? 'PhonePe / GPay / Paytm ने स्कॅन करा' : 'Scan QR code to pay via PhonePe / GPay / Paytm'}
                        </p>
                        <div className="w-48 h-48 mx-auto bg-white p-2 rounded-2xl shadow-md flex items-center justify-center overflow-hidden border border-gray-200">
                          <img 
                            src="/images/payment/upi_qr.jpg" 
                            alt="Prem Sabde UPI QR Code" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-[#1A3324] dark:text-cream-50">Prem Sabde</p>
                          <p className="text-xs font-mono text-[#D4AF37] font-bold">UPI ID: premsabde7-1@okhdfcbank</p>
                        </div>

                        <div className="text-left pt-1">
                          <label className="text-[11px] font-bold uppercase text-[#3C2415]/70 dark:text-cream-200/70 block mb-1">
                            {isMr ? 'UPI Transaction UTR / Ref No. *' : 'Enter UPI Transaction UTR / Ref No. *'}
                          </label>
                          <input 
                            type="text" 
                            required
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono outline-none text-[#1A3324] dark:text-cream-50"
                            placeholder="12-digit UTR No. (e.g. 429184029104)"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="space-y-3 bg-[#F5F3E9] dark:bg-white/5 p-4 rounded-2xl">
                        <div>
                          <label className="text-[11px] font-bold uppercase text-[#3C2415]/70 dark:text-cream-200/70 block mb-1">Card Number</label>
                          <input type="text" placeholder="4111 2222 3333 4444" className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs outline-none" required />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-bold uppercase text-[#3C2415]/70 dark:text-cream-200/70 block mb-1">Expiry</label>
                            <input type="text" placeholder="MM/YY" className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs outline-none" required />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold uppercase text-[#3C2415]/70 dark:text-cream-200/70 block mb-1">CVV</label>
                            <input type="password" placeholder="123" maxLength={3} className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs outline-none" required />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'razorpay' && (
                      <div className="bg-[#F5F3E9] dark:bg-white/5 p-5 rounded-2xl text-center space-y-2">
                        <ShieldCheck className="w-8 h-8 text-[#D4AF37] mx-auto" />
                        <p className="text-xs font-bold text-[#1A3324] dark:text-cream-50">Razorpay Secure Checkout</p>
                        <p className="text-[11px] text-[#3C2415]/60 dark:text-cream-200/60">Pay safely using Cards, Netbanking, Wallets or UPI.</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setStep('details')}
                        className="w-1/3 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white py-3 rounded-xl font-bold text-xs uppercase"
                      >
                        {isMr ? 'मागे' : 'Back'}
                      </button>
                      <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-2/3 bg-[#1A3324] hover:bg-[#2C4A36] dark:bg-[#D4AF37] dark:hover:bg-[#C5A028] text-white dark:text-[#3C2415] py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        {isLoading ? (isMr ? 'तपासत आहे...' : 'Verifying...') : (isMr ? 'पे करा आणि बुक करा' : 'Pay & Confirm Pass')}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 3: Confirmed Luxury VIP Ticket Stub */}
              {step === 'confirmed' && (
                <div className="text-center py-2">
                  {/* Animated Gold Check Icon */}
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-16 h-16 bg-gradient-to-tr from-[#D4AF37] to-[#FFF3B0] rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  >
                    <CheckCircle2 className="w-9 h-9 text-[#112017]" />
                  </motion.div>
                  
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
                    {isMr ? 'ऑफिशियल बुकिंग कन्फर्म्ड' : 'OFFICIAL BOOKING CONFIRMED'}
                  </p>

                  <h3 className="text-2xl md:text-3xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-4">
                    {isMr ? 'इव्हेंट व्हीआयपी पास' : 'Event VIP Access Pass'}
                  </h3>

                  {/* Luxury VIP Event Ticket Stub */}
                  <div className="my-5 bg-gradient-to-br from-[#1A3324] via-[#0F2217] to-[#08150E] text-white rounded-2xl border-2 border-[#D4AF37] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden text-left">
                    
                    {/* Golden Holographic Watermark / Top Header */}
                    <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-[#D4AF37]" />
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] block">AKOLE CAFE VIP</span>
                          <span className="font-mono text-xs font-bold tracking-wider text-cream-100">{confirmedPassId}</span>
                        </div>
                      </div>
                      <div className="bg-[#D4AF37] text-[#1A3324] px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider shadow-sm">
                        ✓ PAID & CONFIRMED
                      </div>
                    </div>

                    {/* Event & Attendee Details */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#D4AF37]/80 font-bold">{isMr ? 'कार्यक्रम' : 'Event Title'}</p>
                        <h4 className="font-display font-bold text-lg text-white leading-snug">
                          {isMr ? selectedEvent.titleMr : selectedEvent.title}
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/10">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#D4AF37]/80 font-bold">{isMr ? 'पासधारक नाव' : 'Attendee Name'}</p>
                          <p className="text-xs font-semibold text-cream-100 truncate">{attendeeName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#D4AF37]/80 font-bold">{isMr ? 'पास संख्या' : 'Tickets'}</p>
                          <p className="text-xs font-semibold text-cream-100">{ticketCount} {isMr ? 'पास (Tickets)' : 'Pass(es)'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/10">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#D4AF37]/80 font-bold">{isMr ? 'तारीख व वेळ' : 'Date & Time'}</p>
                          <p className="text-[11px] font-medium text-cream-200/90">{isMr ? selectedEvent.dateMr : selectedEvent.date}</p>
                          <p className="text-[10px] text-cream-200/60">{isMr ? selectedEvent.timeMr : selectedEvent.time}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#D4AF37]/80 font-bold">{isMr ? 'एकूण जमा रक्कम' : 'Total Amount Paid'}</p>
                          <p className="text-lg font-bold text-[#D4AF37]">₹{selectedEvent.price * ticketCount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stub Dashed Separator with Cutouts */}
                    <div className="relative my-4 flex items-center justify-between">
                      <div className="w-5 h-5 bg-white dark:bg-[#112017] rounded-full -ml-8 border-r border-[#D4AF37]"></div>
                      <div className="w-full border-b border-dashed border-[#D4AF37]/40 mx-2"></div>
                      <div className="w-5 h-5 bg-white dark:bg-[#112017] rounded-full -mr-8 border-l border-[#D4AF37]"></div>
                    </div>

                    {/* Barcode Visual & Notification Footer */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-cream-200/70">
                          <Mail className="w-3 h-3 text-[#D4AF37]" /> {isMr ? 'ईमेलवर पास पावती पाठवली' : 'Ticket sent to Email'}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-cream-200/70">
                          <PhoneCall className="w-3 h-3 text-[#D4AF37]" /> {isMr ? 'मोबाईलवर SMS पाठवला' : 'SMS sent to Mobile'}
                        </div>
                      </div>

                      {/* Simulated Barcode */}
                      <div className="text-right">
                        <div className="h-7 w-24 bg-white/90 rounded px-1.5 py-0.5 flex items-center justify-between gap-0.5">
                          {[3, 1, 4, 1, 5, 2, 6, 2, 3, 1, 4, 2, 5, 1, 3, 2].map((w, idx) => (
                            <div key={idx} className="h-full bg-black" style={{ width: `${w}px` }}></div>
                          ))}
                        </div>
                        <span className="text-[8px] font-mono text-cream-200/60 block mt-0.5 uppercase tracking-tighter">ENTRY BARCODE</span>
                      </div>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mt-4">
                    <button 
                      onClick={handleWhatsAppPass}
                      className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
                    >
                      <FaWhatsapp className="w-4 h-4 text-white" />
                      {isMr ? 'WhatsApp वर व्हीआयपी पास पावती मिळवा' : 'Send VIP Ticket Receipt to WhatsApp'}
                    </button>

                    <button 
                      onClick={() => setSelectedEvent(null)}
                      className="w-full bg-gray-100 dark:bg-white/10 text-[#1A3324] dark:text-cream-50 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:bg-black/5 dark:hover:bg-white/15"
                    >
                      {isMr ? 'पूर्ण करा' : 'Done & Close'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
