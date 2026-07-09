import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartSidebar from '@/components/cart/CartSidebar';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-espresso-950">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartSidebar />
    </div>
  );
}
