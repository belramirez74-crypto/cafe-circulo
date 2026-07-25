import { useEffect, useState } from 'react';
import { getLandingSettings, updateLandingSettings } from '../../lib/api';
import { Save, Clock, MapPin, Music, Plus, X, Image, GripVertical, ChevronRight, Video, Coffee } from 'lucide-react';
import ImagePicker from '../../components/ImagePicker';

function isVideoUrl(url) {
  return /(?:youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/|player\.vimeo\.com\/video\/)/.test(url);
}

function getVideoEmbed(url) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
}

const defaultSettings = {
  // Hero
  hero_subtitle: '',
  hero_title_line1: 'CAFÉ',
  hero_title_line2: 'Círculo',
  hero_description: '',
  hero_bg_image: '',
  hero_button_text: 'VER MENÚ',

  // Reserva
  reserva_heading: 'RESERVA',
  reserva_description: 'Contactanos para reservar tu lugar y disfrutar de una experiencia única.',
  reserva_whatsapp_url: 'https://wa.me/5493541530797',
  reserva_instagram_url: 'https://instagram.com/cafecirculo',

  // Recommendations
  recommended_items: [],

  // Gallery
  gallery_taglines: ['más que un café de especialidad,', 'una comunidad.', 'donde los círculos se hacen más grandes'],
  gallery_images: [],

  // Encontranos
  encontranos_subtitle: 'Visitanos',
  encontranos_heading: 'ENCONTRANOS',
  ubicacion_heading: 'UBICACIÓN',
  location_line1: '',
  location_line2: '',
  maps_embed_url: '',

  // Sobre Nosotros
  nosotros_subtitle: 'Nuestra historia',
  nosotros_heading: 'SOBRE NOSOTROS',
  about_story: '',
  nosotros_paragraph2: '',
  nosotros_paragraph3: '',
  hours_weekdays: '',
  hours_weekends: '',
  culture_line1: '',
  culture_line2: '',

  // Tipos de Café (imágenes custom)
  coffee_images: {},
  coffee_items: [
    { key: 'espresso', label: 'Espresso' },
    { key: 'doppio', label: 'Doppio' },
    { key: 'cortado', label: 'Cortado' },
    { key: 'americano', label: 'Americano' },
    { key: 'lungo', label: 'Lungo' },
    { key: 'ristretto', label: 'Ristretto' },
    { key: 'capuchino', label: 'Capuchino' },
    { key: 'flatwhite', label: 'Flat White' },
    { key: 'latte', label: 'Latte' },
    { key: 'mocha', label: 'Mocha' },
  ],

  // Categorías del menú
  menu_categories: ['Cafetería', 'Dulces', 'Saladitos', 'Bebidas'],
};

