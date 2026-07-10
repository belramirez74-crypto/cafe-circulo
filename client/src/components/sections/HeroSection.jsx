import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';

export default function HeroSection({ settings }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cafe-burgundy/20 via-cafe-bg/50 to-cafe-bg" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url('${settings?.hero_bg_image || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&q=80'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(20%) brightness(0.4) saturate(1.2)'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-cafe-burgundy/10 to-transparent" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl pt-24 pb-12">
        {settings?.hero_subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-cafe-cream text-sm sm:text-base mb-3 tracking-widest uppercase"
          >
            {settings.hero_subtitle}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl sm:text-7xl text-cafe-text mb-4 tracking-tight leading-none"
        >
          {settings?.hero_title_line1 || 'CAFÉ'}
          <br />
          <span className="font-script text-cafe-accent text-5xl sm:text-7xl inline-block" style={{ fontWeight: 600 }}>
            {settings?.hero_title_line2 || 'Círculo'}
          </span>
        </motion.h1>
        {settings?.hero_description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-cafe-muted text-sm sm:text-base mb-8 max-w-xl mx-auto"
          >
            {settings.hero_description}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap items-center gap-x-2 justify-center mb-8 text-xs sm:text-sm text-cafe-cream/70"
        >
          <Clock className="w-3.5 h-3.5 text-cafe-accent shrink-0" />
          <span className="tracking-wide">{settings?.hours_weekdays || 'Lun - Vie: 8:00 - 20:30'}</span>
          <span className="text-cafe-muted-dark mx-1">·</span>
          <span className="tracking-wide">{settings?.hours_weekends || 'Sáb - Dom: 9:00 - 20:30'}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors animate-glow-pulse rounded-full"
          >
            {settings?.hero_button_text || 'VER MENÚ'} <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
