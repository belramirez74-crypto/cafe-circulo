import { useEffect, useState } from 'react';
import { getAdminClients, getAdminClientFavorites } from '../../lib/api';
import { Users, Mail, Calendar, Search, ChevronRight, Star, Heart, Coffee, X, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [favData, setFavData] = useState(null);
  const [loadingFavs, setLoadingFavs] = useState(false);

  useEffect(() => {
    getAdminClients().then(r => setClients(r.data)).catch(() => {});
  }, []);

  const filtered = search
    ? clients.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()))
    : clients;

  const handleSelect = async (client) => {
    if (selected?.id === client.id) {
      setSelected(null);
      setFavData(null);
      return;
    }
    setSelected(client);
    setFavData(null);
    setLoadingFavs(true);
    try {
      const res = await getAdminClientFavorites(client.id);
      setFavData(res.data);
    } catch {}
    setLoadingFavs(false);
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-cafe-text">GESTIÓN DE CLIENTES</h1>
            <p className="text-cafe-muted text-sm mt-1">{clients.length} clientes registrados</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full pl-10 pr-4 py-2.5 bg-cafe-surface border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-[#5c1514] rounded-xl"
          />
        </div>

        <div className="space-y-3">
          {filtered.map(client => (
            <div key={client.id}>
              <button
                onClick={() => handleSelect(client)}
                className={`w-full bg-cafe-surface border p-4 rounded-xl flex items-center gap-4 transition-all text-left ${selected?.id === client.id ? 'border-[#5c1514] shadow-lg shadow-[#5c1514]/10' : 'border-cafe-border hover:border-cafe-border/80 hover:shadow-lg hover:shadow-black/5'}`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#5c1514]/10 flex items-center justify-center shrink-0 border-2 border-[#5c1514]/20">
                  {client.avatar_url ? (
                    <img src={client.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-5 h-5 text-[#5c1514]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm text-cafe-text">{client.name || 'Sin nombre'}</p>
                  <div className="flex items-center gap-2 text-xs text-cafe-muted">
                    <Mail className="w-3 h-3" />
                    {client.email}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-cafe-muted shrink-0">
                  <Calendar className="w-3 h-3" />
                  {new Date(client.created_at).toLocaleDateString('es-AR')}
                </div>
                <ChevronRight className={`w-4 h-4 text-cafe-muted transition-transform ${selected?.id === client.id ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {selected?.id === client.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 bg-cafe-bg border border-cafe-border border-t-0 rounded-b-xl">
                      {loadingFavs ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader className="w-5 h-5 text-[#5c1514] animate-spin" />
                        </div>
                      ) : favData ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Auto favorites */}
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Star className="w-4 h-4 text-[#5c1514]" />
                              <h3 className="font-display text-xs tracking-widest text-[#5c1514] uppercase">Lo que siempre pide</h3>
                            </div>
                            {favData.autoFavorites?.length > 0 ? (
                              <div className="space-y-2">
                                {favData.autoFavorites.map((item, i) => (
                                  <div key={i} className="flex items-center gap-3 p-2.5 bg-cafe-surface rounded-lg border border-cafe-border/40">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5c1514] to-[#491716] flex items-center justify-center shrink-0 shadow-sm shadow-[#5c1514]/20">
                                      <span className="text-xs text-white font-bold">#{i + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-cafe-text truncate">{item.item_name}</p>
                                      <p className="text-xs text-cafe-muted">{item.category} · {item.order_count} {item.order_count === 1 ? 'vez' : 'veces'}</p>
                                    </div>
                                    <span className="text-xs text-[#5c1514] font-semibold font-display">${parseFloat(item.unit_price).toLocaleString('es-AR')}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-cafe-muted/50 py-3">Sin pedidos registrados</p>
                            )}
                          </div>

                          {/* Pinned favorites */}
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Heart className="w-4 h-4 text-[#5c1514]" />
                              <h3 className="font-display text-xs tracking-widest text-[#5c1514] uppercase">Favoritos marcados</h3>
                            </div>
                            {favData.pinnedFavorites?.length > 0 ? (
                              <div className="space-y-2">
                                {favData.pinnedFavorites.map(fav => {
                                  const item = fav.menu_items;
                                  return (
                                    <div key={fav.id} className="flex items-center gap-3 p-2.5 bg-cafe-surface rounded-lg border border-cafe-border/40">
                                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-cafe-card shrink-0">
                                        {item?.image_url ? (
                                          <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center">
                                            <Coffee className="w-4 h-4 text-cafe-muted/30" />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm text-cafe-text truncate">{item?.name || 'Item'}</p>
                                        <p className="text-xs text-cafe-muted">{item?.category}</p>
                                      </div>
                                      {item?.price && (
                                        <span className="text-xs text-[#5c1514] font-semibold font-display">${parseFloat(item.price).toLocaleString('es-AR')}</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-xs text-cafe-muted/50 py-3">Sin favoritos marcados</p>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-cafe-surface border border-cafe-border p-8 rounded-xl text-center">
              <p className="text-cafe-muted/50 text-sm">{search ? 'Sin resultados' : 'No hay clientes registrados'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
