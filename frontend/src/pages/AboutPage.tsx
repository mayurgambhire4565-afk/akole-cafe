import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, X, Sparkles } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter, FaEnvelope } from 'react-icons/fa';
import HeartLogo from '@/components/ui/HeartLogo';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  specialties: string[];
  socials: {
    linkedin?: string;
    instagram?: string;
    github?: string;
    email?: string;
    twitter?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: 'Mayur Gambhire',
    role: 'Director',
    image: '/images/team/mayur_gambhire.png',
    bio: 'A visionary entrepreneur dedicated to creating spaces that foster warmth, conversation, and premium hospitality. Mayur spearheads the brand strategy, expansion, and high-level operations of Akole Café, establishing a benchmark of quality and innovation.',
    specialties: ['Strategic Leadership', 'Brand Expansion', 'Hospitality Management'],
    socials: {
      linkedin: 'https://www.linkedin.com/in/mayur-gambhire-854551379',
      instagram: 'https://instagram.com',
      email: 'mayur@akolecafe.com',
      twitter: 'https://x.com/MayurGambhire17'
    }
  },
  {
    name: 'Rutik Choudhary',
    role: 'Co-Founder',
    image: '/images/team/rutik_choudhary.png',
    bio: 'Bringing a keen eye for aesthetics and design, Rutik focuses on the visual identity, digital presence, and operational excellence of Akole Café. He believes that the atmosphere is just as important as the brew in making a visit unforgettable.',
    specialties: ['Brand Identity & Design', 'Operational Synergy', 'Public Relations'],
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
      github: 'https://github.com',
      email: 'rutik@akolecafe.com'
    }
  },
  {
    name: 'Yuvraj Jadhav',
    role: 'Operations Head',
    image: '/images/team/yuvraj_jadhav.png',
    bio: 'A master of efficiency and quality control, Yuvraj leads the daily operations, supplier partnerships, and barista training. He ensures that every single cup served matches the high quality standard that Akole Café is known for.',
    specialties: ['Daily Operations', 'Supply Chain Control', 'Quality Assurance & Barista Training'],
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
      email: 'yuvraj@akolecafe.com'
    }
  },
  {
    name: 'Kartik Dukale',
    role: 'Executive Chef',
    image: '/images/team/kartik_dukale.png',
    bio: 'An artist in the kitchen, Kartik crafts our signature menu items, fresh pastries, and culinary pairings. He constantly innovates with local flavors and international trends, ensuring our culinary offerings perfectly complement our premium coffee.',
    specialties: ['Menu Design', 'Pastry & Baking Arts', 'Flavor Balancing'],
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
      email: 'kartik@akolecafe.com'
    }
  }
];

