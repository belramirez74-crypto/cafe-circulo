import { Coffee } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function RecommendationsSection({ featured }) {
  const { t } = useLanguage();
  return (
    <section className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-cafe-surface border border-cafe-border/60 rounded-xl overflow-hidden">
          {featured.length > 0 ? (
            <div className="p-6 space-y-4">
              {featured.slice(0, 4).map((item, i) => (
                <div key={item.id || i} className="flex items-center gap-5 p-4 bg-cafe-card/50 rounded-xl hover:bg-cafe-card transition-colors">
                  <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-cafe-card">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Coffee className="w-8 h-8 text-cafe-muted/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base text-cafe-text truncate">{item.name}</h3>
                    {item.description && <p className="text-cafe-muted text-sm mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>}
                  </div>
                  <span className="font-display text-lg text-cafe-cream shrink-0">
                    ${item.price ? (typeof item.price === 'number' ? parseFloat(item.price).toLocaleString('es-AR') : item.price) : ''}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-cafe-muted text-sm">{t('recommendations_empty')}</div>
          )}
        </div>
      </div>
    </section>
  );
}
