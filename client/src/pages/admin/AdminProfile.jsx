import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../lib/api';
import { getAdminReminders, createAdminReminder, markReminderDone, deleteAdminReminder } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, User, Camera, Check, X, Bell, Plus, Trash2, Clock, CalendarCheck, AlertCircle } from 'lucide-react';

export default function AdminProfile() {
  const { admin, setAdmin } = useAuth();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(admin?.name || '');
  const [saving, setSaving] = useState(false);

  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', remind_at: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadReminders();
  }, []);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [reminders]);

  const loadReminders = async () => {
    try {
      const res = await getAdminReminders();
      setReminders(res.data || []);
    } catch {}
    setLoadingReminders(false);
  };

  const checkReminders = () => {
    const now = new Date();
    reminders.forEach(r => {
      if (r.is_done) return;
      const remindAt = new Date(r.remind_at);
      const diff = remindAt - now;
      if (diff <= 0 && diff > -60000) {
        if (Notification.permission === 'granted') {
          new Notification('Recordatorio', { body: r.title, icon: '/favicon.svg' });
        }
      }
    });
  };

  if (!admin) return null;

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('avatar', file);
      const res = await API.put('/auth/profile/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newUrl = res.data.avatar_url;
      const updated = { ...admin, avatar_url: newUrl };
      setAdmin(updated);
      localStorage.setItem('admin', JSON.stringify(updated));
    } catch (err) {
      console.error('Avatar error:', err.response?.data || err.message);
    }
    setUploading(false);
  };

  const handleNameSave = async () => {
    if (!nameValue.trim()) return;
    setSaving(true);
    try {
      const res = await API.put('/auth/profile/name', { name: nameValue.trim() });
      const updated = { ...admin, name: res.data.name };
      setAdmin(updated);
      localStorage.setItem('admin', JSON.stringify(updated));
      setEditingName(false);
    } catch {}
    setSaving(false);
  };

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.remind_at) return;
    setSubmitting(true);
    setFormError('');
    try {
      const isoDate = new Date(form.remind_at).toISOString();
      const res = await createAdminReminder({ ...form, remind_at: isoDate });
      setReminders(prev => [...prev, res.data].sort((a, b) => new Date(a.remind_at) - new Date(b.remind_at)));
      setForm({ title: '', content: '', remind_at: '' });
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error al crear recordatorio');
    }
    setSubmitting(false);
  };

  const handleDone = async (id) => {
    try {
      await markReminderDone(id);
      setReminders(prev => prev.map(r => r.id === id ? { ...r, is_done: true } : r));
    } catch {}
  };

  const handleDeleteReminder = async (id) => {
    try {
      await deleteAdminReminder(id);
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch {}
  };

  const pendingReminders = reminders.filter(r => !r.is_done);
  const doneReminders = reminders.filter(r => r.is_done);

  return (
    <div>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="font-display text-4xl text-cafe-text mb-8">MI PERFIL</h1>

        <div className="bg-cafe-surface border border-cafe-border p-8 space-y-6 rounded-xl">
          {/* Avatar + Name */}
          <div className="flex items-center gap-5 pb-6 border-b border-cafe-border/40">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-cafe-accent/20 flex items-center justify-center border-2 border-cafe-border">
                {admin.avatar_url ? (
                  <img src={admin.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-cafe-accent" />
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
                    className="flex-1 px-3 py-1.5 bg-cafe-bg border border-cafe-accent text-cafe-text text-sm rounded-xl focus:outline-none"
                    autoFocus
                  />
                  <button onClick={handleNameSave} disabled={saving} className="text-green-400 hover:text-green-300">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setEditingName(false); setNameValue(admin.name); }} className="text-cafe-muted hover:text-cafe-text">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setEditingName(true)} className="text-left group/name">
                  <h2 className="font-display text-xl text-cafe-text group-hover/name:text-cafe-accent transition-colors">{admin.name || 'Administrador'}</h2>
                </button>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-display tracking-wider text-cafe-muted/60 mb-1">EMAIL</label>
              <div className="flex items-center gap-2 text-cafe-text">
                <Mail className="w-4 h-4 text-cafe-muted" />
                <span>{admin.email}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-display tracking-wider text-cafe-muted/60 mb-1">ROL</label>
              <span className="text-sm text-cafe-muted font-display uppercase tracking-wider">Administrador</span>
            </div>
          </div>
        </div>

        {/* Reminders */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-white" />
              <h2 className="font-display text-2xl text-cafe-text">MIS RECORDATORIOS</h2>
              {pendingReminders.length > 0 && (
                <span className="bg-cafe-accent text-white text-xs font-display px-2 py-0.5 rounded-full">{pendingReminders.length}</span>
              )}
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors rounded-xl shadow-lg shadow-black/30"
            >
              <Plus className="w-4 h-4" /> NUEVO
            </button>
          </div>

          {/* Notification permission */}
          {Notification.permission !== 'granted' && Notification.permission !== 'denied' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl mb-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
              <p className="text-sm text-cafe-text">Activá las notificaciones para recibir alertas cuando se cumplan tus recordatorios.</p>
              <button
                onClick={() => Notification.requestPermission()}
                className="px-3 py-1 bg-yellow-500 text-white text-xs font-display rounded-xl shrink-0"
              >ACTIVAR</button>
            </div>
          )}

          {/* Create Form */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateReminder}
                className="bg-cafe-surface border border-cafe-border p-6 rounded-xl mb-6 space-y-4 overflow-hidden"
              >
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">TÍTULO</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Ej: Revisar stock de café..."
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">NOTA (opcional)</label>
                  <textarea
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    placeholder="Detalle del recordatorio..."
                    rows={2}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent rounded-xl resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">FECHA Y HORA</label>
                  <input
                    type="datetime-local"
                    value={form.remind_at}
                    onChange={e => setForm({ ...form, remind_at: e.target.value })}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent rounded-xl"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors disabled:opacity-50 rounded-xl shadow-lg shadow-black/30"
                  >
                    {submitting ? 'CREANDO...' : 'CREAR RECORDATORIO'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setFormError(''); }}
                    className="px-4 py-2 text-cafe-muted font-display text-sm hover:text-cafe-text transition-colors"
                  >CANCELAR</button>
                </div>
                {formError && (
                  <p className="text-xs text-red-400 mt-2">{formError}</p>
                )}
              </motion.form>
            )}
          </AnimatePresence>

          {/* Pending Reminders */}
          {loadingReminders ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-cafe-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {pendingReminders.length === 0 && doneReminders.length === 0 && (
                <div className="bg-cafe-surface border border-cafe-border p-8 rounded-xl text-center">
                  <Bell className="w-10 h-10 text-cafe-muted/30 mx-auto mb-3" />
                  <p className="text-cafe-muted text-sm">No tenés recordatorios. Creá uno con el botón "NUEVO".</p>
                </div>
              )}

              <div className="space-y-3">
                <AnimatePresence>
                  {pendingReminders.map(r => {
                    const remindAt = new Date(r.remind_at);
                    const isPast = remindAt < new Date();
                    return (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className={`bg-cafe-surface border p-4 rounded-xl flex items-start gap-3 ${isPast ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-cafe-border'}`}
                      >
                        <div className={`mt-1 ${isPast ? 'text-yellow-500' : 'text-cafe-accent'}`}>
                          <CalendarCheck className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-cafe-text font-medium">{r.title}</p>
                          {r.content && <p className="text-xs text-cafe-muted mt-0.5">{r.content}</p>}
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Clock className="w-3 h-3 text-cafe-muted" />
                            <span className={`text-xs font-display ${isPast ? 'text-yellow-500' : 'text-cafe-muted'}`}>
                              {remindAt.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} · {remindAt.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isPast && <span className="text-[10px] text-yellow-500 font-display ml-1">VENCIDO</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => handleDone(r.id)} className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-colors" title="Marcar hecho">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteReminder(r.id)} className="p-1.5 text-cafe-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Eliminar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Done Reminders */}
              {doneReminders.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-display text-cafe-muted/50 tracking-wider mb-3">COMPLETADOS</p>
                  <div className="space-y-2">
                    {doneReminders.map(r => (
                      <div key={r.id} className="bg-cafe-surface/50 border border-cafe-border/30 p-3 rounded-xl flex items-center gap-3 opacity-50">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-sm text-cafe-muted line-through flex-1">{r.title}</span>
                        <button onClick={() => handleDeleteReminder(r.id)} className="p-1 text-cafe-muted hover:text-red-400 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