export default function AboutPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMember(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMember]);
  return (
    <div className="bg-[#F5F3E9] dark:bg-[#0B150F] min-h-screen pt-20 pb-24 transition-colors duration-300">

      {/* Hero Section */}
      <div className="w-full h-80 md:h-[400px] lg:h-[500px] relative flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=3840&q=100"
          alt="Cafe Interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4">
          <p className="text-[#D4AF37] font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4">
            ABOUT US
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-light text-white">
            Our <span className="italic font-serif text-[#D4AF37]">Story</span>
          </h1>
          <p className="text-[#D4AF37] font-sans font-medium mt-4 text-lg md:text-2xl tracking-wide max-w-2xl mx-auto drop-shadow-sm">
            हॉटेल क्षेत्रात मराठी माणसाचे पाऊल...
          </p>
        </div>
      </div>

      {/* Intro Section */}
      <div className="container-custom max-w-4xl py-20 text-center">
        <div className="flex justify-center mb-6">
          <HeartLogo className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <p className="text-[#3C2415] dark:text-[#FDFBF7] text-lg md:text-xl font-light leading-relaxed mb-6">
          Akole Café was founded on a simple belief: great coffee brings people together. What started as a small passion project in a corner of Mumbai has grown into a movement — a community of coffee lovers, creatives, and dreamers who share a love for the perfect cup.
        </p>
        <p className="text-[#3C2415]/70 dark:text-cream-200/70 text-base md:text-lg font-light leading-relaxed">
          We source our beans directly from estates in Coorg, Chikmagalur, and select international origins. Every blend is roasted in-house to bring out the unique character of each origin. Our baristas are trained not just in technique, but in the art of creating experiences.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="bg-[#3C2415] dark:bg-[#1A3324] text-[#F5F3E9] py-24 transition-colors">
        <div className="container-custom max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 text-center">
            {/* Mission */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center mb-6">
                <HeartLogo className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="text-[#D4AF37] font-bold tracking-widest uppercase text-xs mb-4">OUR MISSION</h3>
              <p className="font-light text-lg leading-relaxed text-[#F5F3E9]/80">
                To craft exceptional coffee experiences that inspire connection, foster creativity, and celebrate the art of slow living in a fast-paced world.
              </p>
            </div>
            {/* Vision */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center mb-6">
                <HeartLogo className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="text-[#D4AF37] font-bold tracking-widest uppercase text-xs mb-4">OUR VISION</h3>
              <p className="font-light text-lg leading-relaxed text-[#F5F3E9]/80">
                To become India's most beloved café brand — a benchmark for quality, design, and community, inspiring a new generation of coffee culture.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="py-24 bg-[#FDFBF7] dark:bg-[#112017] transition-colors duration-300">
        <div className="container-custom max-w-3xl text-center">
          <p className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-[10px] mb-3">OUR JOURNEY</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-16">
            Milestones
          </h2>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-4 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[#D4AF37]/20">

            {/* 2018 */}
            <div className="relative flex justify-normal group pl-12 md:pl-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#FDFBF7] dark:border-[#112017] bg-[#D4AF37] shadow absolute left-4 md:left-1/2 -translate-x-1/2" />
              <div className="w-full md:w-1/2 pr-0 md:pr-12 text-left md:text-right">
                <h4 className="text-[#D4AF37] font-bold text-sm mb-1">2018</h4>
                <h3 className="text-xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-2">The First Brew</h3>
                <p className="text-[#3C2415]/70 dark:text-cream-200/70 text-sm font-light">Akole Café was born in a small space of 15 seats with just an espresso machine.</p>
              </div>
              <div className="w-1/2 pl-12 text-left hidden md:block"></div>
            </div>

            {/* 2019 */}
            <div className="relative flex justify-normal group pl-12 md:pl-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#FDFBF7] dark:border-[#112017] bg-[#D4AF37] shadow absolute left-4 md:left-1/2 -translate-x-1/2" />
              <div className="w-1/2 pr-12 text-right hidden md:block"></div>
              <div className="w-full md:w-1/2 pl-0 md:pl-12 text-left">
                <h4 className="text-[#D4AF37] font-bold text-sm mb-1">2019</h4>
                <h3 className="text-xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-2">The Roastery</h3>
                <p className="text-[#3C2415]/70 dark:text-cream-200/70 text-sm font-light">We launched our in-house roastery, sourcing single-origin beans from Coorg and Chikmagalur.</p>
              </div>
            </div>

            {/* 2022 */}
            <div className="relative flex justify-normal group pl-12 md:pl-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#FDFBF7] dark:border-[#112017] bg-[#D4AF37] shadow absolute left-4 md:left-1/2 -translate-x-1/2" />
              <div className="w-full md:w-1/2 pr-0 md:pr-12 text-left md:text-right">
                <h4 className="text-[#D4AF37] font-bold text-sm mb-1">2022</h4>
                <h3 className="text-xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-2">Expansion</h3>
                <p className="text-[#3C2415]/70 dark:text-cream-200/70 text-sm font-light">Opened three new locations across Mumbai and Pune, each with a unique design identity.</p>
              </div>
              <div className="w-1/2 pl-12 text-left hidden md:block"></div>
            </div>

            {/* 2023 */}
            <div className="relative flex justify-normal group pl-12 md:pl-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#FDFBF7] dark:border-[#112017] bg-[#D4AF37] shadow absolute left-4 md:left-1/2 -translate-x-1/2" />
              <div className="w-1/2 pr-12 text-right hidden md:block"></div>
              <div className="w-full md:w-1/2 pl-0 md:pl-12 text-left">
                <h4 className="text-[#D4AF37] font-bold text-sm mb-1">2023</h4>
                <h3 className="text-xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-2">National Recognition</h3>
                <p className="text-[#3C2415]/70 dark:text-cream-200/70 text-sm font-light">Named 'Best Specialty Café' at the India Coffee Awards and launched our franchise program.</p>
              </div>
            </div>

            {/* 2024 */}
            <div className="relative flex justify-normal group pl-12 md:pl-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#FDFBF7] dark:border-[#112017] bg-[#D4AF37] shadow absolute left-4 md:left-1/2 -translate-x-1/2" />
              <div className="w-full md:w-1/2 pr-0 md:pr-12 text-left md:text-right">
                <h4 className="text-[#D4AF37] font-bold text-sm mb-1">2024</h4>
                <h3 className="text-xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-2">Going Digital</h3>
                <p className="text-[#3C2415]/70 dark:text-cream-200/70 text-sm font-light">Launched our online ordering platform and loyalty program, serving 50,000+ cups monthly.</p>
              </div>
              <div className="w-1/2 pl-8 md:pl-12 text-left hidden md:block"></div>
            </div>

          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-24 bg-[#F5F3E9] dark:bg-[#0B150F] transition-colors duration-300">
        <div className="container-custom max-w-5xl text-center">
          <p className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-[10px] mb-3">THE TEAM</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-16">
            Meet the People Behind Your Cup
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                onClick={() => setSelectedMember(member)}
                className="bg-white dark:bg-[#112017] rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-[#3C2415]/5 dark:border-white/5 hover:shadow-lg hover:border-[#D4AF37]/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-[#D4AF37] shadow-inner bg-[#3C2415] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-bold text-[#1A3324] dark:text-[#FDFBF7] text-sm md:text-base mb-1 group-hover:text-[#D4AF37] transition-colors duration-300">{member.name}</h4>
                <p className="text-[#3C2415]/60 dark:text-cream-200/60 text-xs font-light mb-2">{member.role}</p>
                <span className="text-[10px] text-[#D4AF37] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-wider uppercase">View Profile &rarr;</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Member Profile Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              className="relative w-full max-w-2xl bg-[#FDFBF7] dark:bg-[#112017] rounded-[2rem] overflow-hidden shadow-2xl border border-[#3C2415]/10 dark:border-white/10 flex flex-col md:flex-row text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 text-white md:bg-[#3C2415]/5 md:hover:bg-[#3C2415]/10 md:dark:bg-white/5 md:dark:hover:bg-white/10 md:text-[#3C2415] md:dark:text-[#FDFBF7] transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Pane - Profile Picture & Title */}
              <div className="w-full md:w-[40%] bg-[#3C2415] dark:bg-[#0B150F] relative flex flex-col items-center justify-center p-8 text-center min-h-[220px] md:min-h-full">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-xl bg-[#3C2415] mb-4">
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-display font-bold text-[#FDFBF7] text-xl mb-1">{selectedMember.name}</h3>
                <p className="text-[#D4AF37] text-xs uppercase tracking-widest font-semibold">{selectedMember.role}</p>
              </div>

              {/* Right Pane - Bio, Specialties & Socials */}
              <div className="w-full md:w-[60%] p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase mb-2">Biography</h4>
                  <p className="text-[#3C2415]/80 dark:text-cream-200/80 text-sm font-light leading-relaxed mb-6 font-sans">
                    {selectedMember.bio}
                  </p>

                  <h4 className="text-[10px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Core Focus & Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedMember.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium tracking-wide uppercase px-3 py-1 bg-[#3C2415]/5 text-[#3C2415]/80 dark:bg-white/5 dark:text-cream-200/80 rounded-full border border-[#3C2415]/10 dark:border-white/10"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#3C2415]/10 dark:border-white/10 pt-6">
                  <h4 className="text-[10px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase mb-3 font-sans">Connect With {selectedMember.name.split(' ')[0]}</h4>
                  <div className="flex items-center gap-3">
                    {selectedMember.socials.linkedin && (
                      <a
                        href={selectedMember.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#3C2415]/5 hover:bg-[#3C2415]/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#3C2415] dark:text-[#FDFBF7] hover:text-[#D4AF37] dark:hover:text-[#D4AF37] hover:-translate-y-0.5 transition-all duration-300 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                        title="LinkedIn"
                      >
                        <FaLinkedin className="w-4 h-4" />
                      </a>
                    )}
                    {selectedMember.socials.instagram && (
                      <a
                        href={selectedMember.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#3C2415]/5 hover:bg-[#3C2415]/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#3C2415] dark:text-[#FDFBF7] hover:text-[#D4AF37] dark:hover:text-[#D4AF37] hover:-translate-y-0.5 transition-all duration-300 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                        title="Instagram"
                      >
                        <FaInstagram className="w-4 h-4" />
                      </a>
                    )}
                    {selectedMember.socials.github && (
                      <a
                        href={selectedMember.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#3C2415]/5 hover:bg-[#3C2415]/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#3C2415] dark:text-[#FDFBF7] hover:text-[#D4AF37] dark:hover:text-[#D4AF37] hover:-translate-y-0.5 transition-all duration-300 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                        title="GitHub"
                      >
                        <FaGithub className="w-4 h-4" />
                      </a>
                    )}
                    {selectedMember.socials.twitter && (
                      <a
                        href={selectedMember.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#3C2415]/5 hover:bg-[#3C2415]/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#3C2415] dark:text-[#FDFBF7] hover:text-[#D4AF37] dark:hover:text-[#D4AF37] hover:-translate-y-0.5 transition-all duration-300 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                        title="Twitter"
                      >
                        <FaTwitter className="w-4 h-4" />
                      </a>
                    )}
                    {selectedMember.socials.email && (
                      <a
                        href={`mailto:${selectedMember.socials.email}`}
                        className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#3C2415]/5 hover:bg-[#3C2415]/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#3C2415] dark:text-[#FDFBF7] hover:text-[#D4AF37] dark:hover:text-[#D4AF37] hover:-translate-y-0.5 transition-all duration-300 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                        title="Email"
                      >
                        <FaEnvelope className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Awards */}
      <div className="py-24 bg-[#FDFBF7] dark:bg-[#112017] transition-colors duration-300">
        <div className="container-custom max-w-6xl text-center">
          <p className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-[10px] mb-3">RECOGNITION</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1A3324] dark:text-[#FDFBF7] mb-16">
            Awards & Achievements
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { title: 'Best Specialty Café 2023', org: 'India Coffee Awards' },
              { title: 'Design Excellence', org: 'Hospitality Design Awards' },
              { title: 'Top 10 Cafés in India', org: 'Conde Nast Traveller' },
              { title: 'Sustainability Champion', org: 'Green Business Awards' }
            ].map((award, i) => (
              <div key={i} className="glass-card p-6 flex flex-col items-center justify-center text-center hover:border-[#D4AF37]/50 transition-all duration-300">
                <Award className="w-8 h-8 text-[#D4AF37] mb-4" />
                <h4 className="font-bold text-[#1A3324] dark:text-[#FDFBF7] text-sm mb-1">{award.title}</h4>
                <p className="text-[#3C2415]/50 dark:text-cream-200/50 text-xs font-light">{award.org}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
