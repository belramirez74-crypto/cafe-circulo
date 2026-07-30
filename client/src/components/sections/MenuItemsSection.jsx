import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Coffee, ChevronRight } from 'lucide-react';

export default function MenuItemsSection({ module, items }) {
  const { title, subtitle, button_text } = module || {};
  if (!items?.length) return null;

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <p className="font-script text-cafe-cream text-4xl sm:text-5xl">{title}</p>}
            {subtitle && <p className="font-display text-sm tracking-widest text-cafe-muted mt-2">{subtitle}</p>}
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mt-3" />
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.slice(0, 8).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group bg-cafe-surface border border-cafe-border/60 rounded-xl overflow-hidden hover:border-cafe-accent/50 transition-all"
            >
              <div className="aspect-square overflow-hidden bg-cafe-card">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Coffee className="w-8 h-8 text-cafe-muted/20" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-display text-sm text-cafe-text truncate">{item.name}</h3>
                <p className="font-display text-base text-cafe-cream mt-1">${parseFloat(item.price).toLocaleString('es-AR')}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {button_text && (
          <div className="text-center mt-10">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-cafe-accent text-white font-display text-sm tracking-wider rounded-full hover:opacity-90 transition-all"
            >
              {button_text} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
