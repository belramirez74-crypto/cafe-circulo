import { useState, useRef, useEffect } from 'react';
import { useUserAuth } from '../../context/UserAuthContext';
import { getClientProfile, updateClientAvatar, updateClientName, getAutoFavorites, getPinnedFavorites, pinFavorite, unpinFavorite, getMenuItems } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, Check, X, Mail, Heart, Star, Plus, Coffee, Trash2 } from 'lucide-react';

export default function ClientProfile() {
  const { user, setUser } = useUserAuth();
  const fileRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [saving, setSaving] = useState(false);

  const [autoFavorites, setAutoFavorites] = useState([]);
  const [pinnedFavorites, setPinnedFavorites] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [showAddPin, setShowAddPin] = useState(false);
  const [searchPin, setSearchPin] = useState('');
  const [loading, setLoading] = useState(true);
  const [favError, setFavError] = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [profRes, autoRes, pinRes, menuRes] = await Promise.allSettled([
        getClientProfile(),
        getAutoFavorites(),
        getPinnedFavorites(),
        getMenuItems(),
      ]);
      if (profRes.status === 'fulfilled') {
        setProfile(profRes.value.data);
        setNameValue(profRes.value.data.name || '');
      }
      if (autoRes.status === 'fulfilled') setAutoFavorites(autoRes.value.data || []);
      if (pinRes.status === 'fulfilled') setPinnedFavorites(pinRes.value.data || []);
      if (menuRes.status === 'fulfilled') setMenuItems(menuRes.value.data || []);
    } catch {}
    setLoading(false);
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await updateClientAvatar(file);
      const newUrl = res.data.avatar_url;
      setProfile(prev => ({ ...prev, avatar_url: newUrl }));
      setUser({ ...user, avatar_url: newUrl });
      localStorage.setItem('app_user', JSON.stringify({ ...user, avatar_url: newUrl }));
    } catch (err) {
      console.error('Avatar upload error:', err.response?.data || err.message);
    }
    setUploading(false);
  };

  const handleNameSave = async () => {
    if (!nameValue.trim()) return;
    setSaving(true);
    try {
      const res = await updateClientName(nameValue.trim());
      setProfile(prev => ({ ...prev, name: res.data.name }));
      setUser({ ...user, name: res.data.name });
      localStorage.setItem('app_user', JSON.stringify({ ...user, name: res.data.name }));
      setEditingName(false);
    } catch {}
    setSaving(false);
  };

  const handlePin = async (itemId) => {
    try {
      await pinFavorite(itemId);
      setShowAddPin(false);
      setSearchPin('');
      setFavError('');
      await loadAll();
    } catch (err) {
      console.error('Pin error:', err.response?.data || err.message);
      setFavError(err.response?.data?.error || 'Error al agregar favorito');
    }
  };

  const handleUnpin = async (favId) => {
    try {
      await unpinFavorite(favId);
      setPinnedFavorites(prev => prev.filter(f => f.id !== favId));
    } catch {}
  };

  const pinnedItemIds = new Set(pinnedFavorites.map(f => f.menu_item_id));
  const filteredMenu = menuItems.filter(m =>
    !pinnedItemIds.has(m.id) && m.stock &&
    (m.name.toLowerCase().includes(searchPin.toLowerCase()) || m.category?.toLowerCase().includes(searchPin.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cafe-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-cafe-bg">
      <div className="max-w-2xl mx-auto px-4">
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#5c1514] via-[#491716] to-[#2A1C10] p-8">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <h1 className="relative font-display text-4xl text-white mb-2">MI PERFIL</h1>
          <p className="relative text-white/60 text-sm">Tu espacio personal en Café Círculo</p>
        </div>

        <div className="bg-gradient-to-br from-[#5c1514] via-[#491716] to-[#2A1C10] border border-[#5c1514]/30 p-8 space-y-6 rounded-xl shadow-lg shadow-black/5">
          <div className="flex items-center gap-5 pb-6 border-b border-cafe-border/40">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#5c1514] to-[#491716] flex items-center justify-center border-3 border-[#5c1514] shadow-lg shadow-[#5c1514]/20">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white/80" />
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </div>

            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={nameValue}
                    onChange={e => setNameValue(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-cafe-bg border border-[#5c1514] text-cafe-text text-sm rounded-xl focus:outline-none"
                    autoFocus
                  />
                  <button onClick={handleNameSave} disabled={saving} className="text-green-400 hover:text-green-300">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setEditingName(false); setNameValue(profile?.name || ''); }} className="text-cafe-muted hover:text-cafe-text">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setEditingName(true)} className="text-left group/name">
                  <h2 className="font-display text-xl text-cafe-text group-hover/name:text-[#5c1514] transition-colors">{profile?.name || 'Cliente'}</h2>
                </button>
              )}
              <div className="flex items-center gap-2 mt-1 text-cafe-muted">
                <Mail className="w-3.5 h-3.5" />
                <span className="text-sm">{profile?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lo que siempre pedís - Auto favorites from sales history */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#5c1514]/20 flex items-center justify-center">
              <Star className="w-4 h-4 text-[#5c1514]" />
            </div>
            <h2 className="font-display text-2xl text-cafe-text">LO QUE SIEMPRE PEDÍS</h2>
          </div>
          {autoFavorites.length === 0 ? (
            <div className="bg-gradient-to-br from-[#5c1514] via-[#491716] to-[#2A1C10] border border-[#5c1514]/30 p-8 rounded-xl text-center shadow-lg shadow-black/5">
              <div className="w-16 h-16 rounded-full bg-[#5c1514]/20 flex items-center justify-center mx-auto mb-3">
                <Coffee className="w-7 h-7 text-white/70" />
              </div>
              <p className="text-[#b5a89a] text-sm">Tus pedidos más frecuentes aparecerán acá cuando el staff registre ventas con tu nombre.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {autoFavorites.map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-[#5c1514] via-[#491716] to-[#2A1C10] border border-[#5c1514]/30 p-4 rounded-xl flex items-center gap-4 shadow-lg shadow-black/5 hover:border-[#5c1514]/50 transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5c1514] to-[#491716] flex items-center justify-center shrink-0 shadow-md shadow-[#5c1514]/20">
                    <span className="font-display text-sm text-white font-bold">#{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base text-cafe-text truncate">{item.item_name}</h3>
                    <p className="text-xs text-cafe-muted">{item.category} · Pedido {item.order_count} {item.order_count === 1 ? 'vez' : 'veces'}</p>
                  </div>
                  <span className="font-display text-sm text-[#5c1514] font-semibold shrink-0">
                    ${parseFloat(item.unit_price).toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mis favoritos - Manual pins */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#5c1514]/20 flex items-center justify-center">
                <Heart className="w-4 h-4 text-[#5c1514]" />
              </div>
              <h2 className="font-display text-2xl text-cafe-text">MIS FAVORITOS</h2>
            </div>
            <button
              onClick={() => setShowAddPin(!showAddPin)}
              className="flex items-center gap-2 px-4 py-2 bg-[#5c1514] text-white font-display text-sm tracking-wider hover:bg-[#731c1a] transition-colors rounded-xl shadow-lg shadow-[#5c1514]/30"
            >
              <Plus className="w-4 h-4" /> AGREGAR
            </button>
          </div>
          {favError && (
            <p className="text-red-400 text-xs mb-3">{favError}</p>
          )}

          <AnimatePresence>
            {showAddPin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-br from-[#5c1514] via-[#491716] to-[#2A1C10] border border-[#5c1514]/30 p-4 rounded-xl mb-4 overflow-hidden shadow-lg shadow-black/5"
              >
                <input
                  value={searchPin}
                  onChange={e => setSearchPin(e.target.value)}
                  placeholder="Buscar en el menú..."
                  className="w-full px-3 py-2 bg-cafe-bg border border-[#5c1514]/30 text-cafe-text text-sm focus:outline-none focus:border-[#5c1514] rounded-xl mb-3"
                  autoFocus
                />
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {filteredMenu.length === 0 ? (
                    <p className="text-cafe-muted text-sm text-center py-4">Sin resultados</p>
                  ) : (
                    filteredMenu.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handlePin(item.id)}
                        className="w-full flex items-center gap-3 p-3 bg-cafe-bg/50 hover:bg-cafe-bg hover:border-[#5c1514]/30 border border-transparent rounded-xl transition-all text-left"
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-cafe-card shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Coffee className="w-5 h-5 text-white/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-cafe-text truncate">{item.name}</p>
                          <p className="text-xs text-cafe-muted">{item.category}</p>
                        </div>
                        <span className="text-sm text-[#5c1514] font-semibold font-display">${parseFloat(item.price).toLocaleString('es-AR')}</span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {pinnedFavorites.length === 0 && !showAddPin ? (
            <div className="bg-gradient-to-br from-[#5c1514] via-[#491716] to-[#2A1C10] border border-[#5c1514]/30 p-8 rounded-xl text-center shadow-lg shadow-black/5">
              <div className="w-16 h-16 rounded-full bg-[#5c1514]/20 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-7 h-7 text-white/70" />
              </div>
              <p className="text-cafe-muted text-sm">Agregá tus favoritos del menú con el botón "AGREGAR".</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pinnedFavorites.map(fav => {
                const item = fav.menu_items;
                return (
                  <div key={fav.id} className="bg-gradient-to-br from-[#5c1514] via-[#491716] to-[#2A1C10] border border-[#5c1514]/30 p-4 rounded-xl flex items-center gap-4 shadow-lg shadow-black/5 hover:border-[#5c1514]/50 transition-shadow">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-cafe-card shrink-0">
                      {item?.image_url ? (
                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Coffee className="w-5 h-5 text-white/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base text-cafe-text truncate">{item?.name || 'Item'}</h3>
                      <p className="text-xs text-cafe-muted">{item?.category}</p>
                    </div>
                    {item?.price && (
                      <span className="font-display text-sm text-[#5c1514] font-semibold shrink-0">${parseFloat(item.price).toLocaleString('es-AR')}</span>
                    )}
                    <button
                      onClick={() => handleUnpin(fav.id)}
                      className="p-1.5 text-white/50 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors shrink-0"
                      title="Quitar de favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
