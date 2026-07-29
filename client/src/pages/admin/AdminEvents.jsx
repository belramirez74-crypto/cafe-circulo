import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEvents, createEvent, deleteEvent } from '../../lib/api';
import { Plus, Trash2, X, Calendar, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import ImagePicker from '../../components/ImagePicker';

const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', flyer_url: '' });
  const [loading, setLoading] = useState(false);
  const [pickerTarget, setPickerTarget] = useState(null);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const eventsByDate = {};
  events.forEach(ev => {
    const d = ev.date?.slice(0, 10);
    if (d) {
      if (!eventsByDate[d]) eventsByDate[d] = [];
      eventsByDate[d].push(ev);
    }
  });

  const selectedDayEvents = selectedDay ? (eventsByDate[selectedDay] || []) : [];

  const loadEvents = () => {
    getEvents().then(res => setEvents(res.data)).catch(() => {});
  };

  useEffect(() => { loadEvents(); }, []);

  const openCreate = (date) => {
    setForm({ title: '', description: '', date: date || '', flyer_url: '' });
    setShowForm(true);
  };

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

  const prevMonth = () => {
    const d = new Date(calYear, calMonth - 1, 1);
    setCalMonth(d.getMonth());
    setCalYear(d.getFullYear());
  };

  const nextMonth = () => {
    const d = new Date(calYear, calMonth + 1, 1);
    setCalMonth(d.getMonth());
    setCalYear(d.getFullYear());
  };

  const thisMonthEvents = events.filter(ev => {
    const d = ev.date?.slice(0, 7);
    const m = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;
    return d === m;
  });

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-cafe-text">EVENTOS & PROMOS</h1>
            <p className="text-cafe-muted text-sm mt-1">{events.length} eventos registrados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Calendar */}
          <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-cafe-accent" />
                <h2 className="font-display text-lg text-cafe-text">CALENDARIO</h2>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-1 text-cafe-muted hover:text-cafe-text transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <span className="font-display text-sm text-cafe-text min-w-[120px] text-center">{monthNames[calMonth]} {calYear}</span>
                <button onClick={nextMonth} className="p-1 text-cafe-muted hover:text-cafe-text transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'].map((d, i) => (
                <div key={i} className="text-center text-xs text-cafe-muted/50 font-display py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5 mb-4">
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayEvs = eventsByDate[dateStr] || [];
                const isToday = dateStr === todayStr;
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(prev => prev === dateStr ? null : dateStr)}
                    className={`relative text-center py-1.5 text-sm rounded cursor-pointer transition-colors
                      ${isToday ? 'bg-cafe-accent/20 text-cafe-accent font-display' : ''}
                      ${dateStr === selectedDay ? 'ring-1 ring-cafe-accent bg-cafe-accent/10' : ''}
                      ${!isToday && dateStr !== selectedDay ? 'text-cafe-muted hover:bg-cafe-card/60' : ''}
                    `}
                  >
                    {day}
                    {dayEvs.length > 0 && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayEvs.slice(0, 3).map((_, ei) => (
                          <span key={ei} className="w-1 h-1 rounded-full bg-cafe-accent" />
                        ))}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => openCreate('')}
              className="w-full flex items-center justify-center gap-2 py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors rounded-xl shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40"
            >
              <Plus className="w-4 h-4" /> NUEVO EVENTO
            </button>
          </div>

          {/* Selected day events */}
          <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-cafe-text">
                {selectedDay
                  ? new Date(selectedDay + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
                  : 'SELECCIONÁ UN DÍA'}
              </h2>
              {selectedDay && (
                <button
                  onClick={() => openCreate(selectedDay)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-cafe-accent text-white font-display text-xs tracking-wider hover:bg-cafe-burgundy-light transition-colors rounded-xl shadow-lg shadow-black/30"
                >
                  <Plus className="w-3 h-3" /> AGREGAR
                </button>
              )}
            </div>

            {selectedDayEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDayEvents.map(ev => (
                  <div key={ev.id} className="flex items-start gap-3 p-3 bg-cafe-card/30 rounded-lg border border-cafe-border/20">
                    {ev.flyer_url && (
                      <div className="w-16 h-16 rounded overflow-hidden shrink-0">
                        <img src={ev.flyer_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-sm text-cafe-text">{ev.title}</h3>
                      {ev.description && <p className="text-xs text-cafe-muted mt-0.5">{ev.description}</p>}
                    </div>
                    <button onClick={() => handleDelete(ev.id, ev.title)} className="text-cafe-muted hover:text-red-400 transition-colors shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-cafe-muted/50 text-sm text-center py-8">
                {selectedDay ? 'Sin eventos en este día' : 'Hacé click en un día del calendario'}
              </p>
            )}
          </div>
        </div>

        {/* Events Grid */}
        {thisMonthEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-xl text-cafe-text mb-4">TODOS LOS EVENTOS DE {monthNames[calMonth].toUpperCase()}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {thisMonthEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-cafe-surface border border-cafe-border overflow-hidden group rounded-xl"
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
                        className="mt-3 flex items-center gap-1 text-xs text-cafe-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> ELIMINAR
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

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
                className="bg-cafe-surface border border-cafe-border w-full max-w-lg rounded-xl"
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
                    <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">FLYER</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPickerTarget('flyer')}
                        className="flex items-center gap-2 px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm hover:border-cafe-accent rounded-lg transition-colors"
                      >
                        <Image className="w-4 h-4 text-cafe-muted" />
                        {form.flyer_url ? 'Cambiar imagen' : 'Subir imagen'}
                      </button>
                      {form.flyer_url && (
                        <div className="w-10 h-10 rounded overflow-hidden border border-cafe-border shrink-0">
                          <img src={form.flyer_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      {form.flyer_url && (
                        <button type="button" onClick={() => setForm({ ...form, flyer_url: '' })} className="text-cafe-muted hover:text-red-400">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-cafe-border">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors disabled:opacity-50 rounded-xl shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40"
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

      {pickerTarget && (
        <ImagePicker
          value={form.flyer_url}
          onChange={async (url) => {
            setForm({ ...form, flyer_url: url });
            setPickerTarget(null);
          }}
          onClose={() => setPickerTarget(null)}
        />
      )}
    </div>
  );
}
