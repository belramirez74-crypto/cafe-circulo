import { Coffee, Image } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ReservaSection({ settings }) {
  const { lang, t } = useLanguage();
  const st = (key, sKey) => lang === 'en' ? t(key) : (settings?.[sKey] || t(key));
  return (
    <section className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-cafe-text mb-4">{st('reserva_title', 'reserva_heading')}</h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mb-8" />
        <p className="text-cafe-muted max-w-xl mx-auto mb-8">
          {st('reserva_desc', 'reserva_description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={settings?.reserva_whatsapp_url || 'https://wa.me/5493541530797'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-cafe-accent text-white font-display tracking-wider hover:bg-cafe-burgundy-light transition-colors animate-glow-pulse rounded-full shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40"
          >
            <Coffee className="w-4 h-4" /> {t('reserva_whatsapp')}
          </a>
          <a
            href={settings?.reserva_instagram_url || 'https://www.instagram.com/circuloescafe'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-cafe-accent text-white font-display tracking-wider hover:bg-cafe-burgundy-light transition-colors animate-glow-pulse rounded-full shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40"
          >
            <Image className="w-4 h-4" /> INSTAGRAM
          </a>
        </div>
      </div>
    </section>
  );
}
