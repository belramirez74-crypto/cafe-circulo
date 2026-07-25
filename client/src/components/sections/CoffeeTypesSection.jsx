import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const coffees = [
  {
    key: 'espresso',
    image: 'https://images.unsplash.com/photo-1754847551888-f1d8d043fd7f?fm=jpg&q=60&w=600&auto=format&fit=crop',
  },
  {
    key: 'doppio',
    image: 'https://images.unsplash.com/photo-1769264962972-39cc2acd2591?fm=jpg&q=60&w=600&auto=format&fit=crop',
  },
  {
    key: 'cortado',
    image: 'https://images.unsplash.com/photo-1643397652694-646c2c3c9884?fm=jpg&q=60&w=600&auto=format&fit=crop',
  },
  {
    key: 'americano',
    image: 'https://images.unsplash.com/photo-1714415632243-079d9a86071a?fm=jpg&q=60&w=600&auto=format&fit=crop',
  },
  {
    key: 'lungo',
    image: 'https://images.unsplash.com/photo-1769264963664-36eed2f7eb4d?fm=jpg&q=60&w=600&auto=format&fit=crop',
  },
  {
    key: 'ristretto',
    image: 'https://images.unsplash.com/photo-1766912262471-73a659cc3c0d?fm=jpg&q=60&w=600&auto=format&fit=crop',
  },
  {
    key: 'capuchino',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?fm=jpg&q=60&w=600&auto=format&fit=crop',
  },
  {
    key: 'flatwhite',
    image: 'https://images.unsplash.com/photo-1769775092114-c569476f89ae?fm=jpg&q=60&w=600&auto=format&fit=crop',
  },
  {
    key: 'latte',
    image: 'https://images.unsplash.com/photo-1770123024494-776bc2d3836b?fm=jpg&q=60&w=600&auto=format&fit=crop',
  },
  {
    key: 'mocha',
    image: 'https://images.unsplash.com/photo-1530629159325-9c378fc150b9?fm=jpg&q=60&w=600&auto=format&fit=crop',
  },
];

export default function CoffeeTypesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-cafe-bg via-cafe-burgundy/[0.03] to-cafe-bg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="font-script text-cafe-cream text-2xl sm:text-3xl mb-2">{t('coffee_section_subtitle')}</p>
          <h2 className="font-display text-3xl sm:text-4xl text-cafe-text tracking-[0.15em]">{t('coffee_section_title')}</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {coffees.map((coffee, i) => (
            <motion.div
              key={coffee.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group bg-cafe-surface border border-cafe-border/60 rounded-2xl overflow-hidden hover:border-cafe-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-cafe-accent/10"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={coffee.image}
                  alt={t(`coffee_${coffee.key}_name`)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="px-4 py-3">
                <h3 className="font-display text-sm text-cafe-text mb-1 tracking-wide">{t(`coffee_${coffee.key}_name`)}</h3>
                <p className="text-cafe-muted text-sm leading-relaxed">{t(`coffee_${coffee.key}_desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
