import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const EspressoSVG = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <defs>
      <linearGradient id="espresso-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5c2d0e" />
        <stop offset="100%" stopColor="#8b4513" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="85" rx="22" ry="6" fill="#3b1a08" opacity="0.3" />
    <path d="M35 45 L40 82 C40 84 48 90 60 90 C72 90 80 84 80 82 L85 45 Z" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1.5" />
    <ellipse cx="60" cy="45" rx="25" ry="7" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1.5" />
    <ellipse cx="60" cy="45" rx="20" ry="5.5" fill="url(#espresso-grad)" />
    <ellipse cx="60" cy="45" rx="18" ry="4.5" fill="#6b3410" opacity="0.6" />
    <path d="M85 52 C95 52 100 55 100 62 C100 69 95 72 85 72" fill="none" stroke="#d4c4a8" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M48 32 C48 28 50 24 52 24" fill="none" stroke="#d4c4a8" strokeWidth="1" opacity="0.4" />
    <path d="M56 30 C56 25 58 21 60 21" fill="none" stroke="#d4c4a8" strokeWidth="1" opacity="0.3" />
    <path d="M64 32 C64 27 66 23 68 23" fill="none" stroke="#d4c4a8" strokeWidth="1" opacity="0.4" />
  </svg>
);

const DoppioSVG = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <defs>
      <linearGradient id="doppio-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a2010" />
        <stop offset="100%" stopColor="#7a3d1a" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="88" rx="26" ry="6" fill="#3b1a08" opacity="0.3" />
    <path d="M28 48 L33 85 C33 87 42 93 60 93 C78 93 87 87 87 85 L92 48 Z" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1.5" />
    <ellipse cx="60" cy="48" rx="32" ry="8" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1.5" />
    <ellipse cx="60" cy="48" rx="27" ry="6.5" fill="url(#doppio-grad)" />
    <ellipse cx="52" cy="47" rx="6" ry="3" fill="#8b5a2a" opacity="0.4" />
    <ellipse cx="68" cy="47" rx="6" ry="3" fill="#8b5a2a" opacity="0.4" />
    <path d="M92 55 C102 55 108 58 108 66 C108 74 102 77 92 77" fill="none" stroke="#d4c4a8" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const CortadoSVG = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <defs>
      <linearGradient id="cortado-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6b3a1f" />
        <stop offset="40%" stopColor="#8b6240" />
        <stop offset="100%" stopColor="#c4956a" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="88" rx="22" ry="5" fill="#3b1a08" opacity="0.25" />
    <path d="M38 50 L42 85 C42 87 49 91 60 91 C71 91 78 87 78 85 L82 50 Z" fill="url(#cortado-grad)" />
    <ellipse cx="60" cy="50" rx="22" ry="7" fill="#c4956a" />
    <ellipse cx="60" cy="50" rx="18" ry="5.5" fill="#d4a87c" opacity="0.8" />
    <ellipse cx="60" cy="50" rx="10" ry="3.5" fill="#e8d5c0" opacity="0.6" />
    <path d="M82 56 C90 56 95 59 95 65 C95 71 90 74 82 74" fill="none" stroke="#c4956a" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="36" y="85" width="48" height="3" rx="1.5" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1" />
  </svg>
);

const AmericanoSVG = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <defs>
      <linearGradient id="americano-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#5c2d0e" />
        <stop offset="100%" stopColor="#3b1a08" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="90" rx="28" ry="5" fill="#3b1a08" opacity="0.25" />
    <path d="M32 40 L36 87 C36 89 45 94 60 94 C75 94 84 89 84 87 L88 40 Z" fill="url(#americano-grad)" />
    <ellipse cx="60" cy="40" rx="28" ry="8" fill="#5c2d0e" />
    <ellipse cx="60" cy="40" rx="24" ry="6.5" fill="#6b3410" />
    <ellipse cx="60" cy="40" rx="4" ry="2" fill="#8b5a2a" opacity="0.3" />
    <path d="M88 48 C98 48 104 52 104 60 C104 68 98 72 88 72" fill="none" stroke="#5c2d0e" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M50 30 C50 22 54 18 58 16" fill="none" stroke="#d4c4a8" strokeWidth="1.2" opacity="0.3" />
    <path d="M60 28 C60 20 63 16 67 14" fill="none" stroke="#d4c4a8" strokeWidth="1.2" opacity="0.25" />
    <path d="M70 30 C70 23 73 19 77 17" fill="none" stroke="#d4c4a8" strokeWidth="1.2" opacity="0.3" />
  </svg>
);