export default function AdminLanding() {
  const [settings, setSettings] = useState(defaultSettings);
  const [original, setOriginal] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pickerTarget, setPickerTarget] = useState(null);
  const [previewTaglineIdx, setPreviewTaglineIdx] = useState(0);

  useEffect(() => {
    const taglines = settings.gallery_taglines || ['más que un café de especialidad,', 'una comunidad.'];
    if (taglines.length <= 1) return;
    const interval = setInterval(() => {
      setPreviewTaglineIdx(prev => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, [settings.gallery_taglines?.length]);

  useEffect(() => {
    setLoading(true);
    getLandingSettings()
      .then(res => {
        setSettings(res.data);
        setOriginal(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const addGalleryImage = () => {
    setSettings(prev => ({
      ...prev,
      gallery_images: [...(prev.gallery_images || []), ''],
    }));
  };

  const updateGalleryImage = (index, url) => {
    const updated = [...(settings.gallery_images || [])];
    updated[index] = url;
    handleChange('gallery_images', updated);
  };

  const removeGalleryImage = (index) => {
    const updated = [...(settings.gallery_images || [])];
    updated.splice(index, 1);
    handleChange('gallery_images', updated);
  };

  const moveGalleryImage = (from, to) => {
    const updated = [...(settings.gallery_images || [])];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    handleChange('gallery_images', updated);
  };

  const addTagline = () => {
    setSettings(prev => ({ ...prev, gallery_taglines: [...(prev.gallery_taglines || []), ''] }));
  };
  const updateTagline = (index, value) => {
    setSettings(prev => {
      const updated = [...(prev.gallery_taglines || [])];
      updated[index] = value;
      return { ...prev, gallery_taglines: updated };
    });
  };
  const removeTagline = (index) => {
    setSettings(prev => {
      const updated = [...(prev.gallery_taglines || [])];
      updated.splice(index, 1);
      return { ...prev, gallery_taglines: updated };
    });
  };

  const addRecommendedItem = () => {
    setSettings(prev => ({
      ...prev,
      recommended_items: [...(prev.recommended_items || []), { name: '', description: '', price: '', image_url: '' }],
    }));
  };

  const updateRecommendedItem = (index, key, value) => {
    const updated = [...(settings.recommended_items || [])];
    updated[index] = { ...updated[index], [key]: value };
    handleChange('recommended_items', updated);
  };

  const removeRecommendedItem = (index) => {
    const updated = [...(settings.recommended_items || [])];
    updated.splice(index, 1);
    handleChange('recommended_items', updated);
  };

  const moveRecommendedItem = (from, to) => {
    const updated = [...(settings.recommended_items || [])];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    handleChange('recommended_items', updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateLandingSettings(settings);
      setOriginal(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(original);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3rem)]">
        <div className="w-8 h-8 border-2 border-cafe-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-cafe-text">LANDING PAGE</h1>
            <p className="text-cafe-muted text-sm mt-1">Personalizá el contenido de la página principal</p>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2 px-4 py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors disabled:opacity-50 rounded-xl shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40"
          >
            <Save className="w-4 h-4" /> {saving ? 'GUARDANDO...' : saved ? 'GUARDADO' : 'GUARDAR'}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left: Edit Forms */}
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
            {/* 1. Hero */}
            <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
              <h2 className="font-display text-lg text-cafe-accent mb-4">1 · SECCIÓN HERO</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">SUBTÍTULO</label>
                  <input
                    type="text"
                    value={settings.hero_subtitle}
                    onChange={e => handleChange('hero_subtitle', e.target.value)}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">LÍNEA 1</label>
                    <input
                      type="text"
                      value={settings.hero_title_line1}
                      onChange={e => handleChange('hero_title_line1', e.target.value)}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">LÍNEA 2</label>
                    <input
                      type="text"
                      value={settings.hero_title_line2}
                      onChange={e => handleChange('hero_title_line2', e.target.value)}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">DESCRIPCIÓN</label>
                  <textarea
                    value={settings.hero_description}
                    onChange={e => handleChange('hero_description', e.target.value)}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent resize-none h-20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">TEXTO DEL BOTÓN</label>
                  <input
                    type="text"
                    value={settings.hero_button_text}
                    onChange={e => handleChange('hero_button_text', e.target.value)}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">IMAGEN DE FONDO</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={settings.hero_bg_image}
                      onChange={e => handleChange('hero_bg_image', e.target.value)}
                      className="flex-1 px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent"
                      placeholder="https://..."
                    />
                    <button
                      onClick={() => setPickerTarget('hero_bg_image')}
                      className="px-3 py-2 bg-cafe-surface border border-cafe-border text-cafe-muted hover:text-cafe-accent hover:border-cafe-accent transition-colors"
                      title="Seleccionar imagen"
                    >
                      <Image className="w-4 h-4" />
                    </button>
                  </div>
                  {settings.hero_bg_image && (
                    <div className="mt-2 aspect-[16/9] rounded overflow-hidden border border-cafe-border">
                      <img
                        src={settings.hero_bg_image}
                        alt="Fondo"
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Reserva */}
            <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
              <h2 className="font-display text-lg text-cafe-accent mb-4">2 · RESERVA</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">TÍTULO DE LA SECCIÓN</label>
                  <input
                    type="text"
                    value={settings.reserva_heading}
                    onChange={e => handleChange('reserva_heading', e.target.value)}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">DESCRIPCIÓN</label>
                  <textarea
                    value={settings.reserva_description}
                    onChange={e => handleChange('reserva_description', e.target.value)}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent resize-none h-20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">URL DE WHATSAPP</label>
                  <input
                    type="url"
                    value={settings.reserva_whatsapp_url}
                    onChange={e => handleChange('reserva_whatsapp_url', e.target.value)}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                    placeholder="https://wa.me/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">URL DE INSTAGRAM</label>
                  <input
                    type="url"
                    value={settings.reserva_instagram_url}
                    onChange={e => handleChange('reserva_instagram_url', e.target.value)}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>
            </div>

            {/* 3. Productos Recomendados */}
            <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg text-cafe-accent">3 · PRODUCTOS RECOMENDADOS</h2>
                <button
                  onClick={addRecommendedItem}
                  className="flex items-center gap-1 px-3 py-1.5 bg-cafe-accent text-white font-display text-xs tracking-wider hover:bg-cafe-burgundy-light transition-colors rounded-xl shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40"
                >
                  <Plus className="w-3 h-3" /> AGREGAR
                </button>
              </div>
              <div className="space-y-3">
                {(settings.recommended_items || []).length === 0 && (
                  <p className="text-cafe-muted text-sm text-center py-4">Sin productos recomendados. Agregá uno.</p>
                )}
                {(settings.recommended_items || []).map((item, index) => (
                  <div key={index} className="border border-cafe-border p-3">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-2 text-cafe-muted cursor-move">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-cafe-muted mb-1">NOMBRE</label>
                            <input
                              type="text"
                              value={item.name}
                              onChange={e => updateRecommendedItem(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent"
                              placeholder="Ej: Café Latte"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-cafe-muted mb-1">PRECIO</label>
                            <input
                              type="text"
                              value={item.price}
                              onChange={e => updateRecommendedItem(index, 'price', e.target.value)}
                              className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent"
                              placeholder="Ej: 2500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-cafe-muted mb-1">DESCRIPCIÓN</label>
                          <textarea
                            value={item.description}
                            onChange={e => updateRecommendedItem(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent resize-none h-16"
                            placeholder="Breve descripción del producto"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-cafe-muted mb-1">IMAGEN</label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={item.image_url}
                              onChange={e => updateRecommendedItem(index, 'image_url', e.target.value)}
                              className="flex-1 px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent"
                              placeholder="https://..."
                            />
                            <button
                              onClick={() => setPickerTarget(`recommended_${index}`)}
                              className="px-2 py-2 bg-cafe-bg border border-cafe-border text-cafe-muted hover:text-cafe-accent transition-colors"
                              title="Seleccionar imagen"
                            >
                              <Image className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => removeRecommendedItem(index)}
                              className="p-2 text-cafe-muted hover:text-cafe-burgundy-light transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {item.image_url && (
                          <div className="aspect-video rounded overflow-hidden border border-cafe-border bg-cafe-card">
                            <img
                              src={item.image_url}
                              alt={item.name || `Producto ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={e => { e.target.style.display = 'none' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {(settings.recommended_items || []).length > 1 && (
                <div className="flex gap-2 justify-end mt-3">
                  <button
                    onClick={() => moveRecommendedItem(
                      (settings.recommended_items || []).length - 1,
                      (settings.recommended_items || []).length - 2
                    )}
                    disabled={(settings.recommended_items || []).length < 2}
                    className="text-xs text-cafe-muted hover:text-cafe-text transition-colors disabled:opacity-30"
                  >
                    ↑ SUBIR
                  </button>
                  <button
                    onClick={() => moveRecommendedItem(0, 1)}
                    disabled={(settings.recommended_items || []).length < 2}
                    className="text-xs text-cafe-muted hover:text-cafe-text transition-colors disabled:opacity-30"
                  >
                    BAJAR ↓
                  </button>
                </div>
              )}
            </div>

            {/* 4. Galería */}
            <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
              <h2 className="font-display text-lg text-cafe-accent mb-4">4 · GALERÍA DE IMÁGENES Y VIDEOS</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-display tracking-wider text-cafe-muted">TEXTOS DECORATIVO (rotan cada 3.5s)</label>
                    <button onClick={addTagline} className="text-xs text-cafe-accent hover:text-cafe-burgundy-light flex items-center gap-1">
                      <Plus className="w-3 h-3" /> AGREGAR FRASE
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(settings.gallery_taglines || []).map((line, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={line}
                          onChange={e => updateTagline(idx, e.target.value)}
                          className="flex-1 px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent rounded-lg"
                          placeholder="Frase decorativa..."
                        />
                        {(settings.gallery_taglines || []).length > 1 && (
                          <button onClick={() => removeTagline(idx)} className="text-cafe-muted hover:text-red-400 p-1">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-display tracking-wider text-cafe-muted">IMÁGENES Y VIDEOS</span>
                    <p className="text-[10px] text-cafe-muted/60 mt-0.5">Podés pegar URLs de imágenes, YouTube o Vimeo</p>
                  </div>
                  <button
                    onClick={addGalleryImage}
                    className="flex items-center gap-1 px-3 py-1.5 bg-cafe-accent text-white font-display text-xs tracking-wider hover:bg-cafe-burgundy-light transition-colors rounded-xl shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40"
                  >
                    <Plus className="w-3 h-3" /> AGREGAR
                  </button>
                </div>
                <div className="space-y-3">
                  {(settings.gallery_images || []).length === 0 && (
                    <p className="text-cafe-muted text-sm text-center py-4">Sin elementos. Agregá una URL de imagen o video.</p>
                  )}
                  {(settings.gallery_images || []).map((url, index) => (
                    <div key={index} className="border border-cafe-border p-3">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-2 text-cafe-muted cursor-move">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="url"
                              value={url}
                              onChange={e => updateGalleryImage(index, e.target.value)}
                              className="flex-1 px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent"
                              placeholder="https://imagen.jpg, youtube.com/watch?v=... o vimeo.com/..."
                            />
                            <button
                              onClick={() => setPickerTarget(`gallery_${index}`)}
                              className="px-2 py-2 bg-cafe-bg border border-cafe-border text-cafe-muted hover:text-cafe-accent transition-colors"
                              title="Seleccionar imagen"
                            >
                              <Image className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => removeGalleryImage(index)}
                              className="p-2 text-cafe-muted hover:text-cafe-burgundy-light transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          {url && (
                            <div className="aspect-video rounded overflow-hidden border border-cafe-border bg-cafe-card">
                              {(() => {
                                if (/\.(mp4|webm|mov)$/i.test(url)) {
                                  return <video src={url} className="w-full h-full object-cover" controls playsInline />;
                                }
                                const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
                                const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
                                if (ytMatch) {
                                  return <iframe src={`https://www.youtube.com/embed/${ytMatch[1]}`} className="w-full h-full" allowFullScreen title={`Video ${index + 1}`} />;
                                }
                                if (vimeoMatch) {
                                  return <iframe src={`https://player.vimeo.com/video/${vimeoMatch[1]}`} className="w-full h-full" allowFullScreen title={`Video ${index + 1}`} />;
                                }
                                return <img src={url} alt={`Galería ${index + 1}`} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />;
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {(settings.gallery_images || []).length > 1 && (
                  <div className="flex gap-2 justify-end mt-3">
                    <button
                      onClick={() => moveGalleryImage(
                        (settings.gallery_images || []).length - 1,
                        (settings.gallery_images || []).length - 2
                      )}
                      disabled={(settings.gallery_images || []).length < 2}
                      className="text-xs text-cafe-muted hover:text-cafe-text transition-colors disabled:opacity-30"
                    >
                      ↑ SUBIR
                    </button>
                    <button
                      onClick={() => moveGalleryImage(0, 1)}
                      disabled={(settings.gallery_images || []).length < 2}
                      className="text-xs text-cafe-muted hover:text-cafe-text transition-colors disabled:opacity-30"
                    >
                      BAJAR ↓
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Encontranos */}
            <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
              <h2 className="font-display text-lg text-cafe-accent mb-4">5 · ENCONTRANOS</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">SUBTÍTULO (SCRIPT)</label>
                    <input
                      type="text"
                      value={settings.encontranos_subtitle}
                      onChange={e => handleChange('encontranos_subtitle', e.target.value)}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">TÍTULO DE SECCIÓN</label>
                    <input
                      type="text"
                      value={settings.encontranos_heading}
                      onChange={e => handleChange('encontranos_heading', e.target.value)}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">UBICACIÓN LÍNEA 1</label>
                    <input
                      type="text"
                      value={settings.location_line1}
                      onChange={e => handleChange('location_line1', e.target.value)}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">UBICACIÓN LÍNEA 2</label>
                    <input
                      type="text"
                      value={settings.location_line2}
                      onChange={e => handleChange('location_line2', e.target.value)}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">TÍTULO DEL MAPA (UBICACIÓN)</label>
                  <input
                    type="text"
                    value={settings.ubicacion_heading}
                    onChange={e => handleChange('ubicacion_heading', e.target.value)}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">URL EMBED DE GOOGLE MAPS</label>
                  <textarea
                    value={settings.maps_embed_url}
                    onChange={e => handleChange('maps_embed_url', e.target.value)}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent resize-none h-16"
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                </div>
              </div>
            </div>

            {/* 6. Sobre Nosotros */}
            <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
              <h2 className="font-display text-lg text-cafe-accent mb-4">6 · SOBRE NOSOTROS</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">SUBTÍTULO (SCRIPT)</label>
                    <input
                      type="text"
                      value={settings.nosotros_subtitle}
                      onChange={e => handleChange('nosotros_subtitle', e.target.value)}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">TÍTULO DE SECCIÓN</label>
                    <input
                      type="text"
                      value={settings.nosotros_heading}
                      onChange={e => handleChange('nosotros_heading', e.target.value)}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">PÁRRAFO 1 — HISTORIA</label>
                  <textarea
                    rows={3}
                    value={settings.about_story}
                    onChange={e => handleChange('about_story', e.target.value)}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">PÁRRAFO 2</label>
                  <textarea
                    rows={2}
                    value={settings.nosotros_paragraph2}
                    onChange={e => handleChange('nosotros_paragraph2', e.target.value)}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">PÁRRAFO 3</label>
                  <textarea
                    rows={2}
                    value={settings.nosotros_paragraph3}
                    onChange={e => handleChange('nosotros_paragraph3', e.target.value)}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent resize-none"
                  />
                </div>
                <div className="border-t border-cafe-border/40 pt-4">
                  <p className="text-xs font-display tracking-wider text-cafe-muted mb-3">INFORMACIÓN ADICIONAL</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">HORARIO SEMANA</label>
                      <input
                        type="text"
                        value={settings.hours_weekdays}
                        onChange={e => handleChange('hours_weekdays', e.target.value)}
                        className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">HORARIO FIN DE SEMANA</label>
                      <input
                        type="text"
                        value={settings.hours_weekends}
                        onChange={e => handleChange('hours_weekends', e.target.value)}
                        className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">CULTURA LÍNEA 1</label>
                      <input
                        type="text"
                        value={settings.culture_line1}
                        onChange={e => handleChange('culture_line1', e.target.value)}
                        className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">CULTURA LÍNEA 2</label>
                      <input
                        type="text"
                        value={settings.culture_line2}
                        onChange={e => handleChange('culture_line2', e.target.value)}
                        className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 7. Categorías del Menú */}
            <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-lg text-cafe-accent">7 · CATEGORÍAS DEL MENÚ</h2>
                <button
                  onClick={() => handleChange('menu_categories', [...(settings.menu_categories || []), ''])}
                  className="flex items-center gap-1 px-3 py-1.5 bg-cafe-accent text-white font-display text-xs tracking-wider hover:bg-cafe-burgundy-light transition-colors rounded-xl shadow-lg shadow-black/30"
                >
                  <Plus className="w-3 h-3" /> AGREGAR
                </button>
              </div>
              <p className="text-cafe-muted text-xs mb-4">Definí las categorías que aparecen en el menú. Arrastrá para reordenar.</p>
              <div className="space-y-2">
                {(settings.menu_categories || []).map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 text-center text-xs text-cafe-muted/50 font-display">{idx + 1}</span>
                    <input
                      type="text"
                      value={cat}
                      onChange={e => {
                        const updated = [...(settings.menu_categories || [])];
                        updated[idx] = e.target.value;
                        handleChange('menu_categories', updated);
                      }}
                      className="flex-1 px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent rounded-lg"
                      placeholder="Nombre de categoría"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (idx === 0) return;
                          const updated = [...(settings.menu_categories || [])];
                          [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                          handleChange('menu_categories', updated);
                        }}
                        disabled={idx === 0}
                        className="p-1.5 text-cafe-muted hover:text-cafe-text transition-colors disabled:opacity-20"
                        title="Subir"
                      >
                        <ChevronRight className="w-3.5 h-3.5 rotate-[-90deg]" />
                      </button>
                      <button
                        onClick={() => {
                          const updated = [...(settings.menu_categories || [])];
                          if (idx < updated.length - 1) {
                            [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
                            handleChange('menu_categories', updated);
                          }
                        }}
                        disabled={idx >= (settings.menu_categories || []).length - 1}
                        className="p-1.5 text-cafe-muted hover:text-cafe-text transition-colors disabled:opacity-20"
                        title="Bajar"
                      >
                        <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                      </button>
                      <button
                        onClick={() => {
                          const updated = [...(settings.menu_categories || [])];
                          updated.splice(idx, 1);
                          handleChange('menu_categories', updated);
                        }}
                        className="p-1.5 text-cafe-muted hover:text-cafe-burgundy-light transition-colors"
                        title="Eliminar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {(settings.menu_categories || []).length === 0 && (
                  <p className="text-cafe-muted text-xs text-center py-3">Sin categorías. Agregá una.</p>
                )}
              </div>
            </div>

            {/* 8. Tipos de Café */}
            <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-lg text-cafe-accent">7 · TIPOS DE CAFÉ</h2>
                <button
                  onClick={() => {
                    const items = settings.coffee_items || [];
                    const newKey = `custom_${Date.now()}`;
                    handleChange('coffee_items', [...items, { key: newKey, label: '' }]);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-cafe-accent text-white font-display text-xs tracking-wider hover:bg-cafe-burgundy-light transition-colors rounded-xl shadow-lg shadow-black/30"
                >
                  <Plus className="w-3 h-3" /> AGREGAR
                </button>
              </div>
              <p className="text-cafe-muted text-xs mb-5">Subí fotos personalizadas para cada café. Si dejás vacío, se muestra la ilustración SVG por defecto.</p>
              <div className="grid grid-cols-2 gap-3">
                {(settings.coffee_items || []).map(({ key, label }, idx) => {
                  const hasImage = !!settings.coffee_images?.[key];
                  return (
                    <div
                      key={key}
                      className={`group relative border rounded-xl overflow-hidden transition-all duration-200 ${
                        hasImage
                          ? 'border-cafe-accent/40 bg-cafe-bg'
                          : 'border-cafe-border/40 bg-cafe-bg/50'
                      }`}
                    >
                      <div className="aspect-[4/3] relative overflow-hidden bg-cafe-card">
                        {hasImage ? (
                          <img
                            src={settings.coffee_images[key]}
                            alt={label || key}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                            <Coffee className="w-6 h-6 text-cafe-muted/25" />
                            <span className="text-cafe-muted/30 text-[10px] font-display tracking-wider">SIN IMAGEN</span>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            const items = [...(settings.coffee_items || [])];
                            items.splice(idx, 1);
                            handleChange('coffee_items', items);
                            const images = { ...(settings.coffee_images || {}) };
                            delete images[key];
                            handleChange('coffee_images', images);
                          }}
                          className="absolute top-1.5 right-1.5 p-1 bg-black/50 rounded-lg text-white/70 hover:text-red-400 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                          title="Quitar café"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="px-3 py-2.5 space-y-2">
                        <input
                          type="text"
                          value={label}
                          onChange={e => {
                            const items = [...(settings.coffee_items || [])];
                            items[idx] = { ...items[idx], label: e.target.value };
                            handleChange('coffee_items', items);
                          }}
                          className="w-full px-2.5 py-1.5 bg-cafe-surface border border-cafe-border text-cafe-text text-xs font-display tracking-wide focus:outline-none focus:border-cafe-accent rounded-lg"
                          placeholder="Nombre del café"
                        />
                        <div className="flex items-center gap-1.5">
                          <input
                            type="url"
                            value={settings.coffee_images?.[key] || ''}
                            onChange={e => {
                              const updated = { ...(settings.coffee_images || {}), [key]: e.target.value };
                              handleChange('coffee_images', updated);
                            }}
                            className="flex-1 px-2.5 py-1.5 bg-cafe-surface border border-cafe-border text-cafe-text text-[11px] focus:outline-none focus:border-cafe-accent rounded-lg"
                            placeholder="https://..."
                          />
                          <button
                            onClick={() => setPickerTarget(`coffee_${key}`)}
                            className={`p-1.5 border rounded-lg transition-colors ${
                              hasImage
                                ? 'bg-cafe-accent/10 border-cafe-accent/30 text-cafe-accent'
                                : 'bg-cafe-surface border-cafe-border text-cafe-muted hover:text-cafe-accent hover:border-cafe-accent/40'
                            }`}
                            title="Seleccionar imagen"
                          >
                            <Image className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="xl:sticky xl:top-24 self-start border border-cafe-border">
            <div className="bg-cafe-bg">
              <div className="text-center py-2 bg-cafe-surface border-b border-cafe-border">
                <span className="text-xs font-display tracking-widest text-cafe-muted">VISTA PREVIA</span>
              </div>
              <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
                {/* Hero */}
                <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-cafe-burgundy/20 via-cafe-bg/50 to-cafe-bg" />
                    {settings.hero_bg_image && (
                      <div className="absolute inset-0" style={{
                        backgroundImage: `url('${settings.hero_bg_image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'grayscale(20%) brightness(0.4) saturate(1.2)'
                      }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-cafe-burgundy/10 to-transparent" />
                  </div>
                  <div className="relative z-10 text-center px-4 max-w-4xl pt-16 pb-8">
                    {settings.hero_subtitle && (
                      <p className="font-display text-cafe-cream text-sm sm:text-base mb-3 tracking-widest uppercase">
                        {settings.hero_subtitle}
                      </p>
                    )}
                    <h1 className="font-display text-5xl sm:text-7xl text-cafe-text mb-4 tracking-tight leading-none">
                      {settings.hero_title_line1 || 'CAFÉ'}
                      <br />
                      <span className="font-script text-cafe-accent text-5xl sm:text-7xl inline-block" style={{ fontWeight: 600 }}>
                        {settings.hero_title_line2 || 'Círculo'}
                      </span>
                    </h1>
                    {settings.hero_description && (
                      <p className="text-cafe-muted text-sm sm:text-base mb-6 max-w-xl mx-auto">
                        {settings.hero_description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-2 justify-center mb-6 text-xs sm:text-sm text-cafe-cream/70">
                      <Clock className="w-3.5 h-3.5 text-cafe-accent shrink-0" />
                      <span className="tracking-wide">{settings.hours_weekdays || 'Lun - Vie: 8:00 - 20:30'}</span>
                      <span className="text-cafe-muted-dark mx-1">·</span>
                      <span className="tracking-wide">{settings.hours_weekends || 'Sáb - Dom: 9:00 - 20:30'}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-cafe-accent text-white font-display text-sm tracking-wider rounded-full">
                      {settings.hero_button_text || 'VER MENÚ'} <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Reserva */}
                <div className="py-12 border-t border-cafe-border/60 text-center px-4">
                  <h2 className="font-display text-2xl sm:text-3xl text-cafe-text mb-4">{settings.reserva_heading || 'RESERVA'}</h2>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mb-6" />
                  <p className="text-cafe-muted text-sm max-w-xl mx-auto mb-6">
                    {settings.reserva_description || 'Contactanos para reservar tu lugar y disfrutar de una experiencia única.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-cafe-accent text-white font-display text-xs tracking-wider rounded-full">
                      RESERVAR POR WHATSAPP
                    </div>
                    <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-cafe-accent text-white font-display text-xs tracking-wider rounded-full">
                      INSTAGRAM
                    </div>
                  </div>
                </div>

                {/* Encontranos */}
                <div className="py-12 border-t border-cafe-border/60 px-4">
                  <div className="text-center mb-8">
                    <p className="font-script text-cafe-cream text-lg mb-1">{settings.encontranos_subtitle || 'Visitanos'}</p>
                    <h2 className="font-display text-2xl sm:text-3xl text-cafe-text">{settings.encontranos_heading || 'ENCONTRANOS'}</h2>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mt-3" />
                  </div>
                  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-cafe-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="font-display text-sm text-cafe-text mb-2">{settings.ubicacion_heading || 'UBICACIÓN'}</p>
                        <p className="text-cafe-muted text-sm">{settings.location_line1}</p>
                        <p className="text-cafe-muted text-sm">{settings.location_line2}</p>
                      </div>
                    </div>
                    <div className="aspect-[16/9] rounded-lg overflow-hidden border border-cafe-border/60 bg-cafe-card">
                      <iframe
                        src={settings.maps_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217847.3641164673!2d-64.37866564765623!3d-31.398478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942d7bca9b3a6c4f%3A0x9b0f5e5e5e5e5e5e!2sVilla%20Allende%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1'}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Sobre Nosotros */}
                <div className="py-12 border-t border-cafe-border/60 px-4">
                  <div className="text-center mb-8">
                    <p className="font-script text-cafe-cream text-lg mb-1">{settings.nosotros_subtitle || 'Nuestra historia'}</p>
                    <h2 className="font-display text-2xl sm:text-3xl text-cafe-text">{settings.nosotros_heading || 'SOBRE NOSOTROS'}</h2>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mt-3" />
                  </div>
                  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                    <div className="space-y-3">
                      <p className="text-cafe-muted text-sm">
                        {settings.about_story}
                      </p>
                      <p className="text-cafe-muted text-sm">
                        {settings.nosotros_paragraph2}
                      </p>
                      <p className="text-cafe-muted text-sm">
                        {settings.nosotros_paragraph3}
                      </p>
                      <div className="pt-3 space-y-2 border-t border-cafe-border/40">
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-cafe-accent shrink-0 mt-0.5" />
                          <div>
                            <p className="text-cafe-muted text-xs">{settings.hours_weekdays}</p>
                            <p className="text-cafe-muted text-xs">{settings.hours_weekends}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Music className="w-4 h-4 text-cafe-accent shrink-0 mt-0.5" />
                          <div>
                            <p className="text-cafe-muted text-xs">{settings.culture_line1}</p>
                            <p className="text-cafe-muted text-xs">{settings.culture_line2}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="aspect-[4/3] rounded overflow-hidden border border-cafe-border/60 bg-cafe-card">
                      {settings.hero_bg_image ? (
                        <img src={settings.hero_bg_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cafe-muted/40 text-xs">Imagen</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="py-12 border-t border-cafe-border/60 px-4">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-cafe-surface border border-cafe-border/60 rounded-xl overflow-hidden">
                      {(settings.recommended_items || []).filter(r => r.name).length > 0 ? (
                        <div className="p-6 space-y-3">
                          {(settings.recommended_items || []).filter(r => r.name).slice(0, 4).map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-cafe-card/50 rounded-xl">
                              <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-cafe-card">
                                {item.image_url ? (
                                  <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-cafe-muted/20">•</div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-display text-sm text-cafe-text truncate">{item.name}</p>
                              </div>
                              {item.price && <span className="font-display text-base text-cafe-accent">${item.price}</span>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32 text-cafe-muted/40 text-xs">Sin recomendaciones</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div className="py-12 border-t border-cafe-border/60 px-4">
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="text-center">
                      <p className="font-script text-cafe-burgundy text-2xl sm:text-3xl">{(settings.gallery_taglines || ['más que un café de especialidad,', 'una comunidad.'])[previewTaglineIdx % (settings.gallery_taglines || ['más que un café de especialidad,', 'una comunidad.']).length]}</p>
                    </div>
                    <div className="bg-cafe-surface border border-cafe-border/60 rounded-xl overflow-hidden">
                      {(settings.gallery_images || []).filter(Boolean).length > 0 ? (
                        (() => {
                          const firstItem = (settings.gallery_images || []).filter(Boolean)[0];
                          if (/\.(mp4|webm|mov)$/i.test(firstItem)) {
                            return (
                              <div className="aspect-[16/9] bg-cafe-card">
                                <video src={firstItem} className="w-full h-full object-cover" controls playsInline />
                              </div>
                            );
                          }
                          const ytMatch = firstItem.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
                          const vimeoMatch = firstItem.match(/vimeo\.com\/(\d+)/);
                          if (ytMatch) {
                            return (
                              <div className="aspect-[16/9] bg-cafe-card">
                                <iframe src={`https://www.youtube.com/embed/${ytMatch[1]}`} className="w-full h-full" allowFullScreen title="Galería" />
                              </div>
                            );
                          }
                          if (vimeoMatch) {
                            return (
                              <div className="aspect-[16/9] bg-cafe-card">
                                <iframe src={`https://player.vimeo.com/video/${vimeoMatch[1]}`} className="w-full h-full" allowFullScreen title="Galería" />
                              </div>
                            );
                          }
                          return (
                            <div className="aspect-[16/9] bg-cafe-card flex items-center justify-center">
                              <img src={firstItem} alt="" className="w-full h-full object-cover" />
                            </div>
                          );
                        })()
                      ) : (
                        <div className="flex items-center justify-center h-40 text-cafe-muted/40 text-xs">Sin imágenes</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {pickerTarget && (
        <ImagePicker
          value={
            pickerTarget === 'hero_bg_image'
              ? settings.hero_bg_image
              : pickerTarget.startsWith('coffee_')
                ? (settings.coffee_images || {})[pickerTarget.replace('coffee_', '')] || ''
                : pickerTarget.startsWith('gallery_')
                  ? (settings.gallery_images || [])[parseInt(pickerTarget.split('_')[1])] || ''
                  : (settings.recommended_items || [])[parseInt(pickerTarget.split('_')[1])]?.image_url || ''
          }
          onChange={(url) => {
            if (pickerTarget === 'hero_bg_image') {
              handleChange('hero_bg_image', url);
            } else if (pickerTarget.startsWith('coffee_')) {
              const key = pickerTarget.replace('coffee_', '');
              const updated = { ...(settings.coffee_images || {}), [key]: url };
              handleChange('coffee_images', updated);
            } else if (pickerTarget.startsWith('gallery_')) {
              const idx = parseInt(pickerTarget.split('_')[1]);
              updateGalleryImage(idx, url);
            } else {
              const idx = parseInt(pickerTarget.split('_')[1]);
              updateRecommendedItem(idx, 'image_url', url);
            }
            setPickerTarget(null);
          }}
          onClose={() => setPickerTarget(null)}
        />
      )}
    </div>
  );
}
