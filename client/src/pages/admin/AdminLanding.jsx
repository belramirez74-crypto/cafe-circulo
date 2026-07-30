import { useEffect, useState, useCallback } from 'react';
import {
  Save, Eye, EyeOff, Plus, X, GripVertical, ChevronDown, ChevronUp,
  Image, Coffee, MapPin, Phone, Star, FileText, Utensils, Layout
} from 'lucide-react';
import { getLandingSettings, updateLandingSettings, getRecommendedItems, getAllMenuItems } from '../../lib/api';
import ImagePicker from '../../components/ImagePicker';
import HeroSection from '../../components/sections/HeroSection';
import CoffeeTypesSection from '../../components/sections/CoffeeTypesSection';
import ReservaSection from '../../components/sections/ReservaSection';
import GallerySection from '../../components/sections/GallerySection';
import EncontranosSection from '../../components/sections/EncontranosSection';
import RecommendationsSection from '../../components/sections/RecommendationsSection';
import TextImageSection from '../../components/sections/TextImageSection';
import MenuItemsSection from '../../components/sections/MenuItemsSection';

const MODULE_DEFS = [
  { type: 'hero', label: 'Hero Banner', icon: Layout, defaultVisible: true },
  { type: 'recommendations', label: 'Recomendaciones', icon: Star, defaultVisible: true },
  { type: 'coffee_types', label: 'Tipos de Café', icon: Coffee, defaultVisible: true },
  { type: 'reservas', label: 'Reservas', icon: Phone, defaultVisible: true },
  { type: 'gallery', label: 'Galería', icon: Image, defaultVisible: true },
  { type: 'text_image', label: 'Texto + Imagen', icon: FileText, defaultVisible: false },
  { type: 'menu_items', label: 'Items del Menú', icon: Utensils, defaultVisible: false },
  { type: 'encuentranos', label: 'Encontranos', icon: MapPin, defaultVisible: true },
];

function makeModule(type) {
  const def = MODULE_DEFS.find(m => m.type === type);
  const base = { id: `${type}_${Date.now()}`, type, visible: def?.defaultVisible ?? true };
  if (type === 'recommendations') return { ...base, title: 'Recomendaciones', subtitle: '' };
  if (type === 'text_image') return { ...base, title: '', subtitle: '', paragraph: '', cta_text: '', cta_link: '', image_url: '', image_align: 'right' };
  if (type === 'menu_items') return { ...base, title: 'Nuestro Menú', subtitle: '', button_text: 'Ver menú completo', item_ids: [] };
  return base;
}

const EMPTY = {
  hero_subtitle: '', hero_title_line1: 'CAFÉ', hero_title_line2: 'Círculo', hero_description: '', hero_bg_image: '', hero_button_text: 'VER MENÚ',
  reserva_heading: 'RESERVA', reserva_description: '', reserva_whatsapp_url: '', reserva_instagram_url: '',
  gallery_images: '[]', gallery_taglines: '[""]',
  encontranos_subtitle: '', encontranos_heading: 'ENCONTRANOS', ubicacion_heading: 'UBICACIÓN', location_line1: '', location_line2: '', maps_embed_url: '',
  coffee_images: '{}', coffee_items: '[]',
  menu_categories: '[]', menu_categories_en: '[]',
  modules: '[]',
};