const LungoSVG = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <defs>
      <linearGradient id="lungo-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6b3410" />
        <stop offset="50%" stopColor="#4a2512" />
        <stop offset="100%" stopColor="#3b1a08" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="92" rx="20" ry="4.5" fill="#3b1a08" opacity="0.25" />
    <path d="M42 35 L45 89 C45 91 50 95 60 95 C70 95 75 91 75 89 L78 35 Z" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1.5" />
    <ellipse cx="60" cy="35" rx="18" ry="5.5" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1.5" />
    <ellipse cx="60" cy="35" rx="14" ry="4" fill="url(#lungo-grad)" />
    <path d="M78 45 C88 45 93 48 93 55 C93 62 88 65 78 65" fill="none" stroke="#d4c4a8" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="40" y="89" width="40" height="3" rx="1.5" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1" />
  </svg>
);

const RistrettoSVG = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <defs>
      <linearGradient id="ristretto-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2a1208" />
        <stop offset="100%" stopColor="#5c2d0e" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="82" rx="18" ry="4.5" fill="#2a1208" opacity="0.3" />
    <path d="M42 48 L45 80 C45 82 50 85 60 85 C70 85 75 82 75 80 L78 48 Z" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1.5" />
    <ellipse cx="60" cy="48" rx="18" ry="6" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1.5" />
    <ellipse cx="60" cy="48" rx="14" ry="4.5" fill="url(#ristretto-grad)" />
    <ellipse cx="60" cy="48" rx="12" ry="3.5" fill="#3b1a08" opacity="0.7" />
    <ellipse cx="57" cy="47" rx="3" ry="1.5" fill="#2a1208" opacity="0.4" />
    <path d="M78 54 C86 54 90 57 90 62 C90 67 86 70 78 70" fill="none" stroke="#d4c4a8" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="40" y="80" width="40" height="3" rx="1.5" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1" />
  </svg>
);

const CapuchinoSVG = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <defs>
      <linearGradient id="cap-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f5f0e8" />
        <stop offset="100%" stopColor="#e8d5c0" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="90" rx="26" ry="5" fill="#3b1a08" opacity="0.25" />
    <path d="M30 50 L35 87 C35 89 44 93 60 93 C76 93 85 89 85 87 L90 50 Z" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1.5" />
    <ellipse cx="60" cy="50" rx="30" ry="9" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1.5" />
    <ellipse cx="60" cy="49" rx="26" ry="7.5" fill="#e8d5c0" />
    <ellipse cx="60" cy="48" rx="22" ry="6" fill="#f0e6d8" />
    <circle cx="60" cy="47" r="8" fill="#f5f0e8" opacity="0.5" />
    <circle cx="60" cy="47" r="5" fill="#e8d5c0" opacity="0.4" />
    <ellipse cx="60" cy="47" rx="3" ry="2" fill="#8b6240" opacity="0.3" />
    <path d="M90 57 C100 57 106 61 106 68 C106 75 100 79 90 79" fill="none" stroke="#d4c4a8" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const FlatWhiteSVG = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <defs>
      <linearGradient id="fw-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f8f4ef" />
        <stop offset="100%" stopColor="#e0d0ba" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="88" rx="28" ry="5" fill="#3b1a08" opacity="0.2" />
    <path d="M28 52 L33 85 C33 87 42 92 60 92 C78 92 87 87 87 85 L92 52 Z" fill="url(#fw-grad)" stroke="#d4c4a8" strokeWidth="1.5" />
    <ellipse cx="60" cy="52" rx="32" ry="9" fill="#f8f4ef" stroke="#d4c4a8" strokeWidth="1.5" />
    <ellipse cx="60" cy="51" rx="28" ry="7" fill="#f0e8dc" />
    <ellipse cx="60" cy="50" rx="24" ry="5.5" fill="#f5f0e8" opacity="0.8" />
    <circle cx="55" cy="49" r="4" fill="#f8f4ef" opacity="0.5" />
    <circle cx="65" cy="49" r="4" fill="#f8f4ef" opacity="0.5" />
    <path d="M92 58 C102 58 108 62 108 69 C108 76 102 80 92 80" fill="none" stroke="#d4c4a8" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const LatteSVG = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <defs>
      <linearGradient id="latte-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f5f0e8" />
        <stop offset="100%" stopColor="#d4b896" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="92" rx="24" ry="5" fill="#3b1a08" opacity="0.2" />
    <path d="M35 38 L39 89 C39 91 47 95 60 95 C73 95 81 91 81 89 L85 38 Z" fill="url(#latte-grad)" stroke="#d4c4a8" strokeWidth="1.5" />
    <ellipse cx="60" cy="38" rx="25" ry="7" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1.5" />
    <ellipse cx="60" cy="37" rx="21" ry="5.5" fill="#e8d5c0" />
    <ellipse cx="60" cy="36" rx="17" ry="4" fill="#f0e8dc" opacity="0.6" />
    <path d="M85 48 C95 48 100 52 100 60 C100 68 95 72 85 72" fill="none" stroke="#d4c4a8" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="33" y="89" width="54" height="3" rx="1.5" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1" />
  </svg>
);

