import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const GALLERY_IMAGES = [
  {
    src: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Espresso pour',
    category: 'Coffee',
  },
  {
    src: 'https://images.pexels.com/photos/1187317/pexels-photo-1187317.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Cafe Interior',
    category: 'Interior',
  },
  {
    src: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Latte art',
    category: 'Coffee',
  },
  {
    src: 'https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Coffee beans',
    category: 'Coffee',
  },
  {
    src: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Sandwich',
    category: 'Food',
  },
  {
    src: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Cafe table setup',
    category: 'Interior',
  },
  {
    src: 'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Cappuccino',
    category: 'Coffee',
  },
  {
    src: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Food plating',
    category: 'Food',
  },
  {
    src: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Ice cream dessert',
    category: 'Dessert',
  },
  {
    src: 'https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Coffee shop ambience',
    category: 'Interior',
  },
  {
    src: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Pastry platter',
    category: 'Food',
  },
  {
    src: 'https://images.pexels.com/photos/4450342/pexels-photo-4450342.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Barista at work',
    category: 'Coffee',
  },
];

const CATEGORIES = ['All', 'Coffee', 'Food', 'Dessert', 'Interior'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const filtered = activeCategory === 'All'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === activeCategory);

  return (
    <div className="bg-[#F5F3E9] min-h-screen pt-24 pb-20">
      <div className="container-custom max-w-7xl">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mb-4">Our Aesthetic</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#1A3324] leading-tight mb-6">
            The <span className="text-[#D4AF37] italic font-light">Gallery</span>
          </h1>
          <p className="text-[#3C2415]/70 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Take a visual journey through Akole Cafe — beautifully crafted beverages, culinary delights, and luxury interior design.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex justify-center gap-2 flex-wrap mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[#1A3324] text-[#D4AF37] shadow-md'
                  : 'bg-white text-[#3C2415]/70 hover:bg-[#1A3324]/5 border border-[#3C2415]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div
                key={img.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden group shadow-sm cursor-pointer"
                onClick={() => setLightboxImg(img.src)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A3324]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-1">{img.category}</p>
                      <p className="text-white text-sm font-light">{img.alt}</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Count */}
        <p className="text-center text-[#3C2415]/50 text-xs mt-8 uppercase tracking-wider">
          Showing {filtered.length} of {GALLERY_IMAGES.length} photos
        </p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxImg(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              onClick={() => setLightboxImg(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightboxImg}
              alt="Gallery"
              className="max-w-full max-h-[88vh] rounded-2xl shadow-2xl object-contain"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
