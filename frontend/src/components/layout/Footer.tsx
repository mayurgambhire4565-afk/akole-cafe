import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-[#1A3324] border-t border-[#D4AF37]/10 text-[#F5F3E9]/80 font-sans">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Brand Column (spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="group inline-block">
              <Logo size={48} showText={true} textColor="text-cream-50" />
            </Link>
            <p className="text-[#F5F3E9]/75 text-sm leading-relaxed max-w-sm font-light">
              Brewing Connections, Serving Memories. A premium café experience crafted for those who appreciate the art of coffee.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                {
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  ),
                  href: 'https://instagram.com',
                  label: 'Instagram'
                },
                {
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                  href: 'https://facebook.com',
                  label: 'Facebook'
                },
                {
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                    </svg>
                  ),
                  href: 'https://twitter.com',
                  label: 'Twitter'
                },
                {
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                    </svg>
                  ),
                  href: 'https://wa.me/918432387067',
                  label: 'WhatsApp'
                }
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#F5F3E9]/70 hover:text-[#D4AF37] hover:bg-white/5 transition-all border border-[#F5F3E9]/20 hover:border-[#D4AF37]/45"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore Column */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Explore</h3>
            <ul className="space-y-3">
              {[
                { label: 'Menu', to: '/products' },
                { label: 'Reserve a Table', to: '/reserve' },
                { label: 'Events', to: '/events' },
                { label: 'Gallery', to: '/gallery' }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[#F5F3E9]/75 text-sm hover:text-[#D4AF37] transition-colors font-sans font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Company</h3>
            <ul className="space-y-3">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Franchise', to: '/franchise' },
                { label: 'Blog', to: '/blogs' },
                { label: 'Contact', to: '/contact' }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[#F5F3E9]/75 text-sm hover:text-[#D4AF37] transition-colors font-sans font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit Us & Hours Column */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Visit Us</h3>
              <ul className="space-y-3.5 text-sm text-[#F5F3E9]/75 font-light">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>123 Brew Street, Café District, Mumbai 400001</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>+91 84323 87067</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>hello@akolecafe.com</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Hours</h4>
              <ul className="text-xs text-[#F5F3E9]/70 space-y-1.5 font-light">
                <li>Mon – Fri: 7:00 AM – 11:00 PM</li>
                <li>Sat – Sun: 8:00 AM – 12:00 AM</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-[#F5F3E9]/10 my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[#F5F3E9]/60 text-xs font-light">
          <p>© 2026 Akole Café. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
