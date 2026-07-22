import { Clock, Music, Coffee } from 'lucide-react';

export default function SobreNosotrosSection({ settings }) {
  return (
    <section className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-script text-cafe-cream text-2xl sm:text-3xl mb-2">{settings?.nosotros_subtitle || 'Nuestra historia'}</p>
          <h2 className="font-display text-3xl sm:text-4xl text-cafe-text">{settings?.nosotros_heading || 'SOBRE NOSOTROS'}</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <p className="text-cafe-muted">
              {settings?.about_story || 'Café Círculo nació en Villa Allende con la idea de crear un espacio donde la buena música, el café de especialidad y la comunidad se encuentren.'}
            </p>
            <p className="text-cafe-muted">
              {settings?.nosotros_paragraph2 || 'Un lugar para desconectar, trabajar, leer o simplemente disfrutar de una tarde entre amigos mientras suenan vinilos seleccionados cuidadosamente.'}
            </p>
            <p className="text-cafe-muted">
              {settings?.nosotros_paragraph3 || 'Nos apasiona lo que hacemos y queremos compartirlo con vos.'}
            </p>
            <div className="pt-4 space-y-3 border-t border-cafe-border/40">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-cafe-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-cafe-muted text-sm">{settings?.hours_weekdays || 'Lun - Vie: 8:00 - 20:30'}</p>
                  <p className="text-cafe-muted text-sm">{settings?.hours_weekends || 'Sáb - Dom: 9:00 - 20:30'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Music className="w-5 h-5 text-cafe-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-cafe-muted text-sm">{settings?.culture_line1 || 'Tardes de Vinilos'}</p>
                  <p className="text-cafe-muted text-sm">{settings?.culture_line2 || 'Eventos culturales'}</p>
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
