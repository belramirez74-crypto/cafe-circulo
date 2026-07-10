import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEvents, createEvent, deleteEvent } from '../../lib/api';
import { Plus, Trash2, X, Calendar } from 'lucide-react';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', flyer_url: '' });
  const [loading, setLoading] = useState(false);

  const loadEvents = () => {
    getEvents().then(res => setEvents(res.data)).catch(() => {});
  };

  useEffect(() => { loadEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEvent(form);
      setShowForm(false);
      setForm({ title: '', description: '', date: '', flyer_url: '' });
      loadEvents();
    } catch {
      alert('Error al crear evento');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`¿Eliminar el evento "${title}"?`)) return;
    try {
      await deleteEvent(id);
      loadEvents();
    } catch {
      alert('Error al eliminar');
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-cafe-text">EVENTOS & PROMOS</h1>
            <p className="text-cafe-muted text-sm mt-1">{events.length} eventos registrados</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors"
          >
            <Plus className="w-4 h-4" /> NUEVO EVENTO
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.05 }}
                className="bg-cafe-surface border border-cafe-border overflow-hidden group"
              >
                {event.flyer_url && (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={event.flyer_url} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 text-cafe-accent text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-display tracking-wider">
                      {new Date(event.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-display text-lg text-cafe-text">{event.title}</h3>
                  {event.description && (
                    <p className="text-cafe-muted text-sm mt-1">{event.description}</p>
                  )}
                  <button
                    onClick={() => handleDelete(event.id, event.title)}
                    className="mt-3 flex items-center gap-1 text-xs text-cafe-muted hover:text-cafe-burgundy-light transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> ELIMINAR
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {events.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-cafe-muted/20 mx-auto mb-4" />
            <p className="text-cafe-muted">No hay eventos todavía</p>
          </div>
        )}

        {/* Create Event Modal */}
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
                className="bg-cafe-surface border border-cafe-border w-full max-w-lg"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-cafe-border">
                  <h2 className="font-display text-xl text-cafe-text">NUEVO EVENTO</h2>
                  <button onClick={() => setShowForm(false)} className="text-cafe-muted hover:text-cafe-text">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">TÍTULO</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
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
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">FECHA</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">URL DEL FLYER</label>
                    <input
                      type="url"
                      value={form.flyer_url}
                      onChange={e => setForm({ ...form, flyer_url: e.target.value })}
                      className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-cafe-border">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors disabled:opacity-50"
                    >
                      {loading ? 'CREANDO...' : 'CREAR EVENTO'}
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
