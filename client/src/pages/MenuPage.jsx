import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMenuItems } from '../lib/api';
import { Search, Coffee, Cookie, Sandwich, CupSoda } from 'lucide-react';

const categoryIcons = {
  Cafetería: Coffee,
  Dulces: Cookie,
  Saladitos: Sandwich,
  Bebidas: CupSoda,
};

const categoryColors = {
  Cafetería: 'border-l-cafe-accent',
  Dulces: 'border-l-cafe-cream',
  Saladitos: 'border-l-cafe-burgundy-light',
  Bebidas: 'border-l-cafe-burgundy',
};

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getMenuItems()
      .then(res => setItems(res.data))
      .catch(() => {});
  }, []);

  const categories = ['Todos', ...new Set(items.map(i => i.category))];

  const filtered = items.filter(item => {
    const matchCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase());
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
            className="font-script text-cafe-accent text-lg mb-2"
          >
            Nuestras especialidades
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl text-cafe-text"
          >
            MENÚ
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
              placeholder="Buscar en el menú..."
              className="w-full pl-10 pr-4 py-3 bg-cafe-surface border border-cafe-border text-cafe-text placeholder-cafe-muted/50 focus:outline-none focus:border-cafe-accent transition-colors"
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
            const Icon = categoryIcons[cat] || Coffee;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-display tracking-wider transition-colors ${
                  activeCategory === cat
                    ? 'bg-cafe-accent text-white'
                    : 'bg-cafe-surface text-cafe-muted border border-cafe-border hover:text-cafe-text hover:border-cafe-accent'
                }`}
              >
                {cat !== 'Todos' && <Icon className="w-4 h-4" />}
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Menu Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cafe-muted text-lg">No encontramos nada con ese nombre</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`group bg-cafe-surface border border-cafe-border border-l-4 overflow-hidden hover:border-cafe-accent transition-colors ${
                  categoryColors[item.category] || 'border-l-cafe-accent'
                }`}
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
                    <span className="font-display text-cafe-accent shrink-0">
                      ${parseFloat(item.price).toLocaleString('es-AR')}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-cafe-muted text-sm">{item.description}</p>
                  )}
                  <span className="inline-block mt-2 text-xs text-cafe-muted/60 font-display tracking-wider uppercase">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