const MochaSVG = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <defs>
      <linearGradient id="mocha-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4a2010" />
        <stop offset="50%" stopColor="#6b3410" />
        <stop offset="100%" stopColor="#3b1a08" />
      </linearGradient>
      <linearGradient id="mocha-cream" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f5f0e8" />
        <stop offset="100%" stopColor="#c4956a" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="90" rx="24" ry="5" fill="#2a1208" opacity="0.3" />
    <path d="M35 45 L39 87 C39 89 47 93 60 93 C73 93 81 89 81 87 L85 45 Z" fill="url(#mocha-grad)" stroke="#3b1a08" strokeWidth="1.5" />
    <ellipse cx="60" cy="45" rx="25" ry="7" fill="#4a2010" />
    <ellipse cx="60" cy="44" rx="21" ry="5.5" fill="url(#mocha-cream)" />
    <ellipse cx="60" cy="43" rx="14" ry="4" fill="#f5f0e8" opacity="0.5" />
    <ellipse cx="60" cy="43" rx="6" ry="2.5" fill="#c4956a" opacity="0.4" />
    <path d="M85 52 C95 52 100 56 100 63 C100 70 95 74 85 74" fill="none" stroke="#3b1a08" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="33" y="87" width="54" height="3" rx="1.5" fill="#f5f0e8" stroke="#d4c4a8" strokeWidth="1" />
  </svg>
);

const coffeeSvgs = {
  espresso: EspressoSVG,
  doppio: DoppioSVG,
  cortado: CortadoSVG,
  americano: AmericanoSVG,
  lungo: LungoSVG,
  ristretto: RistrettoSVG,
  capuchino: CapuchinoSVG,
  flatwhite: FlatWhiteSVG,
  latte: LatteSVG,
  mocha: MochaSVG,
};

const coffees = [
  { key: 'espresso' },
  { key: 'doppio' },
  { key: 'cortado' },
  { key: 'americano' },
  { key: 'lungo' },
  { key: 'ristretto' },
  { key: 'capuchino' },
  { key: 'flatwhite' },
  { key: 'latte' },
  { key: 'mocha' },
];

const bgColors = [
  'bg-[#2a1608]',
  'bg-[#341c0e]',
  'bg-[#3d2212]',
  'bg-[#241208]',
  'bg-[#2e180c]',
  'bg-[#1e0e06]',
  'bg-[#3a2818]',
  'bg-[#3d2c1c]',
  'bg-[#38251a]',
  'bg-[#261408]',
];

const defaultCoffees = [
  { key: 'espresso' },
  { key: 'doppio' },
  { key: 'cortado' },
  { key: 'americano' },
  { key: 'lungo' },
  { key: 'ristretto' },
  { key: 'capuchino' },
  { key: 'flatwhite' },
  { key: 'latte' },
  { key: 'mocha' },
];

export default function CoffeeTypesSection({ settings }) {
  const { t } = useLanguage();
  const coffees = settings?.coffee_items?.length > 0 ? settings.coffee_items : defaultCoffees;

  return (
    <section className="py-20 bg-gradient-to-b from-cafe-bg via-cafe-burgundy/[0.03] to-cafe-bg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="font-script text-cafe-cream text-2xl sm:text-3xl mb-2">{t('coffee_section_subtitle')}</p>
          <h2 className="font-display text-3xl sm:text-4xl text-cafe-text tracking-[0.15em]">{t('coffee_section_title')}</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {coffees.map((coffee, i) => {
            const SvgComp = coffeeSvgs[coffee.key];
            const customImage = settings?.coffee_images?.[coffee.key];
            const label = coffee.label || t(`coffee_${coffee.key}_name`);
            const desc = coffee.label ? '' : t(`coffee_${coffee.key}_desc`);
            return (
              <motion.div
                key={coffee.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group bg-cafe-surface border border-cafe-border/60 rounded-2xl overflow-hidden hover:border-cafe-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-cafe-accent/10"
              >
                <div className={`aspect-square overflow-hidden ${!customImage ? (bgColors[i % bgColors.length] || 'bg-[#2a1608]') : ''} flex items-center justify-center`}>
                  {customImage ? (
                    <img
                      src={customImage}
                      alt={label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : SvgComp ? (
                    <div className="w-16 h-16 group-hover:scale-110 transition-transform duration-300">
                      <SvgComp />
                    </div>
                  ) : (
                    <Coffee className="w-10 h-10 text-cafe-muted/20" />
                  )}
                </div>
                <div className="px-4 py-3">
                  <h3 className="font-display text-sm text-cafe-text mb-1 tracking-wide">{label}</h3>
                  {desc && <p className="text-cafe-muted text-sm leading-relaxed">{desc}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