export default function AdminLanding() {
  const [settings, setSettings] = useState(null);
  const [original, setOriginal] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [preview, setPreview] = useState(false);
  const [pickerTarget, setPickerTarget] = useState(null);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);

  useEffect(() => {
    getLandingSettings().then(r => {
      const s = r.data;
      if (!s.modules || !Array.isArray(s.modules) || s.modules.length === 0) {
        s.modules = MODULE_DEFS.map(m => makeModule(m.type));
      }
      setSettings(s);
      setOriginal(JSON.parse(JSON.stringify(s)));
      if (s.modules.length > 0) setSelectedId(s.modules[0].id);
    }).catch(() => {});
    getRecommendedItems().then(r => setRecommendedItems(r.data)).catch(() => {});
    getAllMenuItems().then(r => setAllMenuItems(r.data)).catch(() => {});
  }, []);

  const modules = settings?.modules || [];

  const handleChange = useCallback((key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  }, []);

  const updateModule = useCallback((id, patch) => {
    setSettings(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === id ? { ...m, ...patch } : m),
    }));
  }, []);

  const addModule = useCallback((type) => {
    const m = makeModule(type);
    setSettings(prev => ({ ...prev, modules: [...prev.modules, m] }));
    setSelectedId(m.id);
  }, []);

  const removeModule = useCallback((id) => {
    setSettings(prev => {
      const mods = prev.modules.filter(m => m.id !== id);
      if (selectedId === id) setSelectedId(mods.length > 0 ? mods[0].id : null);
      return { ...prev, modules: mods };
    });
  }, [selectedId]);

  const toggleVisibility = useCallback((id) => {
    setSettings(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === id ? { ...m, visible: !m.visible } : m),
    }));
  }, []);

  const moveModule = useCallback((from, to) => {
    if (to < 0 || to >= modules.length) return;
    const mods = [...modules];
    const [removed] = mods.splice(from, 1);
    mods.splice(to, 0, removed);
    setSettings(prev => ({ ...prev, modules: mods }));
  }, [modules]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await updateLandingSettings(settings);
      setSettings(res.data);
      setOriginal(JSON.parse(JSON.stringify(res.data)));
    } catch (e) {
      alert('Error al guardar');
    }
    setSaving(false);
  }, [settings]);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(original);
  const selectedModule = modules.find(m => m.id === selectedId);

  const availableTypes = MODULE_DEFS.filter(d => !modules.find(m => m.type === d.type));

  const pickImage = (handler) => setPickerTarget({ handler });
  const handlePicked = (url) => {
    if (!pickerTarget?.handler) return;
    pickerTarget.handler(url);
    setPickerTarget(null);
  };

  if (!settings) return <div className="p-8 text-cafe-muted">Cargando...</div>;

  return (
    <div className="min-h-screen bg-cafe-bg">
      {/* Toolbar */}
      <div className="sticky top-0 z-30 bg-cafe-surface border-b border-cafe-border px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
        <h1 className="font-display text-lg text-cafe-text">Constructor de Landing Page</h1>
        <div className="flex items-center gap-2">
          {availableTypes.length > 0 && (
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-cafe-accent text-white text-sm rounded-lg hover:opacity-90 transition-colors">
                <Plus className="w-4 h-4" /> Módulo
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-cafe-surface border border-cafe-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {availableTypes.map(d => (
                  <button key={d.type} onClick={() => addModule(d.type)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-cafe-text hover:bg-cafe-bg transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    <d.icon className="w-4 h-4 text-cafe-accent" /> {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-cafe-border text-cafe-text text-sm rounded-lg hover:bg-cafe-bg transition-colors"
          >
            {preview ? 'Editar' : 'Vista previa'}
          </button>
          <button onClick={handleSave} disabled={!hasChanges || saving}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              hasChanges && !saving ? 'bg-cafe-accent text-white hover:opacity-90' : 'bg-cafe-border/50 text-cafe-muted cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" /> {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-0">
        {/* Module list */}
        <div className="w-full lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-cafe-border shrink-0">
          <div className="p-3 space-y-2">
            {modules.map((mod, idx) => {
              const def = MODULE_DEFS.find(d => d.type === mod.type);
              const isSelected = selectedId === mod.id;
              return (
                <div
                  key={mod.id}
                  draggable
                  onDragStart={() => setDragIdx(idx)}
                  onDragOver={e => { e.preventDefault(); }}
                  onDrop={() => { if (dragIdx !== null && dragIdx !== idx) { moveModule(dragIdx, idx); setDragIdx(null); } }}
                  onDragEnd={() => setDragIdx(null)}
                  className={`group flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected ? 'border-cafe-accent bg-cafe-accent/10' : 'border-cafe-border/60 bg-cafe-surface hover:border-cafe-border'
                  } ${mod.visible ? 'opacity-100' : 'opacity-50'}`}
                  onClick={() => setSelectedId(mod.id)}
                >
                  <GripVertical className="w-4 h-4 text-cafe-muted/40 shrink-0 cursor-grab active:cursor-grabbing" />
                  <def.icon className="w-4 h-4 text-cafe-accent shrink-0" />
                  <span className="flex-1 text-sm font-display text-cafe-text truncate">{def?.label || mod.type}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleVisibility(mod.id)} title={mod.visible ? 'Ocultar' : 'Mostrar'}>
                      {mod.visible ? <EyeOff className="w-3.5 h-3.5 text-cafe-muted hover:text-cafe-text" /> : <Eye className="w-3.5 h-3.5 text-cafe-muted hover:text-cafe-text" />}
                    </button>
                    <button onClick={() => removeModule(mod.id)} title="Eliminar">
                      <X className="w-3.5 h-3.5 text-cafe-muted hover:text-red-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor / Preview */}
        <div className="flex-1 min-w-0">
          {preview ? (
            <div className="p-4">
              <PagePreview settings={settings} recommendedItems={recommendedItems} allMenuItems={allMenuItems} />
            </div>
          ) : selectedModule ? (
            <div className="p-4 max-w-3xl">
              <ModuleEditor
                module={selectedModule}
                settings={settings}
                onChange={handleChange}
                onUpdateModule={updateModule}
                pickImage={pickImage}
                recommendedItems={recommendedItems}
                allMenuItems={allMenuItems}
              />
            </div>
          ) : (
            <div className="p-8 text-center text-cafe-muted">Seleccioná un módulo para editarlo</div>
          )}
        </div>
      </div>

      {pickerTarget && (
        <ImagePicker
          onSelect={handlePicked}
          onClose={() => setPickerTarget(null)}
        />
      )}
    </div>
  );
}

/* ---------- MODULE EDITOR ---------- */
function ModuleEditor({ module, settings, onChange, onUpdateModule, pickImage, recommendedItems, allMenuItems }) {
  const { type } = module;

  if (type === 'hero') return <HeroEditor settings={settings} onChange={onChange} pickImage={pickImage} />;
  if (type === 'recommendations') return <RecommendationsEditor module={module} onUpdateModule={onUpdateModule} recommendedItems={recommendedItems} />;
  if (type === 'coffee_types') return <CoffeeTypesEditor settings={settings} onChange={onChange} pickImage={pickImage} />;
  if (type === 'reservas') return <ReservasEditor settings={settings} onChange={onChange} />;
  if (type === 'gallery') return <GalleryEditor settings={settings} onChange={onChange} pickImage={pickImage} />;
  if (type === 'text_image') return <TextImageEditor module={module} onUpdateModule={onUpdateModule} pickImage={pickImage} />;
  if (type === 'menu_items') return <MenuItemsEditor module={module} onUpdateModule={onUpdateModule} allMenuItems={allMenuItems} />;
  if (type === 'encuentranos') return <EncontranosEditor settings={settings} onChange={onChange} />;
  return null;
}

/* ---------- HERO EDITOR ---------- */
function HeroEditor({ settings, onChange, pickImage }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-cafe-text mb-4">Hero Banner</h2>
      <Field label="Subtítulo" value={settings.hero_subtitle} onChange={v => onChange('hero_subtitle', v)} />
      <Field label="Título línea 1" value={settings.hero_title_line1} onChange={v => onChange('hero_title_line1', v)} />
      <Field label="Título línea 2" value={settings.hero_title_line2} onChange={v => onChange('hero_title_line2', v)} />
      <FieldArea label="Descripción" value={settings.hero_description} onChange={v => onChange('hero_description', v)} />
      <Field label="Texto del botón" value={settings.hero_button_text} onChange={v => onChange('hero_button_text', v)} />
      <ImageField label="Imagen de fondo" value={settings.hero_bg_image} onPick={() => pickImage(url => onChange('hero_bg_image', url))} onRemove={() => onChange('hero_bg_image', '')} />
    </div>
  );
}

/* ---------- RECOMMENDATIONS EDITOR ---------- */
function RecommendationsEditor({ module, onUpdateModule, recommendedItems }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-cafe-text mb-4">Recomendaciones</h2>
      <Field label="Título" value={module.title || ''} onChange={v => onUpdateModule(module.id, { title: v })} />
      <Field label="Subtítulo" value={module.subtitle || ''} onChange={v => onUpdateModule(module.id, { subtitle: v })} />
      <div>
        <p className="text-sm text-cafe-muted mb-2">Items recomendados (marcados como RECOMENDADOS en el menú)</p>
        <p className="text-xs text-cafe-muted/60">Andá a Menú → Editar item → marcar "Recomendado"</p>
        {recommendedItems.length === 0 ? (
          <p className="text-sm text-cafe-muted/40 mt-2">No hay items recomendados todavía</p>
        ) : (
          <div className="mt-2 space-y-1">
            {recommendedItems.map(item => (
              <div key={item.id} className="flex items-center gap-2 text-sm text-cafe-text bg-cafe-bg rounded px-2 py-1">
                <Star className="w-3 h-3 text-cafe-accent shrink-0" />
                <span className="truncate">{item.name}</span>
                <span className="text-cafe-muted text-xs ml-auto">${item.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- COFFEE TYPES EDITOR ---------- */
function CoffeeTypesEditor({ settings, onChange, pickImage }) {
  const items = Array.isArray(settings.coffee_items) ? settings.coffee_items : [];
  const images = settings.coffee_images || {};

  const updateItem = (idx, patch) => {
    const next = items.map((it, i) => i === idx ? { ...it, ...patch } : it);
    onChange('coffee_items', next);
  };
  const addItem = () => {
    onChange('coffee_items', [...items, { key: `custom_${Date.now()}`, label: '' }]);
  };
  const removeItem = (idx) => {
    const next = items.filter((_, i) => i !== idx);
    onChange('coffee_items', next);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-cafe-text mb-4">Tipos de Café</h2>
      {items.map((item, idx) => (
        <div key={item.key} className="flex items-start gap-2 bg-cafe-bg rounded-xl p-3">
          <div className="flex-1 space-y-2">
            <Field label="Nombre" value={item.label || ''} onChange={v => updateItem(idx, { label: v })} />
            {images[item.key] && (
              <div className="relative inline-block">
                <img src={images[item.key]} alt="" className="w-16 h-16 object-cover rounded" />
                <button onClick={() => onChange('coffee_images', { ...images, [item.key]: '' })}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                ><X className="w-3 h-3" /></button>
              </div>
            )}
            <button onClick={() => pickImage(url => onChange('coffee_images', { ...images, [item.key]: url }))}
              className="text-xs text-cafe-accent hover:underline"
            >{images[item.key] ? 'Cambiar imagen' : 'Agregar imagen'}</button>
          </div>
          <button onClick={() => removeItem(idx)} className="p-1 text-cafe-muted hover:text-red-400 mt-1"><X className="w-4 h-4" /></button>
        </div>
      ))}
      <button onClick={addItem} className="flex items-center gap-1 text-sm text-cafe-accent hover:underline">
        <Plus className="w-4 h-4" /> Agregar tipo de café
      </button>
    </div>
  );
}

/* ---------- RESERVAS EDITOR ---------- */
function ReservasEditor({ settings, onChange }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-cafe-text mb-4">Reservas</h2>
      <Field label="Título" value={settings.reserva_heading} onChange={v => onChange('reserva_heading', v)} />
      <FieldArea label="Descripción" value={settings.reserva_description} onChange={v => onChange('reserva_description', v)} />
      <Field label="WhatsApp URL" value={settings.reserva_whatsapp_url} onChange={v => onChange('reserva_whatsapp_url', v)} />
      <Field label="Instagram URL" value={settings.reserva_instagram_url} onChange={v => onChange('reserva_instagram_url', v)} />
    </div>
  );
}

/* ---------- GALLERY EDITOR ---------- */
function GalleryEditor({ settings, onChange, pickImage }) {
  const images = safeJson(settings.gallery_images);
  const taglines = safeJson(settings.gallery_taglines);

  const addImage = () => pickImage(url => {
    const next = [...images, url];
    onChange('gallery_images', JSON.stringify(next));
  });
  const updateImage = (idx, url) => {
    const next = images.map((i, n) => n === idx ? url : i);
    onChange('gallery_images', JSON.stringify(next));
  };
  const removeImage = (idx) => {
    onChange('gallery_images', JSON.stringify(images.filter((_, i) => i !== idx)));
  };
  const addTagline = () => onChange('gallery_taglines', JSON.stringify([...taglines, '']));
  const updateTagline = (idx, v) => {
    onChange('gallery_taglines', JSON.stringify(taglines.map((t, i) => i === idx ? v : t)));
  };
  const removeTagline = (idx) => {
    onChange('gallery_taglines', JSON.stringify(taglines.filter((_, i) => i !== idx)));
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-cafe-text mb-4">Galería</h2>
      <div>
        <p className="text-sm text-cafe-muted mb-2">Taglines (rotan automáticamente)</p>
        {taglines.map((t, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input value={t} onChange={e => updateTagline(idx, e.target.value)}
              className="flex-1 bg-cafe-bg border border-cafe-border rounded-lg px-3 py-1.5 text-sm text-cafe-text focus:outline-none focus:border-cafe-accent"
            />
            <button onClick={() => removeTagline(idx)}><X className="w-4 h-4 text-cafe-muted hover:text-red-400" /></button>
          </div>
        ))}
        <button onClick={addTagline} className="text-xs text-cafe-accent hover:underline">+ Agregar tagline</button>
      </div>
      <div>
        <p className="text-sm text-cafe-muted mb-2">Imágenes / Videos</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((url, idx) => (
            <div key={idx} className="relative aspect-video bg-cafe-bg rounded-lg overflow-hidden group">
              {url ? (
                isVideoUrl(url) ? (
                  <iframe src={getVideoEmbed(url)} className="w-full h-full" allowFullScreen />
                ) : (
                  <img src={url} alt="" className="w-full h-full object-cover" />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-cafe-muted/30">
                  <Image className="w-6 h-6" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => pickImage(url => updateImage(idx, url))} className="p-1 bg-white/20 rounded text-white text-xs">Cambiar</button>
                <button onClick={() => removeImage(idx)} className="p-1 bg-red-500/60 rounded text-white text-xs">X</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addImage} className="mt-2 text-xs text-cafe-accent hover:underline">+ Agregar imagen/video</button>
        <p className="text-xs text-cafe-muted/40 mt-1">Soportado: imágenes, YouTube, Vimeo, MP4 directo</p>
      </div>
    </div>
  );
}

/* ---------- TEXT + IMAGE EDITOR ---------- */
function TextImageEditor({ module, onUpdateModule, pickImage }) {
  const align = module.image_align || 'right';
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-cafe-text mb-4">Texto + Imagen</h2>
      <Field label="Título" value={module.title || ''} onChange={v => onUpdateModule(module.id, { title: v })} />
      <Field label="Subtítulo" value={module.subtitle || ''} onChange={v => onUpdateModule(module.id, { subtitle: v })} />
      <FieldArea label="Párrafo" value={module.paragraph || ''} onChange={v => onUpdateModule(module.id, { paragraph: v })} />
      <Field label="Texto del botón (CTA)" value={module.cta_text || ''} onChange={v => onUpdateModule(module.id, { cta_text: v })} />
      <Field label="Link del botón" value={module.cta_link || ''} onChange={v => onUpdateModule(module.id, { cta_link: v })} />
      <ImageField label="Imagen" value={module.image_url || ''} onPick={() => pickImage(url => onUpdateModule(module.id, { image_url: url }))} onRemove={() => onUpdateModule(module.id, { image_url: '' })} />
      <div>
        <p className="text-sm text-cafe-muted mb-1">Alineación de la imagen</p>
        <select value={align} onChange={e => onUpdateModule(module.id, { image_align: e.target.value })}
          className="bg-cafe-bg border border-cafe-border rounded-lg px-3 py-1.5 text-sm text-cafe-text focus:outline-none focus:border-cafe-accent"
        >
          <option value="right">Derecha</option>
          <option value="left">Izquierda</option>
        </select>
      </div>
    </div>
  );
}

/* ---------- MENU ITEMS EDITOR ---------- */
function MenuItemsEditor({ module, onUpdateModule, allMenuItems }) {
  const itemIds = module.item_ids || [];
  const selectedItems = allMenuItems.filter(it => itemIds.includes(it.id));
  const availableItems = allMenuItems.filter(it => !itemIds.includes(it.id));

  const toggleItem = (id) => {
    const next = itemIds.includes(id) ? itemIds.filter(i => i !== id) : [...itemIds, id];
    onUpdateModule(module.id, { item_ids: next });
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-cafe-text mb-4">Items del Menú</h2>
      <Field label="Título" value={module.title || ''} onChange={v => onUpdateModule(module.id, { title: v })} />
      <Field label="Subtítulo" value={module.subtitle || ''} onChange={v => onUpdateModule(module.id, { subtitle: v })} />
      <Field label="Texto del botón" value={module.button_text || 'Ver menú completo'} onChange={v => onUpdateModule(module.id, { button_text: v })} />
      <div>
        <p className="text-sm text-cafe-muted mb-2">Items a mostrar ({selectedItems.length} seleccionados)</p>
        <div className="max-h-60 overflow-y-auto space-y-1 border border-cafe-border rounded-xl p-2">
          {allMenuItems.map(item => (
            <label key={item.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-cafe-bg cursor-pointer text-sm">
              <input type="checkbox" checked={itemIds.includes(item.id)} onChange={() => toggleItem(item.id)}
                className="accent-cafe-accent"
              />
              <span className="text-cafe-text truncate">{item.name}</span>
              <span className="text-cafe-muted text-xs ml-auto">${item.price}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- ENCONTRANOS EDITOR ---------- */
function EncontranosEditor({ settings, onChange }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-cafe-text mb-4">Encontranos</h2>
      <Field label="Subtítulo" value={settings.encontranos_subtitle} onChange={v => onChange('encontranos_subtitle', v)} />
      <Field label="Título" value={settings.encontranos_heading} onChange={v => onChange('encontranos_heading', v)} />
      <Field label="Título ubicación" value={settings.ubicacion_heading} onChange={v => onChange('ubicacion_heading', v)} />
      <Field label="Dirección línea 1" value={settings.location_line1} onChange={v => onChange('location_line1', v)} />
      <Field label="Dirección línea 2" value={settings.location_line2} onChange={v => onChange('location_line2', v)} />
      <FieldArea label="Google Maps Embed URL" value={settings.maps_embed_url} onChange={v => onChange('maps_embed_url', v)} />
    </div>
  );
}

/* ---------- HELPERS ---------- */
function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-cafe-muted mb-1">{label}</label>
      <input value={value || ''} onChange={e => onChange(e.target.value)}
        className="w-full bg-cafe-bg border border-cafe-border rounded-lg px-3 py-2 text-sm text-cafe-text focus:outline-none focus:border-cafe-accent transition-colors"
      />
    </div>
  );
}

function FieldArea({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-cafe-muted mb-1">{label}</label>
      <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3}
        className="w-full bg-cafe-bg border border-cafe-border rounded-lg px-3 py-2 text-sm text-cafe-text focus:outline-none focus:border-cafe-accent transition-colors resize-y"
      />
    </div>
  );
}

function ImageField({ label, value, onPick, onRemove }) {
  return (
    <div>
      <label className="block text-sm text-cafe-muted mb-1">{label}</label>
      {value && (
        <div className="relative inline-block mb-2">
          <img src={value} alt="" className="h-24 w-auto rounded-lg object-cover" />
          <button onClick={onRemove} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"><X className="w-3 h-3" /></button>
        </div>
      )}
      <button onClick={onPick} className="block text-xs text-cafe-accent hover:underline">
        {value ? 'Cambiar imagen' : 'Seleccionar imagen'}
      </button>
    </div>
  );
}

function safeJson(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

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

/* ---------- PAGE PREVIEW ---------- */
function PagePreview({ settings, recommendedItems, allMenuItems }) {
  const modules = settings?.modules || [];
  if (!modules.length) return <div className="text-cafe-muted text-center py-8">No hay módulos</div>;

  return (
    <div className="min-h-screen pt-20">
      {modules.filter(m => m.visible).map(mod => {
        return <ModuleRenderer key={mod.id} module={mod} settings={settings} recommendedItems={recommendedItems} allMenuItems={allMenuItems} />;
      })}
    </div>
  );
}

function ModuleRenderer({ module: mod, settings, recommendedItems, allMenuItems }) {
  const { type } = mod;

  switch (type) {
    case 'hero':
      return <HeroSection settings={settings} />;

    case 'recommendations':
      if (!recommendedItems.length) return null;
      return (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            {mod.title && (
              <div className="text-center mb-10">
                <p className="font-script text-cafe-cream text-4xl sm:text-5xl">{mod.title}</p>
                {mod.subtitle && <p className="font-display text-sm tracking-widest text-cafe-muted mt-2">{mod.subtitle}</p>}
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cafe-accent to-transparent mx-auto mt-3" />
              </div>
            )}
            <RecommendationsSection items={recommendedItems} />
          </div>
        </section>
      );

    case 'coffee_types':
      return <CoffeeTypesSection settings={settings} />;

    case 'reservas':
      return (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <ReservaSection settings={settings} />
          </div>
        </section>
      );

    case 'gallery':
      return (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <GallerySection settings={settings} />
          </div>
        </section>
      );

    case 'text_image':
      return <TextImageSection module={mod} />;

    case 'menu_items':
      if (!mod.item_ids?.length) return null;
      const items = allMenuItems.filter(it => mod.item_ids.includes(it.id));
      return <MenuItemsSection module={mod} items={items} />;

    case 'encuentranos':
      return <EncontranosSection settings={settings} />;

    default:
      return null;
  }
}
