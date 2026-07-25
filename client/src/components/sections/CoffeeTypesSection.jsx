import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const coffees = [
  { key: 'espresso', emoji: '☕' },
  { key: 'doppio', emoji: '☕' },
  { key: 'cortado', emoji: '🥛' },
  { key: 'americano', emoji: '☕' },
  { key: 'lungo', emoji: '☕' },
  { key: 'ristretto', emoji: '☕' },
  { key: 'capuchino', emoji: '🥛' },
  { key: 'flatwhite', emoji: '🥛' },
  { key: 'latte', emoji: '🥛' },
  { key: 'mocha', emoji: '🍫' },
];

const gradients = [
  'from-[#3b1f0e] to-[#6b3a1f]',
  'from-[#4a2512] to-[#7a4528]',
  'from-[#5c3018] to-[#8b5e3c]',
  'from-[#2e1a0b] to-[#5a3520]',
  'from-[#3d2010] to-[#6e4225]',
  'from-[#2a1608] to-[#52301a]',
  'from-[#c4956a] to-[#8b6240]',
  'from-[#d4a87c] to-[#9c7050]',
  'from-[#c9a07a] to-[#8d6545]',
  'from-[#4a2815] to-[#3b1d0e]',
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
              <div className={`aspect-[4/3] bg-gradient-to-br ${gradients[i]} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">{coffee.emoji}</span>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-cafe-surface to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-display text-base text-cafe-text mb-1.5 tracking-wide">{t(`coffee_${coffee.key}_name`)}</h3>
                <p className="text-cafe-muted text-xs leading-relaxed">{t(`coffee_${coffee.key}_desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
