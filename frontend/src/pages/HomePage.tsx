import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Star, Plus, Quote, ArrowRight, Play, Award, Gift, Crown, Heart, ShoppingCart, Calendar, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import toast from 'react-hot-toast';
import botanicalStrip from '@/assets/image copy.png';
import HeartLogo from '@/components/ui/HeartLogo';
import { FEATURED_DISHES } from '@/data/maharashtraMenu';
import { useTranslation } from '@/store/languageStore';

// ================================
// HERO SECTION
// ================================
function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-[#F5F3E9] pt-20 pb-10 min-h-[75vh] flex items-center">
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <p className="text-[#D4AF37] font-semibold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-4 sm:mb-6">
              {t('welcomeToCafe')}
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-[#1A3324] leading-[1.15] mb-4 sm:mb-6">
              {t('brewing')} <br />
              {t('connections')} <br />
              {t('serving')} <br />
              <span className="italic font-light text-[#1A3324]">{t('memories')}</span>
            </h1>
            <p className="text-[#3C2415]/70 text-base sm:text-lg mb-8 sm:mb-10 font-light leading-relaxed">
              {t('heroSub')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="w-full sm:w-auto bg-[#1A3324] text-white hover:bg-[#112218] rounded-full px-8 py-4 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase shadow-[0_10px_20px_rgba(26,51,36,0.15)] hover:shadow-[0_12px_24px_rgba(26,51,36,0.25)] hover:-translate-y-0.5 transition-all duration-300 group">
                {t('exploreMenu')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white" />
              </Link>
              <Link to="/reserve" className="w-full sm:w-auto border-2 border-[#1A3324]/20 hover:border-[#1A3324] text-[#1A3324] hover:bg-[#1A3324]/5 rounded-full px-8 py-4 flex items-center justify-center gap-2.5 text-xs font-bold tracking-widest uppercase hover:-translate-y-0.5 transition-all duration-300">
                <Calendar className="w-4 h-4 text-[#1A3324]" />
                {t('reserveTable')}
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-8 lg:mt-0"
          >
            {/* Botanical background decoration - hidden on mobile to prevent overlap */}
            <div className="hidden lg:block absolute -top-40 -right-8 w-80 h-80 pointer-events-none z-0 select-none">
              <img 
                src={botanicalStrip} 
                alt="Botanical decoration" 
                className="w-full h-full object-contain object-right-top opacity-30"
              />
            </div>
            
            {/* Hero Image Container */}
            <div className="rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-[1.1] border border-[#D4AF37]/15 relative z-10 mx-auto max-w-lg lg:max-w-none">
              <img 
                src="/hero-coffee.png" 
                alt="Espresso pouring" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ================================
// DECORATIVE BOTANICAL STRIP
// ================================
function BotanicalStrip() {
  return (
    <div className="h-20 w-full relative border-t border-[#3C2415]/10 overflow-hidden bg-[#FDFBF7]">
      <img 
        src={botanicalStrip} 
        alt="Coffee pattern" 
        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105 block" 
      />
    </div>
  );
}

// ================================
// BRAND STATEMENT BAND
// ================================
function BrandStatement() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="bg-[#3C2415] py-14 relative text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="container-custom flex flex-col items-center"
      >
        <HeartLogo className="w-16 h-16 mb-6" />
        <h2 className="font-display text-3xl md:text-4xl text-[#F5F3E9] font-medium leading-relaxed mb-4">
          Brewing Connections, Serving Memories.
        </h2>
        <p className="text-[#F5F3E9]/60 italic mb-10 max-w-xl font-light">
          Experience the warmth of Maharashtrian hospitality blended with the finest specialty coffees and traditional delicacies.
        </p>
        <Link to="/products" className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#3C2415] rounded-full px-8 py-3.5 uppercase tracking-widest text-xs font-bold transition-all duration-300 transform hover:-translate-y-0.5">
          Explore Our Menu
        </Link>
      </motion.div>
    </section>
  );
}

function FeaturedDishesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="bg-[#F5F3E9] py-12 md:py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mb-3">Signature Selections</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1A3324] mb-4">Featured Dishes</h2>
          <p className="text-[#3C2415]/70 max-w-2xl mx-auto font-light">
            Savor our chef-curated favorites, where regional inspiration meets premium presentation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_DISHES.map((dish, index) => (
            <motion.div
              key={dish.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-[32px] shadow-xl bg-white border border-[#3C2415]/10"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A3324]/90 via-[#1A3324]/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37] mb-3">{dish.category}</p>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">{dish.title}</h3>
                  <p className="text-sm text-[#F5F3E9]/85 leading-relaxed">{dish.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


const BESTSELLERS = [
  { id: '1', name: 'Cold Brew Rose Reserve', price: 240, rating: 4.9, shortDesc: 'Signature slow-steeped cold brew infused with organic rose water and botanical sweetness.', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=3840&q=100' },
  { id: '2', name: 'Saffron Pistachio Affogato', price: 280, rating: 5.0, shortDesc: 'Premium vanilla bean gelato drowned in double espresso shot, topped with saffron threads and crushed pistachios.', image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=3840&q=100' },
  { id: '3', name: 'Gold Leaf Cortado', price: 220, rating: 4.8, shortDesc: 'Rich double espresso cut with velvety steamed milk and decorated with edible 24K gold leaf.', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=3840&q=100' },
  { id: '4', name: 'Smoked Cinnamon Mocha', price: 260, rating: 4.9, shortDesc: 'Artisanal dark chocolate mocha infused with Applewood cold smoke and a touch of Ceylon cinnamon.', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=3840&q=100' },
];

function BestsellersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { setCart, openCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const addToCartMutation = useMutation({
    mutationFn: (product: any) => api.post('/cart/add', { productId: product.id, quantity: 1 }),
    onSuccess: (res, product) => {
      setCart(res.data.data.cart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      openCart();
      toast.success(`${product.name} added to cart! 🛒`);
    },
    onError: () => toast.error('Failed to add to cart'),
  });

  const toggleLike = (id: string, name: string) => {
    setLiked((prev) => {
      const isLiked = !prev[id];
      if (isLiked) {
        toast.success(`${name} added to wishlist! ❤️`);
      } else {
        toast.success(`${name} removed from wishlist.`);
      }
      return { ...prev, [id]: isLiked };
    });
  };

  const handleAddToCart = (product: any) => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    addToCartMutation.mutate(product);
  };

  return (
    <section ref={ref} className="bg-[#F5F3E9] py-12 md:py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <p className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mb-3">Fresh from the roast</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1A3324] mb-6">Bestsellers</h2>
          <p className="text-[#3C2415]/70 max-w-2xl mx-auto font-light">
            Discover the favorites that keep our customers coming back for more. Handcrafted perfection in every cup.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BESTSELLERS.map((product, i) => {
            const isLiked = liked[product.id];
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col relative"
              >
                {/* Badges */}
                <div className="absolute top-7 left-7 z-10 bg-[#D4AF37] text-[#3C2415] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider shadow-sm">
                  BESTSELLER
                </div>
                <button 
                  onClick={() => toggleLike(product.id, product.name)}
                  className="absolute top-7 right-7 z-10 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm transition-all hover:scale-110 active:scale-95 text-[#1A3324] hover:text-red-500 cursor-pointer"
                >
                  <Heart className={`w-3.5 h-3.5 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-[#1A3324]'}`} />
                </button>

                <div className="relative rounded-2xl overflow-hidden mb-4 aspect-square">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                
                <h3 className="font-display font-bold text-lg text-[#1A3324] mb-2">{product.name}</h3>
                <p className="text-[#3C2415]/60 text-sm mb-4 leading-relaxed flex-1 line-clamp-2">{product.shortDesc}</p>
                
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                    <span className="text-sm font-bold text-[#3C2415]">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-[#1A3324]">₹{product.price}</span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-9 h-9 bg-[#1A3324] hover:bg-[#112419] text-white rounded-full flex items-center justify-center transition-colors shadow-md cursor-pointer"
                      aria-label="Add to Cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



function StorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="about" ref={ref} className="bg-[#1A3324] py-12 md:py-16 overflow-hidden relative">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-[32px] overflow-hidden aspect-[4/5] md:aspect-square lg:aspect-[4/5] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=3840&q=100"
                alt="Cafe Interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 w-2/3 aspect-square rounded-[32px] border-8 border-[#1A3324] overflow-hidden shadow-2xl hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=3840&q=100"
                alt="Latte Art"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:pl-12"
          >
            <p className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mb-4">Our Story</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
              Where Every Cup <br />
              <span className="text-[#D4AF37] italic font-light">Tells a Story</span>
            </h2>
            <p className="text-[#F5F3E9]/80 leading-relaxed mb-8 text-lg font-light">
              Rooted in the rich cultural heritage of Maharashtra, Akole Cafe brings you the
              perfect fusion of premium specialty coffee and authentic Maharashtrian delicacies. 
              From freshly ground espressos to legendary local favorites like Misal Pav and Ukadiche Modak, 
              we craft each recipe to honor our regional flavors.
            </p>
            <p className="text-[#F5F3E9]/80 leading-relaxed mb-10 text-lg font-light">
              Come and experience the warmth, the aroma, and the perfect blend of tradition and modernity
              that will make you feel right at home. Your perfect cup and traditional bite await.
            </p>
            <Link to="/about" className="text-[#D4AF37] hover:text-[#e0c25a] font-medium uppercase tracking-widest text-xs flex items-center gap-3 transition-colors w-fit group border-b border-transparent hover:border-[#D4AF37] pb-1">
              Read Our Full Story
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}



function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="bg-[#FDFBF7] py-12 md:py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <p className="text-[#D4AF37]/80 font-semibold tracking-widest uppercase text-xs mb-3">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[#3C2415] mb-6">What Our Guests Say</h2>
          <p className="text-[#3C2415]/70 max-w-2xl mx-auto font-light">
            Words from the community that makes Akole Café what it is.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Priya Sharma", role: "Food Blogger",
              text: "Akole Café redefines the coffee experience in India. The ambiance, the quality of their brews, and the attention to detail is simply unmatched."
            },
            {
              name: "Arjun Mehta", role: "Entrepreneur",
              text: "My go-to spot for meetings and creative work. The Cold Brew Reserve is the best I've had anywhere, and the space is designed to inspire."
            },
            {
              name: "Sarah Chen", role: "Travel Writer",
              text: "I've visited cafés across 30 countries, and Akole stands among the best. Their commitment to sourcing and craft is evident in every sip."
            }
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              className="bg-white p-8 rounded-2xl border border-[#3C2415]/5 shadow-sm hover:shadow-md transition-shadow duration-300 relative"
            >
              <span className="font-serif text-5xl text-[#D4AF37]/30 absolute top-6 left-8 select-none font-semibold">“</span>
              <div className="relative z-10 pt-4">
                <div className="flex gap-1 mb-6 mt-4">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />)}
                </div>
                <p className="text-base text-[#3C2415]/80 mb-8 font-light leading-relaxed">
                  {testimonial.text}
                </p>
                <div>
                  <p className="font-bold text-[#3C2415] text-sm">{testimonial.name}</p>
                  <p className="text-xs text-[#3C2415]/60 mt-1">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ================================
// LOYALTY SECTION
// ================================
function LoyaltySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="bg-[#F5F3E9] pb-16 relative overflow-hidden">
      <div className="container-custom">
        <div className="bg-[#F8F6F0] rounded-[40px] shadow-sm py-10 px-6 md:px-12 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16 flex flex-col items-center relative z-10"
          >
            <p className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mb-3">Rewards Program</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#1A3324]">The Akole <span className="italic font-light text-[#D4AF37]">Loyalty Club</span></h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-5xl mx-auto relative z-10">
            {[
              { title: "Earn Points", desc: "Every purchase earns you rewards points", icon: Gift },
              { title: "Exclusive Perks", desc: "Birthday treats and member-only offers", icon: Award },
              { title: "VIP Access", desc: "Priority reservations and event invites", icon: Crown },
              { title: "Free Upgrades", desc: "Complimentary size upgrades on milestones", icon: Sparkles }
            ].map((perk, i) => {
              const Icon = perk.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 bg-[#1A3324] text-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-[#1A3324] mb-2 text-sm">{perk.title}</h4>
                  <p className="text-xs text-[#3C2415]/70 font-light px-2 leading-relaxed">{perk.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center relative z-10">
            <Link to="/register" className="bg-[#1A3324] hover:bg-[#112419] text-white px-10 py-3.5 rounded-full font-bold text-xs tracking-widest uppercase shadow-xl transition-all hover:scale-[1.01] inline-block">
              JOIN NOW — IT'S FREE
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ================================
// INSTAGRAM FEED
// ================================
const IG_IMAGES = [
  'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=3840&q=100',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=3840&q=100',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=3840&q=100',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=3840&q=100',
  'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=3840&q=100',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=3840&q=100',
];

function InstagramFeed() {
  return (
    <section className="bg-[#F5F3E9] pt-4 pb-10">
      <div className="container-custom">
        <div className="text-center mb-10">
          <p className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mb-2">Follow Us</p>
          <a href="#" className="inline-block text-3xl font-display font-bold text-[#1A3324] hover:text-[#112419] transition-colors italic">
            @akolecafe
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
        {IG_IMAGES.map((img, i) => (
          <a key={i} href="#" className="group relative aspect-square overflow-hidden block">
            <img src={img} alt={`Instagram post ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-[#1A3324]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ================================
// HOME PAGE
// ================================
export default function HomePage() {
  return (
    <div className="bg-[#F5F3E9]">
      <title>Akole Cafe — Brewing Connections, Serving Memories</title>
      <HeroSection />
      <BotanicalStrip />
      <BrandStatement />
      <FeaturedDishesSection />
      <BestsellersSection />
      <StorySection />
      <TestimonialsSection />
      <LoyaltySection />
      <InstagramFeed />
    </div>
  );
}
