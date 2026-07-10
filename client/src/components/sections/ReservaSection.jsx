import { Coffee, Image } from 'lucide-react';

export default function ReservaSection({ settings }) {
  return (
    <section className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-cafe-text mb-4">{settings?.reserva_heading || 'RESERVA'}</h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mb-8" />
        <p className="text-cafe-muted max-w-xl mx-auto mb-8">
          {settings?.reserva_description || 'Contactanos para reservar tu lugar y disfrutar de una experiencia única.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={settings?.reserva_whatsapp_url || 'https://wa.me/5493541530797'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-cafe-accent text-white font-display tracking-wider hover:bg-cafe-burgundy-light transition-colors animate-glow-pulse rounded-full"
          >
            <Coffee className="w-4 h-4" /> RESERVAR POR WHATSAPP
          </a>
          <a
            href={settings?.reserva_instagram_url || 'https://instagram.com/cafecirculo'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-cafe-accent text-white font-display tracking-wider hover:bg-cafe-burgundy-light transition-colors animate-glow-pulse rounded-full"
          >
            <Image className="w-4 h-4" /> INSTAGRAM
          </a>
        </div>
      </div>
    </section>
  );
}
