import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMenuItems } from '../lib/api';
import { Search, Coffee, Cookie, Sandwich, CupSoda } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import useLandingData from '../components/sections/useLandingData';

function getCategoryIcon(cat) {
  const lower = cat.toLowerCase();
  if (/caf|espresso|latte|capu|cortado|doppio|americano|lungo|ristretto|flat|coffee|mocha/.test(lower)) return Coffee;
  if (/dulce|cookie|pastel|torta|brownie|scon|alfajor|sweet/.test(lower)) return Cookie;
  if (/sal|sand|empanad|tostad|sandwich|snack|savory/.test(lower)) return Sandwich;
  if (/beb|agua|jugo|limonad|soda|tea|te |mate|smoothie|drink/.test(lower)) return CupSoda;
  return Coffee;
}

function getCategoryColor(cat) {
  const lower = cat.toLowerCase();
  if (/caf|espresso|latte|capu|cortado|doppio|americano|lungo|ristretto|flat|coffee|mocha/.test(lower)) return 'border-l-cafe-accent';
  if (/dulce|cookie|pastel|torta|brownie|scon|alfajor|sweet/.test(lower)) return 'border-l-cafe-cream';
  if (/sal|sand|empanad|tostad|sandwich|snack|savory/.test(lower)) return 'border-l-cafe-burgundy-light';
  if (/beb|agua|jugo|limonad|soda|tea|te |mate|smoothie|drink/.test(lower)) return 'border-l-cafe-burgundy';
  return 'border-l-cafe-accent';
}

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const { lang, t } = useLanguage();
  const { settings } = useLandingData();

  useEffect(() => {
    getMenuItems()
      .then(res => setItems(res.data))
      .catch(() => {});
  }, []);

  const settingsCategories = settings?.menu_categories || [];
  const settingsCategoriesEn = settings?.menu_categories_en || [];
  const categories = ['Todos', ...settingsCategories];

  const getCategoryLabel = (cat) => {
    if (cat === 'Todos') return lang === 'en' ? 'All' : 'Todos';
    if (lang === 'en') {
      const idx = settingsCategories.indexOf(cat);
      if (idx !== -1 && settingsCategoriesEn[idx]) return settingsCategoriesEn[idx];
    }
    return cat;
  };

  const filtered = items.filter(item => {
    const matchCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase()) || item.description_en?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-script text-cafe-accent text-2xl sm:text-3xl mb-2"
          >
            {t('menu_subtitle')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl text-cafe-text"
          >
            {t('menu_title')}
          </motion.h1>
          <div className="w-16 h-0.5 bg-cafe-accent mx-auto mt-4" />
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cafe-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('menu_search')}
              className="w-full pl-10 pr-4 py-3 bg-cafe-surface border border-cafe-border text-cafe-text placeholder-cafe-muted/50 focus:outline-none focus:border-cafe-accent transition-colors rounded-xl"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map(cat => {
            const Icon = getCategoryIcon(cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-display tracking-wider transition-colors rounded-xl shadow-md shadow-black/20 ${
                  activeCategory === cat
                    ? 'bg-cafe-accent text-white'
                    : 'bg-cafe-surface text-cafe-muted border border-cafe-border hover:text-cafe-text hover:border-cafe-accent'
                }`}
              >
                {cat !== 'Todos' && <Icon className="w-4 h-4" />}
                {getCategoryLabel(cat)}
              </button>
            );
          })}
        </motion.div>

        {/* Menu Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cafe-muted text-lg">{t('menu_no_results')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`group bg-cafe-surface border border-cafe-border border-l-4 overflow-hidden hover:border-cafe-accent transition-colors rounded-2xl ${getCategoryColor(item.category)}`}
              >
                <div className="aspect-[4/3] overflow-hidden bg-cafe-card">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Coffee className="w-16 h-16 text-cafe-muted/20" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="font-display text-lg text-cafe-text">{item.name}</h3>
                    <span className="font-display text-xl text-cafe-cream shrink-0">
                      ${parseFloat(item.price).toLocaleString('es-AR')}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-cafe-muted text-sm">{lang === 'en' && item.description_en ? item.description_en : item.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
