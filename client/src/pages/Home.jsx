import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserAuth } from '../context/UserAuthContext';
import { Crown, Shield, User, Sparkles, Image, Coffee, Calendar } from 'lucide-react';
import useLandingData from '../components/sections/useLandingData';
import HeroSection from '../components/sections/HeroSection';
import CoffeeTypesSection from '../components/sections/CoffeeTypesSection';
import { getClientPromotions, getClientEventBanners, getUpcomingEvents } from '../lib/api';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { user } = useUserAuth();
  const { settings, featured } = useLandingData();
  const { t } = useLanguage();
  const [promotions, setPromotions] = useState([]);
  const [clientBanners, setClientBanners] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    getUpcomingEvents().then(r => setUpcomingEvents(r.data)).catch(() => {});
    if (!user) return;
    getClientPromotions().then(r => setPromotions(r.data)).catch(() => {});
    getClientEventBanners().then(r => setClientBanners(r.data)).catch(() => {});
  }, [user]);

  return (
    <div className="min-h-screen pt-20">
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
                      <img
                        src={event.flyer_url}
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
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
                    {event.description && (
                      <p className="text-cafe-muted text-sm mt-1.5 leading-relaxed">{event.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CoffeeTypesSection settings={settings} />

      {/* Role-based exclusive content */}
      {user && (
        <section className="py-20 border-t border-cafe-border/60 bg-gradient-to-b from-transparent via-cafe-burgundy/[0.02] to-transparent">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
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
                            {p.image_url && (
                              <div className="w-16 h-16 shrink-0 rounded overflow-hidden bg-cafe-card">
                                <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
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
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="w-8 h-8 text-cafe-muted/20" />
                              </div>
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
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 justify-center p-4 bg-cafe-surface border border-cafe-border/60 hover:border-cafe-accent transition-colors group rounded-xl"
                  >
                    <Crown className="w-5 h-5 text-cafe-burgundy-light shrink-0 group-hover:text-cafe-accent transition-colors" />
                    <p className="text-cafe-muted text-sm group-hover:text-cafe-text transition-colors">{t('home_admin_panel')}</p>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Recommendations for everyone */}
      <section className="py-20 border-t border-cafe-border/60">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="font-script text-cafe-cream text-4xl sm:text-5xl">{t('home_featured_subtitle')}</p>
            <h2 className="font-display text-2xl sm:text-3xl text-cafe-text tracking-[0.15em]">{user?.role === 'staff' ? t('home_recommendations_staff') : t('home_recommendations')}</h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featured.length > 0 ? (
              featured.slice(0, 4).map((item, i) => (
                <div key={item.id || i} className="group relative bg-cafe-surface border border-cafe-border/60 rounded-xl overflow-hidden hover:border-cafe-accent/50 transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden bg-cafe-card">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Coffee className="w-12 h-12 text-cafe-muted/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base text-cafe-text truncate">{item.name}</h3>
                    {item.description && <p className="text-cafe-muted text-sm mt-1 line-clamp-3 leading-relaxed">{item.description}</p>}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-cafe-border/40">
                      <span className="font-display text-xl font-bold text-white bg-cafe-accent px-3 py-1 rounded-lg">
                        ${item.price ? (typeof item.price === 'number' ? parseFloat(item.price).toLocaleString('es-AR') : item.price) : ''}
                      </span>
                      <span className="text-xs text-cafe-muted/60 group-hover:text-cafe-accent transition-colors">{t('home_view')}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center h-48 text-cafe-muted text-sm">{t('recommendations_empty')}</div>
            )}
          </div>
        </div>
      </section>

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
