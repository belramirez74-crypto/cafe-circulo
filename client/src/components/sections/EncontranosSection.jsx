import { MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function EncontranosSection({ settings }) {
  const { lang, t } = useLanguage();
  const st = (key, sKey) => lang === 'en' ? t(key) : (settings?.[sKey] || t(key));
  return (
    <section className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-script text-cafe-cream text-3xl sm:text-4xl mb-2">{st('encontranos_subtitle', 'encontranos_subtitle')}</p>
          <h2 className="font-display text-4xl sm:text-5xl text-cafe-text">{st('encontranos_title', 'encontranos_heading')}</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-cafe-accent shrink-0 mt-1" />
            <div>
              <h3 className="font-display text-xl text-cafe-text mb-2">{st('encontranos_location', 'ubicacion_heading')}</h3>
              <p className="text-cafe-muted">{st('encontranos_city', 'location_line1')}</p>
              <p className="text-cafe-muted">{st('encontranos_country', 'location_line2')}</p>
            </div>
          </div>
          <div className="aspect-[16/9] rounded-xl overflow-hidden border border-cafe-border/60 bg-cafe-card">
            <iframe
              src={settings?.maps_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217847.3641164673!2d-64.37866564765623!3d-31.398478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942d7bca9b3a6c4f%3A0x9b0f5e5e5e5e5e5e!2sVilla%20Allende%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1'}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Café Círculo"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
