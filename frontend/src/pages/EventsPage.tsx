import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const UPCOMING_EVENTS = [
  {
    id: '1',
    title: 'Coffee Tasting Masterclass',
    date: 'Oct 24, 2026',
    time: '10:00 AM - 12:00 PM',
    location: 'Akole Cafe Main Branch',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=3840&q=100',
    description: 'Join our expert baristas for an exclusive tasting of rare single-origin beans from Ethiopia and Colombia.',
    price: 1500,
  },
  {
    id: '2',
    title: 'Latte Art Workshop',
    date: 'Nov 05, 2026',
    time: '2:00 PM - 4:00 PM',
    location: 'Akole Cafe Roastery',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=3840&q=100',
    description: 'Learn the secrets of creating beautiful latte art. Perfect for beginners and home brewers.',
    price: 2000,
  },
  {
    id: '3',
    title: 'Live Jazz & Evening Brews',
    date: 'Nov 12, 2026',
    time: '7:00 PM - 10:00 PM',
    location: 'Akole Cafe Main Branch',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=3840&q=100',
    description: 'Enjoy a relaxing evening of live jazz music paired with our signature coffee cocktails and desserts.',
    price: 500,
  },
  {
    id: '4',
    title: 'Espresso Extraction & Sourcing Symposium',
    date: 'Nov 20, 2026',
    time: '11:00 AM - 2:00 PM',
    location: 'Akole Roastery & Labs',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=3840&q=100',
    description: 'A technical masterclass into the science of espresso extraction, TDS profiling, roast chemistry, and fair-trade sourcing practices directly from Indian coffee estates.',
    price: 2500,
  },
  {
    id: '5',
    title: 'Barista Championship & Brewing Face-off',
    date: 'Dec 05, 2026',
    time: '5:00 PM - 9:00 PM',
    location: 'Akole Cafe Main Branch Patio',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=3840&q=100',
    description: 'Watch the region\'s top baristas compete in a thrilling multi-round pour-over precision and creative latte art tournament. Ticket includes unlimited signature beverage tastings.',
    price: 750,
  },
  {
    id: '6',
    title: 'Coffee & Dessert Pairing Gala',
    date: 'Dec 18, 2026',
    time: '6:30 PM - 9:30 PM',
    location: 'Akole Cafe Main Branch',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=3840&q=100',
    description: 'An premium sensory journey featuring a multi-course tasting menu pairing rare reserve micro-lot coffees with custom-curated pastries, chocolate truffles, and confections by master chocolatiers.',
    price: 3000,
  }
];

export default function EventsPage() {
  return (
    <div className="bg-[#F5F3E9] dark:bg-[#0B150F] min-h-screen pt-24 pb-20 transition-colors duration-300">
      <div className="container-custom max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mb-4">Gatherings & Workshops</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] leading-tight mb-6">
            Cafe <span className="text-[#D4AF37] italic font-light">Events</span>
          </h1>
          <p className="text-[#3C2415]/70 dark:text-cream-200/70 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            From coffee tasting masterclasses to live music evenings, discover what's happening at Akole Cafe and join our community.
          </p>
        </div>

        <div className="space-y-12">
          {UPCOMING_EVENTS.map((event, i) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white dark:bg-[#112017] rounded-[32px] overflow-hidden shadow-sm border border-[#3C2415]/5 dark:border-white/5 flex flex-col md:flex-row group"
            >
              <div className="md:w-2/5 aspect-video md:aspect-auto relative overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center">
                <h2 className="text-3xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-4">{event.title}</h2>
                <p className="text-[#3C2415]/70 dark:text-cream-200/70 text-base leading-relaxed mb-8">
                  {event.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 text-[#3C2415] dark:text-cream-200">
                    <Calendar className="w-5 h-5 text-[#D4AF37]" />
                    <span className="font-medium text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#3C2415] dark:text-cream-200">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                    <span className="font-medium text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#3C2415] dark:text-cream-200 col-span-2">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                    <span className="font-medium text-sm">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto border-t border-[#3C2415]/10 dark:border-white/10 pt-8">
                  <div className="font-bold text-2xl text-[#1A3324] dark:text-[#FDFBF7]">₹{event.price} <span className="text-sm text-[#3C2415]/60 dark:text-cream-200/50 font-medium">/ person</span></div>
                  <Link to="#" className="bg-[#1A3324] hover:bg-[#112419] dark:bg-[#D4AF37] dark:hover:bg-[#C5A028] text-white dark:text-[#3C2415] px-8 py-3.5 rounded-full font-medium transition-colors flex items-center gap-2">
                    Book Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
