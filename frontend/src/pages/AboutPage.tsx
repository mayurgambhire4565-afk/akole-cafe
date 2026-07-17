import { motion } from 'framer-motion';
import { Award, Star } from 'lucide-react';
import HeartLogo from '@/components/ui/HeartLogo';

export default function AboutPage() {
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
            {[
              { init: 'RK', name: 'Rohan Kulkarni', role: 'Founder & Head Roaster' },
              { init: 'MD', name: 'Meera Desai', role: 'Operations Director' },
              { init: 'AN', name: 'Aditya Naik', role: 'Lead Barista' },
              { init: 'SP', name: 'Sneha Patil', role: 'Experience Lead' }
            ].map((member, i) => (
              <div key={i} className="bg-white dark:bg-[#112017] rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-[#3C2415]/5 dark:border-white/5 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-[#3C2415] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#3C2415] flex items-center justify-center text-xl font-bold font-display mb-4">
                  {member.init}
                </div>
                <h4 className="font-bold text-[#1A3324] dark:text-[#FDFBF7] text-sm md:text-base mb-1">{member.name}</h4>
                <p className="text-[#3C2415]/60 dark:text-cream-200/60 text-xs font-light">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
