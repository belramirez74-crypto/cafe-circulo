import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function HeroSection({ settings }) {
  const { light } = useTheme();
  const { lang, t } = useLanguage();
  const h = light ? 'text-white' : 'text-[#0D0804]';
  const hd = light ? 'text-white/80' : 'text-cafe-muted';
  const hr = light ? 'text-white/70' : 'text-cafe-cream/70';
  const dot = light ? 'text-white/40' : 'text-cafe-muted-dark';
  const st = (key, sKey) => lang === 'en' ? t(key) : (settings?.[sKey] || t(key));

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cafe-burgundy/20 via-cafe-bg/50 to-cafe-bg" />
        {settings?.hero_bg_image ? (
          <img
            src={settings.hero_bg_image}
            alt=""
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'grayscale(20%) brightness(0.4) saturate(1.2)' }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-cafe-burgundy/10 to-transparent" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl pt-24 pb-12">
        {settings?.hero_subtitle && (
          <p
            className={`animate-fade-in-down font-display text-[#5c1514] text-lg sm:text-xl mb-3 tracking-widest uppercase font-semibold ${light ? 'drop-shadow-[0_0_18px_rgba(255,255,255,0.6)]' : 'drop-shadow-[0_0_18px_rgba(0,0,0,1)]'}`}
          >
            {settings.hero_subtitle}
          </p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`font-display text-5xl sm:text-7xl ${h} mb-4 tracking-tight leading-none`}
        >
          <span className="animate-fade-in-up-big inline-block">{st('hero_title_line1', 'hero_title_line1')}</span>
          <br />
          <span className="font-script text-[#5c1514] text-6xl sm:text-8xl inline-block drop-shadow-[0_6px_30px_rgba(92,21,20,1)] animate-fade-in-up" style={{ fontWeight: 600 }}>
            {st('hero_title_line2', 'hero_title_line2')}
          </span>
        </motion.h1>
        {settings?.hero_description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${hd} text-sm sm:text-base mb-8 max-w-xl mx-auto`}
          >
            {settings.hero_description}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className={`flex flex-wrap items-center gap-x-2 justify-center mb-8 text-sm sm:text-base ${hr}`}
        >
          <Clock className="w-3.5 h-3.5 text-cafe-accent shrink-0" />
          <span className="tracking-wide">{st('hero_hours_weekdays', 'hours_weekdays')}</span>
          <span className={`${dot} mx-1`}>·</span>
          <span className="tracking-wide">{st('hero_hours_weekends', 'hours_weekends')}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#5c1514] text-white font-display text-sm tracking-wider hover:bg-[#731c1a] transition-colors animate-glow-pulse rounded-full shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40"
          >
            {st('hero_button', 'hero_button_text')} <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
