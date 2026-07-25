import { Clock, Music, Coffee } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function SobreNosotrosSection({ settings }) {
  const { lang, t } = useLanguage();
  const st = (key, sKey) => lang === 'en' ? t(key) : (settings?.[sKey] || t(key));
  return (
    <section className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-script text-cafe-cream text-3xl sm:text-4xl mb-2">{st('about_subtitle', 'nosotros_subtitle')}</p>
          <h2 className="font-display text-4xl sm:text-5xl text-cafe-text">{st('about_title', 'nosotros_heading')}</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <p className="text-cafe-muted">
              {st('about_p1', 'about_story')}
            </p>
            <p className="text-cafe-muted">
              {st('about_p2', 'nosotros_paragraph2')}
            </p>
            <p className="text-cafe-muted">
              {st('about_p3', 'nosotros_paragraph3')}
            </p>
            <div className="pt-4 space-y-3 border-t border-cafe-border/40">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-cafe-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-cafe-muted text-sm">{st('about_hours_weekdays', 'hours_weekdays')}</p>
                  <p className="text-cafe-muted text-sm">{st('about_hours_weekends', 'hours_weekends')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Music className="w-5 h-5 text-cafe-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-cafe-muted text-sm">{st('about_tag_1', 'culture_line1')}</p>
                  <p className="text-cafe-muted text-sm">{st('about_tag_2', 'culture_line2')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="aspect-[4/3] rounded overflow-hidden border border-cafe-border/60 bg-cafe-card">
            {settings?.hero_bg_image ? (
              <img src={settings.hero_bg_image} alt="Café Círculo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Coffee className="w-16 h-16 text-cafe-muted/20" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
