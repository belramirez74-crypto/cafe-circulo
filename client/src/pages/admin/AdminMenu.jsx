import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, getLandingSettings, updateLandingSettings } from '../../lib/api';
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, Star, Upload, FileSpreadsheet, Check, Image, Coffee, Cookie, Sandwich, CupSoda, Save } from 'lucide-react';
import ImagePicker from '../../components/ImagePicker';

const emptyForm = { name: '', description: '', description_en: '', price: '', category: 'Cafetería', image_url: '', stock: true, featured: false };

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(['Cafetería', 'Dulces', 'Saladitos', 'Bebidas']);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [editingCats, setEditingCats] = useState(false);
  const [catDraft, setCatDraft] = useState([]);
  const [catSaving, setCatSaving] = useState(false);

  // Quick add
  const [quickAdd, setQuickAdd] = useState(false);
  const [quick, setQuick] = useState({ name: '', price: '', category: 'Cafetería', image_url: '' });
  const [quickSaving, setQuickSaving] = useState(false);
  const [pickerTarget, setPickerTarget] = useState(null);
  const quickRef = useRef(null);

  // Excel import
  const [showImport, setShowImport] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const fileRef = useRef(null);

  const loadItems = () => {
    getAllMenuItems().then(res => setItems(res.data)).catch(() => {});
  };

  useEffect(() => {
    loadItems();
    getLandingSettings()
      .then(res => {
        const cats = res.data?.menu_mgmt_categories;
        if (cats?.length > 0) {
          setCategories(cats);
        }
      })
      .catch(() => {});
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({ ...item, price: item.price.toString() });
    setEditing(item.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      if (editing) {
        await updateMenuItem(editing, payload);
      } else {
        await createMenuItem(payload);
      }
      setShowForm(false);
      setEditing(null);
      loadItems();
    } catch (err) {
      alert('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar "${name}"?`)) return;
    try {
      await deleteMenuItem(id);
      loadItems();
    } catch {
      alert('Error al eliminar');
    }
  };

  const toggleStock = async (item) => {
    try {
      await updateMenuItem(item.id, { stock: !item.stock });
      loadItems();
    } catch {
      alert('Error al actualizar stock');
    }
  };

  const toggleFeatured = async (item) => {
    try {
      await updateMenuItem(item.id, { featured: !item.featured });
      loadItems();
    } catch {
      alert('Error al actualizar destacado');
    }
  };

  // Quick add
  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quick.name.trim() || !quick.price) return;
    setQuickSaving(true);
    try {
      await createMenuItem({ ...quick, price: parseFloat(quick.price), description: '', stock: true, featured: false });
      setQuick({ name: '', price: '', category: quick.category, image_url: '' });
      loadItems();
      if (quickRef.current) quickRef.current.focus();
    } catch {
      alert('Error al crear item');
    }
    setQuickSaving(false);
  };

  // Excel import
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    e.target.value = '';
  };

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/menu/import', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al importar');
      alert(`Se importaron ${data.imported} items correctamente`);
      setImportFile(null);
      setShowImport(false);
      loadItems();
    } catch (err) {
      alert(err.message || 'Error al importar');
    }
    setImporting(false);
  };

  // Group items by category
  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  const allCats = [...new Set([...categories, ...Object.keys(grouped)])];
  const filteredGrouped = activeFilter === 'Todos'
    ? grouped
    : { [activeFilter]: grouped[activeFilter] || [] };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-cafe-text">GESTIÓN DE MENÚ</h1>
            <p className="text-cafe-muted text-sm mt-1">{items.length} items en total</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowImport(true); setImportFile(null); }}
              className="flex items-center gap-2 px-4 py-2 border border-cafe-border text-cafe-text font-display text-sm tracking-wider hover:bg-cafe-bg transition-colors rounded-xl"
            >
              <FileSpreadsheet className="w-4 h-4" /> IMPORTAR EXCEL
            </button>
            <button
              onClick={() => setQuickAdd(!quickAdd)}
              className={`flex items-center gap-2 px-4 py-2 font-display text-sm tracking-wider transition-colors rounded-xl ${quickAdd ? 'bg-green-600 text-white' : 'border border-cafe-border text-cafe-text hover:bg-cafe-bg'}`}
            >
              <Plus className="w-4 h-4" /> CARGA RÁPIDA
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-[#5c1514] text-white font-display text-sm tracking-wider hover:bg-[#731c1a] transition-colors rounded-xl shadow-lg shadow-black/30"
            >
              <Plus className="w-4 h-4" /> NUEVO ITEM
            </button>
          </div>
        </div>

        {/* Quick Add Panel */}
        <AnimatePresence>
          {quickAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <form onSubmit={handleQuickAdd} className="bg-cafe-surface border border-cafe-border p-4 rounded-xl flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">NOMBRE</label>
                  <input
                    ref={quickRef}
                    type="text"
                    value={quick.name}
                    onChange={e => setQuick({ ...quick, name: e.target.value })}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-[#5c1514] rounded-lg"
                    placeholder="Ej: Cortado"
                    required
                    autoFocus
                  />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">PRECIO</label>
                  <input
                    type="number"
                    step="0.01"
                    value={quick.price}
                    onChange={e => setQuick({ ...quick, price: e.target.value })}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-[#5c1514] rounded-lg"
                    placeholder="1500"
                    required
                  />
                </div>
                <div className="w-40">
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">CATEGORÍA</label>
                  <select
                    value={quick.category}
                    onChange={e => setQuick({ ...quick, category: e.target.value })}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-[#5c1514] rounded-lg"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex-1 max-w-xs">
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">IMAGEN</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPickerTarget('quick_image')}
                      className="flex items-center gap-2 px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm hover:border-[#5c1514] rounded-lg transition-colors"
                    >
                      <Image className="w-4 h-4 text-cafe-muted" />
                      {quick.image_url ? 'Cambiar imagen' : 'Subir imagen'}
                    </button>
                    {quick.image_url && (
                      <div className="w-8 h-8 shrink-0 rounded overflow-hidden border border-cafe-border">
                        <img src={quick.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={quickSaving || !quick.name.trim() || !quick.price}
                  className="px-5 py-2 bg-[#5c1514] text-white font-display text-sm tracking-wider hover:bg-[#731c1a] transition-colors rounded-lg disabled:opacity-40 flex items-center gap-2"
                >
                  {quickSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                  AGREGAR
                </button>
              </form>
              <p className="text-xs text-cafe-muted mt-2 px-1">Presioná AGREGAR y seguí escribiendo — el formulario no se cierra.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Management */}
        <div className="bg-cafe-surface border border-cafe-border p-4 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm tracking-widest text-[#5c1514]">CATEGORÍAS DEL MENÚ</h3>
            <button
              onClick={() => {
                if (editingCats) {
                  setEditingCats(false);
                } else {
                  setCatDraft([...categories]);
                  setEditingCats(true);
                }
              }}
              className={`text-xs font-display tracking-wider px-3 py-1.5 rounded-lg transition-colors ${
                editingCats ? 'bg-cafe-bg border border-cafe-border text-cafe-muted' : 'text-[#5c1514] hover:bg-[#5c1514]/10'
              }`}
            >
              {editingCats ? 'CANCELAR' : 'EDITAR'}
            </button>
          </div>

          {!editingCats ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {categories.map(cat => (
                <span key={cat} className="px-3 py-1.5 bg-cafe-bg border border-cafe-border text-cafe-text text-xs font-display tracking-wider rounded-lg">
                  {cat}
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {catDraft.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 text-center text-xs text-cafe-muted/50">{idx + 1}</span>
                  <input
                    type="text"
                    value={cat}
                    onChange={e => {
                      const updated = [...catDraft];
                      updated[idx] = e.target.value;
                      setCatDraft(updated);
                    }}
                    className="flex-1 px-3 py-1.5 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-[#5c1514] rounded-lg"
                  />
                  <button
                    onClick={() => setCatDraft(catDraft.filter((_, i) => i !== idx))}
                    className="p-1.5 text-cafe-muted hover:text-red-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setCatDraft([...catDraft, ''])}
                  className="flex items-center gap-1 text-xs text-[#5c1514] hover:bg-[#5c1514]/10 px-3 py-1.5 rounded-lg"
                >
                  <Plus className="w-3 h-3" /> AGREGAR
                </button>
                <div className="flex-1" />
                <button
                  onClick={async () => {
                    const cleaned = catDraft.filter(c => c.trim());
                    setCatSaving(true);
                    try {
                      await updateLandingSettings({ menu_mgmt_categories: cleaned });
                      setCategories(cleaned);
                      setEditingCats(false);
                    } catch {
                      alert('Error al guardar categorías');
                    }
                    setCatSaving(false);
                  }}
                  disabled={catSaving}
                  className="flex items-center gap-1 px-4 py-1.5 bg-[#5c1514] text-white text-xs font-display tracking-wider rounded-lg hover:bg-[#731c1a] disabled:opacity-50"
                >
                  {catSaving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3 h-3" />}
                  GUARDAR
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveFilter('Todos')}
            className={`px-4 py-2 text-xs font-display tracking-wider rounded-xl transition-colors ${
              activeFilter === 'Todos'
                ? 'bg-[#5c1514] text-white'
                : 'bg-cafe-surface border border-cafe-border text-cafe-muted hover:text-cafe-text'
            }`}
          >
            TODOS ({items.length})
          </button>
          {allCats.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 text-xs font-display tracking-wider rounded-xl transition-colors ${
                activeFilter === cat
                  ? 'bg-[#5c1514] text-white'
                  : 'bg-cafe-surface border border-cafe-border text-cafe-muted hover:text-cafe-text'
              }`}
            >
              {cat} ({(grouped[cat] || []).length})
            </button>
          ))}
        </div>

        {/* Items grouped by category */}
        <div className="space-y-6">
          {Object.entries(filteredGrouped).map(([cat, catItems]) => {
            <div key={cat}>
              <h3 className="font-display text-sm tracking-widest text-[#5c1514] mb-3 uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5c1514]" />
                {cat}
                <span className="text-cafe-muted font-normal text-xs">({catItems.length} items)</span>
              </h3>
              <div className="bg-cafe-surface border border-cafe-border overflow-x-auto rounded-xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-cafe-border">
                      <th className="p-4 font-display text-xs tracking-widest text-cafe-muted">NOMBRE</th>
                      <th className="p-4 font-display text-xs tracking-widest text-cafe-muted">PRECIO</th>
                      <th className="p-4 font-display text-xs tracking-widest text-cafe-muted">STOCK</th>
                      <th className="p-4 font-display text-xs tracking-widest text-cafe-muted">DESTACADO</th>
                      <th className="p-4 font-display text-xs tracking-widest text-cafe-muted text-right">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catItems.map((item) => (
                      <tr
                        key={item.id}
                        className={`border-b border-cafe-border/50 hover:bg-cafe-bg/50 transition-colors ${!item.stock ? 'opacity-50' : ''}`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {item.image_url && (
                              <img src={item.image_url} alt="" className="w-10 h-10 object-cover rounded" />
                            )}
                            <div>
                              <p className="font-display text-sm text-cafe-text">{item.name}</p>
                              {item.description && (
                                <p className="text-xs text-cafe-muted leading-relaxed">{item.description.slice(0, 80)}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-display text-sm text-[#5c1514]">
                            ${parseFloat(item.price).toLocaleString('es-AR')}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleStock(item)}
                            className={`transition-colors ${item.stock ? 'text-green-500' : 'text-cafe-muted'}`}
                            title={item.stock ? 'En stock' : 'Sin stock'}
                          >
                            {item.stock ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                          </button>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleFeatured(item)}
                            className={`transition-colors ${item.featured ? 'text-[#5c1514]' : 'text-cafe-muted'}`}
                            title={item.featured ? 'Destacado' : 'No destacado'}
                          >
                            <Star className={`w-5 h-5 ${item.featured ? 'fill-[#5c1514]' : ''}`} />
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setPickerTarget(`row_image_${item.id}`)}
                              className="p-2 text-cafe-muted hover:text-[#5c1514] transition-colors"
                              title="Cambiar imagen"
                            >
                              <Image className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEdit(item)}
                              className="p-2 text-cafe-muted hover:text-[#5c1514] transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.name)}
                              className="p-2 text-cafe-muted hover:text-red-500 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-12 bg-cafe-surface border border-cafe-border rounded-xl">
              <p className="text-cafe-muted">No hay items en el menú todavía</p>
            </div>
          )}
        </div>

        {/* Full Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-cafe-surface border border-cafe-border w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-cafe-border">
                  <h2 className="font-display text-xl text-cafe-text">
                    {editing ? 'EDITAR ITEM' : 'NUEVO ITEM'}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="text-cafe-muted hover:text-cafe-text">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">NOMBRE</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-[#5c1514]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">DESCRIPCIÓN</label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-[#5c1514] resize-none h-20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">DESCRIPCIÓN (EN)</label>
                    <textarea
                      value={form.description_en}
                      onChange={e => setForm({ ...form, description_en: e.target.value })}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-[#5c1514] resize-none h-20"
                      placeholder="English description..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">PRECIO ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={form.price}
                        onChange={e => setForm({ ...form, price: e.target.value })}
                        className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-[#5c1514]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">CATEGORÍA</label>
                      <select
                        value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                        className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-[#5c1514]"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">IMAGEN</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPickerTarget('form_image')}
                        className="flex items-center gap-2 px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm hover:border-[#5c1514] rounded-lg transition-colors"
                      >
                        <Image className="w-4 h-4 text-cafe-muted" />
                        {form.image_url ? 'Cambiar imagen' : 'Subir imagen'}
                      </button>
                      {form.image_url && (
                        <div className="w-10 h-10 rounded overflow-hidden border border-cafe-border">
                          <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      {form.image_url && (
                        <button type="button" onClick={() => setForm({ ...form, image_url: '' })} className="text-cafe-muted hover:text-red-400">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.stock}
                        onChange={e => setForm({ ...form, stock: e.target.checked })}
                        className="accent-[#5c1514]"
                      />
                      <span className="text-sm text-cafe-muted">En stock</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={e => setForm({ ...form, featured: e.target.checked })}
                        className="accent-[#5c1514]"
                      />
                      <span className="text-sm text-cafe-muted">Destacado del día</span>
                    </label>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-cafe-border">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2 bg-[#5c1514] text-white font-display text-sm tracking-wider hover:bg-[#731c1a] transition-colors disabled:opacity-50 rounded-xl shadow-lg shadow-black/30"
                    >
                      {loading ? 'GUARDANDO...' : editing ? 'ACTUALIZAR' : 'CREAR'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 border border-cafe-border text-cafe-muted hover:text-cafe-text transition-colors rounded-xl"
                    >
                      CANCELAR
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Excel Import Modal */}
        <AnimatePresence>
          {showImport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
              onClick={() => setShowImport(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-cafe-surface border border-cafe-border w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-cafe-border">
                  <div>
                    <h2 className="font-display text-xl text-cafe-text">IMPORTAR DESDE EXCEL</h2>
                    <p className="text-xs text-cafe-muted mt-1">Columnas: Sección, Nombre, Descripción, Precio, SKU</p>
                  </div>
                  <button onClick={() => setShowImport(false)} className="text-cafe-muted hover:text-cafe-text">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={handleFile}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full p-8 border-2 border-dashed border-cafe-border hover:border-[#5c1514] rounded-xl text-center transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-10 h-10 text-cafe-muted mx-auto mb-3" />
                    <p className="text-sm text-cafe-text font-display">Hacé click para seleccionar un archivo</p>
                    <p className="text-xs text-cafe-muted mt-1">.xlsx, .xls o .csv</p>
                  </button>

                  {importFile && (
                    <div className="bg-cafe-bg border border-cafe-border rounded-xl p-4 flex items-center gap-3">
                      <FileSpreadsheet className="w-8 h-8 text-[#5c1514]" />
                      <div className="flex-1">
                        <p className="text-sm text-cafe-text font-display">{importFile.name}</p>
                        <p className="text-xs text-cafe-muted">El servidor procesará las columnas: Nombre, Descripción, Precio, Categoría, Imagen</p>
                      </div>
                      <button onClick={() => { setImportFile(null); }} className="text-cafe-muted hover:text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="bg-cafe-bg/50 border border-cafe-border/50 rounded-xl p-4">
                    <p className="text-xs text-cafe-muted leading-relaxed">
                      <strong className="text-cafe-text">Formato del archivo:</strong> Creá un Excel con las columnas: Sección, Nombre, Descripción, Precio, SKU. La sección define la categoría del item.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleImport}
                      disabled={!importFile || importing}
                      className="flex-1 py-2.5 bg-[#5c1514] text-white font-display text-sm tracking-wider hover:bg-[#731c1a] transition-colors disabled:opacity-50 rounded-xl shadow-lg shadow-black/30 flex items-center justify-center gap-2"
                    >
                      {importing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                      {importing ? 'IMPORTANDO...' : 'IMPORTAR'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowImport(false)}
                      className="px-6 py-2.5 border border-cafe-border text-cafe-muted hover:text-cafe-text transition-colors rounded-xl"
                    >
                      CANCELAR
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {pickerTarget && (
          <ImagePicker
            value={
              pickerTarget === 'quick_image'
                ? quick.image_url
                : pickerTarget === 'form_image'
                  ? form.image_url
                  : ''
            }
            onChange={async (url) => {
              if (pickerTarget === 'quick_image') {
                setQuick({ ...quick, image_url: url });
              } else if (pickerTarget === 'form_image') {
                setForm({ ...form, image_url: url });
              } else if (pickerTarget.startsWith('row_image_')) {
                const id = pickerTarget.replace('row_image_', '');
                try {
                  await updateMenuItem(id, { image_url: url });
                  loadItems();
                } catch {
                  alert('Error al actualizar imagen');
                }
              }
              setPickerTarget(null);
            }}
            onClose={() => setPickerTarget(null)}
          />
        )}
      </div>
    </div>
  );
}
