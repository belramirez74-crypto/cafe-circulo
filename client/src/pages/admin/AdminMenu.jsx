import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../../lib/api';
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, Star } from 'lucide-react';

const emptyForm = { name: '', description: '', price: '', category: 'Cafetería', image_url: '', stock: true, featured: false };

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const loadItems = () => {
    getAllMenuItems().then(res => setItems(res.data)).catch(() => {});
  };

  useEffect(() => { loadItems(); }, []);

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

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-cafe-text">GESTIÓN DE MENÚ</h1>
            <p className="text-cafe-muted text-sm mt-1">{items.length} items en total</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors"
          >
            <Plus className="w-4 h-4" /> NUEVO ITEM
          </button>
        </div>

        {/* Items Table */}
        <div className="bg-cafe-surface border border-cafe-border overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-cafe-border">
                <th className="p-4 font-display text-xs tracking-widest text-cafe-muted">NOMBRE</th>
                <th className="p-4 font-display text-xs tracking-widest text-cafe-muted">CATEGORÍA</th>
                <th className="p-4 font-display text-xs tracking-widest text-cafe-muted">PRECIO</th>
                <th className="p-4 font-display text-xs tracking-widest text-cafe-muted">STOCK</th>
                <th className="p-4 font-display text-xs tracking-widest text-cafe-muted">DESTACADO</th>
                <th className="p-4 font-display text-xs tracking-widest text-cafe-muted text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {items.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
                            <p className="text-xs text-cafe-muted">{item.description.slice(0, 50)}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-cafe-muted">{item.category}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-display text-sm text-cafe-accent">
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
                        className={`transition-colors ${item.featured ? 'text-cafe-burgundy-light' : 'text-cafe-muted'}`}
                        title={item.featured ? 'Destacado' : 'No destacado'}
                      >
                        <Star className={`w-5 h-5 ${item.featured ? 'fill-cafe-burgundy-light' : ''}`} />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 text-cafe-muted hover:text-cafe-accent transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-2 text-cafe-muted hover:text-cafe-burgundy-light transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="text-center py-12">
              <p className="text-cafe-muted">No hay items en el menú todavía</p>
            </div>
          )}
        </div>

        {/* Modal Form */}
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
                className="bg-cafe-surface border border-cafe-border w-full max-w-lg max-h-[90vh] overflow-y-auto"
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
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">DESCRIPCIÓN</label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent resize-none h-20"
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
                        className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">CATEGORÍA</label>
                      <select
                        value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                        className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                      >
                        <option value="Cafetería">Cafetería</option>
                        <option value="Dulces">Dulces</option>
                        <option value="Saladitos">Saladitos</option>
                        <option value="Bebidas">Bebidas</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">URL DE IMAGEN</label>
                    <input
                      type="url"
                      value={form.image_url}
                      onChange={e => setForm({ ...form, image_url: e.target.value })}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.stock}
                        onChange={e => setForm({ ...form, stock: e.target.checked })}
                        className="accent-cafe-accent"
                      />
                      <span className="text-sm text-cafe-muted">En stock</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={e => setForm({ ...form, featured: e.target.checked })}
                        className="accent-cafe-accent"
                      />
                      <span className="text-sm text-cafe-muted">Destacado del día</span>
                    </label>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-cafe-border">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors disabled:opacity-50"
                    >
                      {loading ? 'GUARDANDO...' : editing ? 'ACTUALIZAR' : 'CREAR'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 border border-cafe-border text-cafe-muted hover:text-cafe-text transition-colors"
                    >
                      CANCELAR
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
