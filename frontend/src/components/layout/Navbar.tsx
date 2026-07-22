import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Heart, User, Menu, X, Search,
  LogOut, Settings, Package, ChevronDown, Crown, BookOpen, Store,
  Sun, Moon, MapPin,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useThemeStore } from '@/store/themeStore';
import api from '@/api/axios';
import toast from 'react-hot-toast';
import Logo from '@/components/ui/Logo';
import HeartLogo from '@/components/ui/HeartLogo';
import LocationModal from './LocationModal';
import { useTranslation } from '@/store/languageStore';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/products' },
  { label: 'About', to: '/about' },
  { label: 'Reserve', to: '/reserve' },
  { label: 'Events', to: '/events' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user, logout } = useAuthStore();
  const { itemCount, toggleCart, openCart } = useCartStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isTransparentHome = false;

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch { /* ignore */ }
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const handleNavLinkClick = (to: string) => {
    setIsMobileOpen(false);
    if (location.pathname === to) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const navBg = isTransparentHome
    ? 'bg-transparent'
    : isScrolled
      ? 'bg-[#F4EFE6]/45 dark:bg-[#0B150F]/45 border-b border-white/35 dark:border-white/15 shadow-[0_12px_40px_0_rgba(0,0,0,0.1)] backdrop-blur-3xl'
      : 'bg-[#FDFBF7]/55 dark:bg-[#0B150F]/55 border-b border-white/25 dark:border-white/10 shadow-sm backdrop-blur-2xl';

  const logoColor = isTransparentHome
    ? 'text-cream-50'
    : 'text-[#1A3121] dark:text-cream-50';

  const buttonColorClass = isTransparentHome
    ? 'text-cream-300 hover:text-[#D4AF37] hover:bg-white/5'
    : 'text-coffee-700 dark:text-cream-300 hover:text-forest-500 hover:bg-forest-500/5 dark:hover:bg-white/5';

  const activeLinkClass = isTransparentHome
    ? 'text-[#D4AF37]'
    : 'text-forest-500 dark:text-[#D4A017]';
  
  const inactiveLinkClass = isTransparentHome
    ? 'text-cream-200 hover:text-[#D4AF37]'
    : 'text-coffee-700 dark:text-cream-200 hover:text-forest-500 dark:hover:text-[#D4A017]';

  const activeUnderlineClass = isTransparentHome
    ? 'bg-[#D4AF37]'
    : 'bg-forest-500 dark:bg-[#D4A017]';

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="w-full max-w-[98%] mx-auto px-2 md:px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="group flex-shrink-0">
              <Logo size={52} showText={true} textColor={logoColor} />
            </Link>

            {/* Desktop Nav & Actions wrapper */}
            <div className="hidden md:flex items-center ml-auto h-full gap-4 lg:gap-8">
              {/* Desktop Nav */}
              <nav className="flex items-center gap-0.5 lg:gap-1.5 h-full">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => handleNavLinkClick(link.to)}
                  className={({ isActive }) =>
                    `relative px-2 py-4 lg:px-3 text-[11px] lg:text-xs font-sans font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex items-center ${
                      isActive ? activeLinkClass : inactiveLinkClass
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {t(link.label.toLowerCase() as any)}
                      {isActive && (
                        <motion.span
                          layoutId="activeNavUnderline"
                          className={`absolute bottom-0 left-2.5 right-2.5 h-0.5 rounded-full ${activeUnderlineClass}`}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

              {/* Desktop Actions */}
              <div className="flex items-center gap-2">
              <Link
                to="/products"
                className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#3D2015] font-bold text-xs uppercase tracking-wider px-5 h-9 rounded-full mr-1.5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap flex-shrink-0 border border-gold-400/20 flex items-center justify-center"
              >
                {t('orderNow')}
              </Link>

              <div className="relative flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.form
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (searchQuery.trim()) {
                          navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }
                      }}
                      className="absolute right-0 top-full mt-3 w-64 p-2 rounded-[10px] shadow-xl z-50 bg-[#1A0F0A]/98 border border-gold-500/20 backdrop-blur-md"
                    >
                      <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-gold-500/40 bg-[#25150F] text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 placeholder-cream-300/60"
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    setSearchQuery('');
                  }}
                  className={`p-2.5 rounded-xl transition-all relative ${buttonColorClass}`}
                  aria-label="Search"
                >
                  {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                </button>
              </div>

              <button
                onClick={() => setIsLocationOpen(true)}
                className={`p-2.5 rounded-xl transition-all relative ${buttonColorClass}`}
                aria-label="Location"
              >
                <MapPin className="w-5 h-5" />
              </button>

              <button
                onClick={() => isAuthenticated ? openCart() : toggleCart()}
                className={`p-2.5 rounded-xl transition-all relative ${buttonColorClass}`}
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gold-500 text-espresso-950 text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all relative ${buttonColorClass}`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5 text-gold-400" /> : <Moon className="w-5 h-5" />}
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gold-400 text-sm font-semibold">{user?.name?.[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''} ${isTransparentHome ? 'text-gold-400 hover:text-gold-300' : 'text-coffee-700 dark:text-cream-300'}`} />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 8, scale: 0.95, filter: 'blur(4px)' }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-3 w-64 rounded-2xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] z-50 backdrop-blur-xl border border-white/10"
                        style={{ background: 'linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(15,15,15,0.98) 100%)' }}
                        onMouseLeave={() => setIsUserMenuOpen(false)}
                      >
                        {/* Header Section */}
                        <div className="relative px-5 py-4 overflow-hidden border-b border-white/5 bg-gradient-to-br from-[#D4AF37]/10 to-transparent">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
                          <div className="relative z-10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FDFBF7] p-[2px]">
                              <div className="w-full h-full rounded-full bg-[#1A0F0A] flex items-center justify-center overflow-hidden">
                                {user?.avatar ? (
                                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[#D4AF37] font-bold text-lg">{user?.name?.[0]?.toUpperCase()}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                              <p className="text-white/50 text-xs truncate">{user?.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Links Section */}
                        <div className="py-2 px-2 space-y-1">
                          {user && ['ADMIN', 'SUPER_ADMIN'].includes(user.role) && (/mayur|yuvraj|ritik|kartik/i.test(user.name) || /mayur|yuvraj|ritik|kartik/i.test(user.email)) && (
                            <Link
                              to="/admin"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#D4AF37] font-bold bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 transition-all duration-300 relative overflow-hidden my-1"
                            >
                              <Crown className="w-4 h-4 text-[#D4AF37]" />
                              <span className="text-sm font-bold text-[#D4AF37]">Admin Portal 👑</span>
                            </Link>
                          )}
                          {[
                            { icon: User, label: 'Dashboard', to: '/dashboard' },
                            { icon: Package, label: 'My Orders', to: '/dashboard/orders' },
                            { icon: Heart, label: 'Wishlist', to: '/dashboard/wishlist' },
                            { icon: BookOpen, label: 'Blog', to: '/blogs' },
                            { icon: Store, label: 'Franchise', to: '/franchise' },
                            { icon: Settings, label: 'Settings', to: '/dashboard/profile' },
                          ].map(({ icon: Icon, label, to }) => (
                            <Link
                              key={to}
                              to={to}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <Icon className="w-4 h-4 text-white/40 group-hover:text-[#D4AF37] transition-colors relative z-10" />
                              <span className="text-sm font-medium group-hover:translate-x-1 transition-transform duration-300 relative z-10">{label}</span>
                            </Link>
                          ))}
                        </div>

                        {/* Footer Section */}
                        <div className="p-2 border-t border-white/5 bg-black/20">
                          <button
                            onClick={handleLogout}
                            className="group w-full flex items-center px-3 py-2.5 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                          >
                            <span className="text-sm font-medium group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-3">
                               <LogOut className="w-4 h-4" /> Logout
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/register"
                  className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors rounded-xl ${
                    isTransparentHome
                      ? 'text-cream-200 hover:text-[#D4AF37] hover:bg-white/5'
                      : 'text-coffee-700 dark:text-cream-200 hover:text-forest-500 dark:hover:text-[#D4AF37] hover:bg-forest-500/5 dark:hover:bg-white/5'
                  }`}
                >
                  Sign Up
                </Link>
              )}
            </div>
          </div>

            {/* Mobile Actions & Menu Buttons */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsLocationOpen(true)}
                className={`p-2 rounded-xl transition-all relative ${buttonColorClass}`}
                aria-label="Location"
              >
                <MapPin className="w-5 h-5" />
              </button>

              <button
                onClick={() => isAuthenticated ? openCart() : toggleCart()}
                className={`p-2 rounded-xl transition-all relative ${buttonColorClass}`}
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-espresso-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all relative ${buttonColorClass}`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5 text-gold-400" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                className={`p-2 rounded-xl transition-all ${buttonColorClass}`}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-gold-500/10"
              style={{ background: 'rgba(13,7,5,0.98)', backdropFilter: 'blur(12px)' }}
            >
              <div className="w-full px-3 sm:px-4 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => handleNavLinkClick(link.to)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive ? 'text-gold-500 bg-gold-500/10' : 'text-cream-200'
                      }`
                    }
                  >
                    {t(link.label.toLowerCase() as any)}
                  </NavLink>
                ))}
                <div className="flex gap-2 pt-2 border-t border-gold-500/10">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex-1 btn btn-outline btn-sm"
                      >
                        {t('dashboard')}
                      </Link>
                      <button onClick={handleLogout} className="flex-1 btn btn-danger btn-sm">
                        {t('logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsMobileOpen(false)} className="flex-1 btn btn-outline btn-sm">
                        {t('login')}
                      </Link>
                      <Link to="/register" onClick={() => setIsMobileOpen(false)} className="flex-1 btn btn-primary btn-sm">
                        {t('signUp')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content jump */}
      <div className="h-16 md:h-20" />

      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </>
  );
}
