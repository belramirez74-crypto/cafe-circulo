import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Shield, User, Sparkles, Image, Calendar } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';
import { useLanguage } from '../context/LanguageContext';
import useLandingData from '../components/sections/useLandingData';
import HeroSection from '../components/sections/HeroSection';
import CoffeeTypesSection from '../components/sections/CoffeeTypesSection';
import ReservaSection from '../components/sections/ReservaSection';
import GallerySection from '../components/sections/GallerySection';
import EncontranosSection from '../components/sections/EncontranosSection';
import RecommendationsSection from '../components/sections/RecommendationsSection';
import TextImageSection from '../components/sections/TextImageSection';
import MenuItemsSection from '../components/sections/MenuItemsSection';
import { getRecommendedItems, getMenuItems, getUpcomingEvents, getClientPromotions, getClientEventBanners } from '../lib/api';

export default function Home() {
  const { user } = useUserAuth();
  const { settings } = useLandingData();
  const { t } = useLanguage();
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [clientBanners, setClientBanners] = useState([]);

  useEffect(() => {
    getRecommendedItems().then(r => setRecommendedItems(r.data)).catch(() => {});
    getMenuItems().then(r => setAllMenuItems(r.data)).catch(() => {});
    getUpcomingEvents().then(r => setUpcomingEvents(r.data)).catch(() => {});
    if (!user) return;
    getClientPromotions().then(r => setPromotions(r.data)).catch(() => {});
    getClientEventBanners().then(r => setClientBanners(r.data)).catch(() => {});
  }, [user]);

  const modules = settings?.modules || [];

  return (
    <div className="min-h-screen pt-20">
      {modules.length > 0 ? (
        modules.filter(m => m.visible).map(mod => {
          switch (mod.type) {
            case 'hero':
              return <HeroSection key={mod.id} settings={settings} />;
            case 'recommendations':
              if (!recommendedItems.length) return null;
              return (
                <section key={mod.id} className="py-16">
                  <div className="max-w-6xl mx-auto px-4">
                    {mod.title && (
                      <div className="text-center mb-10">
                        <p className="font-script text-cafe-cream text-4xl sm:text-5xl">{mod.title}</p>
                        {mod.subtitle && <p className="font-display text-sm tracking-widest text-cafe-muted mt-2">{mod.subtitle}</p>}
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mt-3" />
                      </div>
                    )}
                    <RecommendationsSection featured={recommendedItems} />
                  </div>
                </section>
              );
            case 'coffee_types':
              return <CoffeeTypesSection key={mod.id} settings={settings} />;
            case 'reservas':
              return (
                <section key={mod.id} className="py-16">
                  <div className="max-w-6xl mx-auto px-4">
                    <ReservaSection settings={settings} />
                  </div>
                </section>
              );
            case 'gallery':
              return (
                <section key={mod.id} className="py-16">
                  <div className="max-w-6xl mx-auto px-4">
                    <GallerySection settings={settings} />
                  </div>
                </section>
              );
            case 'text_image':
              return <TextImageSection key={mod.id} module={mod} />;
            case 'menu_items': {
              const items = allMenuItems.filter(it => mod.item_ids?.includes(it.id));
              if (!items.length) return null;
              return <MenuItemsSection key={mod.id} module={mod} items={items} />;
            }
            case 'encuentranos':
              return (
                <section key={mod.id} className="py-16">
                  <div className="max-w-6xl mx-auto px-4">
                    <EncontranosSection settings={settings} />
                  </div>
                </section>
              );
            default:
              return null;
          }
        })
      ) : (
        <>
          <HeroSection settings={settings} />
          {upcomingEvents.length > 0 && (
            <section className="py-16">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-10">
                  <p className="font-script text-cafe-cream text-4xl sm:text-5xl">{t('home_events')}</p>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mt-3" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: -60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15, type: 'spring', stiffness: 200, damping: 8, mass: 1 }}
                      className="group bg-cafe-surface border border-cafe-border/60 rounded-xl overflow-hidden hover:border-cafe-accent/50 transition-all duration-300"
                    >
                      {event.flyer_url ? (
                        <div className="overflow-hidden bg-cafe-card">
                          <img src={event.flyer_url} alt={event.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      ) : (
                        <div className="h-48 bg-cafe-card flex items-center justify-center">
                          <Calendar className="w-10 h-10 text-cafe-muted/20" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-cafe-accent text-sm mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-display tracking-wider">
                            {new Date(event.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="font-display text-lg text-cafe-text">{event.title}</h3>
                        {event.description && <p className="text-cafe-muted text-sm mt-1.5 leading-relaxed">{event.description}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}
          <CoffeeTypesSection settings={settings} />
        </>
      )}

      {/* Role-based content */}
      {user && (
        <section className="py-20 border-t border-cafe-border/60 bg-gradient-to-b from-transparent via-cafe-burgundy/[0.02] to-transparent">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Crown className="w-8 h-8 text-cafe-burgundy-light mx-auto mb-3" />
              <p className="font-script text-cafe-cream text-4xl sm:text-5xl mb-2">{t('home_welcome')}</p>
              <h2 className="font-display text-3xl sm:text-4xl text-cafe-text mb-4">
                {user.role === 'admin' ? t('home_role_admin') : user.role === 'staff' ? t('home_role_staff') : t('home_role_client')}
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mb-8" />

              {user.role === 'staff' && (
                <div className="max-w-xl mx-auto space-y-4">
                  <Link to="/staff" className="flex items-center gap-3 p-4 bg-cafe-surface border border-cafe-border/60 hover:border-cafe-accent transition-colors group rounded-xl">
                    <Shield className="w-5 h-5 text-cafe-burgundy-light shrink-0 group-hover:text-cafe-accent transition-colors" />
                    <p className="text-cafe-muted text-sm text-left group-hover:text-cafe-text transition-colors">{t('home_staff_dashboard')}</p>
                  </Link>
                  <Link to="/staff/profile" className="flex items-center gap-3 p-4 bg-cafe-surface border border-cafe-border/60 hover:border-cafe-accent transition-colors group rounded-xl">
                    <User className="w-5 h-5 text-cafe-burgundy-light shrink-0 group-hover:text-cafe-accent transition-colors" />
                    <p className="text-cafe-muted text-sm text-left group-hover:text-cafe-text transition-colors">{t('home_staff_profile')}</p>
                  </Link>
                </div>
              )}

              {user.role === 'client' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="flex items-center gap-3 justify-center p-4 bg-cafe-surface border border-cafe-border/60 rounded-xl">
                    <Sparkles className="w-5 h-5 text-cafe-burgundy-light shrink-0" />
                    <p className="text-cafe-muted text-sm text-left">{t('home_client_benefits')}</p>
                  </div>
                  {promotions.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-display text-sm tracking-widest text-cafe-accent">{t('home_promotions')}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {promotions.map(p => (
                          <div key={p.id} className="flex items-start gap-3 p-4 bg-cafe-surface border border-cafe-border/60 text-left rounded-xl">
                            {p.image_url && <div className="w-16 h-16 shrink-0 rounded overflow-hidden bg-cafe-card"><img src={p.image_url} alt="" className="w-full h-full object-cover" /></div>}
                            <div>
                              <h4 className="font-display text-sm text-cafe-text">{p.title}</h4>
                              {p.description && <p className="text-sm text-cafe-muted mt-1 leading-relaxed">{p.description}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {clientBanners.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-display text-sm tracking-widest text-cafe-accent">{t('home_events')}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {clientBanners.map(b => (
                          <div key={b.id} className="aspect-[16/9] rounded-xl overflow-hidden border border-cafe-border/60 bg-cafe-card group">
                            {b.image_url ? (
                              <img src={b.image_url} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Image className="w-8 h-8 text-cafe-muted/20" /></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {user.role === 'admin' && (
                <div className="max-w-xl mx-auto space-y-4">
                  <Link to="/admin" className="flex items-center gap-3 justify-center p-4 bg-cafe-surface border border-cafe-border/60 hover:border-cafe-accent transition-colors group rounded-xl">
                    <Crown className="w-5 h-5 text-cafe-burgundy-light shrink-0 group-hover:text-cafe-accent transition-colors" />
                    <p className="text-cafe-muted text-sm group-hover:text-cafe-text transition-colors">{t('home_admin_panel')}</p>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-cafe-border/60 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cafe-burgundy/40 to-transparent mx-auto mb-6" />
          <p className="font-display text-lg text-cafe-text mb-2 tracking-widest">CAFÉ CÍRCULO</p>
          <p className="text-cafe-muted-dark text-sm tracking-wide">Villa Allende · Córdoba · Argentina</p>
          <p className="text-cafe-muted-dark/60 text-xs mt-6 tracking-wider">© 2026 Café Círculo</p>
        </div>
      </footer>
    </div>
  );
}
