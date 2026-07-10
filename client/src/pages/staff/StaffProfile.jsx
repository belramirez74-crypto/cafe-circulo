import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { getStaffProfile, updateStaffProfile, getStaffTasks, updateTaskStatus, getStaffReminders, createStaffReminder, deleteStaffReminder, getStaffNotes, createStaffNote, deleteStaffNote } from '../../lib/api';
import { User, Camera, ListChecks, Bell, FileText, Plus, X, CheckCircle, Circle, ArrowLeft } from 'lucide-react';

export default function StaffProfile() {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ photo_url: '', position: '', notes: '' });
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newReminder, setNewReminder] = useState('');
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || user.role === 'client') return navigate('/');
    loadData();
  }, [user]);

  const loadData = () => {
    getStaffProfile().then(r => setProfile(r.data)).catch(() => {});
    getStaffTasks().then(r => setTasks(r.data)).catch(() => {});
    getStaffReminders().then(r => setReminders(r.data)).catch(() => {});
    getStaffNotes().then(r => setNotes(r.data)).catch(() => {});
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await updateStaffProfile(profile);
      setProfile(res.data);
    } catch { alert('Error al guardar perfil'); }
    finally { setSaving(false); }
  };

  const handleAddReminder = async () => {
    if (!newReminder.trim()) return;
    try {
      await createStaffReminder({ title: newReminder });
      setNewReminder('');
      loadData();
    } catch { alert('Error al crear recordatorio'); }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await createStaffNote(newNote);
      setNewNote('');
      loadData();
    } catch { alert('Error al crear nota'); }
  };

  const handleTaskStatus = async (id, status) => {
    try { await updateTaskStatus(id, status); loadData(); }
    catch { alert('Error al actualizar tarea'); }
  };

  if (!user) return null;

  const pendingTasks = tasks.filter(t => t.status !== 'completed');

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/staff" className="inline-flex items-center gap-2 text-cafe-muted hover:text-cafe-text transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver al dashboard
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-cafe-surface border border-cafe-border p-6 md:col-span-1">
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-24 h-24 rounded-full bg-cafe-card border border-cafe-border/60 flex items-center justify-center overflow-hidden mb-3">
                {profile.photo_url ? (
                  <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-cafe-muted" />
                )}
              </div>
              <h2 className="font-display text-xl text-cafe-text">{user.name}</h2>
              <p className="text-cafe-muted text-sm">{user.email}</p>
              <span className="text-xs font-display tracking-wider text-cafe-burgundy-light mt-1 uppercase">{profile.position || 'Staff'}</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-cafe-muted mb-1">FOTO (URL)</label>
                <input
                  type="url"
                  value={profile.photo_url}
                  onChange={e => setProfile({ ...profile, photo_url: e.target.value })}
                  className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs text-cafe-muted mb-1">PUESTO</label>
                <input
                  type="text"
                  value={profile.position}
                  onChange={e => setProfile({ ...profile, position: e.target.value })}
                  className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent"
                  placeholder="Ej: Barista"
                />
              </div>
              <div>
                <label className="block text-xs text-cafe-muted mb-1">NOTAS PERSONALES</label>
                <textarea
                  value={profile.notes}
                  onChange={e => setProfile({ ...profile, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent resize-none h-20"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors disabled:opacity-50"
              >
                {saving ? 'GUARDANDO...' : 'GUARDAR PERFIL'}
              </button>
            </div>
          </div>

          {/* Tasks & Reminders */}
          <div className="space-y-6 md:col-span-2">
            {/* Tasks */}
            <div className="bg-cafe-surface border border-cafe-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <ListChecks className="w-5 h-5 text-cafe-burgundy-light" />
                <h2 className="font-display text-lg text-cafe-text">TAREAS</h2>
                {pendingTasks.length > 0 && (
                  <span className="text-xs bg-cafe-accent text-white px-2 py-0.5">{pendingTasks.length}</span>
                )}
              </div>
              {tasks.length > 0 ? (
                <div className="space-y-2">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-start gap-3 p-3 bg-cafe-card/30 rounded border border-cafe-border/30">
                      <button
                        onClick={() => handleTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                        className="mt-0.5 shrink-0"
                      >
                        {task.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-cafe-muted" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm text-cafe-text ${task.status === 'completed' ? 'line-through text-cafe-muted/50' : ''}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-cafe-muted mt-0.5">{task.description}</p>
                        )}
                        {task.due_date && (
                          <p className="text-xs text-cafe-muted-dark mt-0.5">
                            Vence: {new Date(task.due_date).toLocaleDateString('es-AR')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-cafe-muted/50 text-sm text-center py-4">Sin tareas asignadas</p>
              )}
            </div>

            {/* Reminders */}
            <div className="bg-cafe-surface border border-cafe-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-cafe-burgundy-light" />
                <h2 className="font-display text-lg text-cafe-text">RECORDATORIOS</h2>
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newReminder}
                  onChange={e => setNewReminder(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddReminder()}
                  className="flex-1 px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent"
                  placeholder="Nuevo recordatorio..."
                />
                <button
                  onClick={handleAddReminder}
                  className="px-3 py-2 bg-cafe-accent text-white hover:bg-cafe-burgundy-light transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {reminders.length > 0 ? (
                <div className="space-y-2">
                  {reminders.map(rem => (
                    <div key={rem.id} className="flex items-center justify-between p-2 bg-cafe-card/30 rounded border border-cafe-border/20">
                      <span className="text-sm text-cafe-text">{rem.title}</span>
                      <button onClick={() => deleteStaffReminder(rem.id).then(loadData)} className="text-cafe-muted hover:text-cafe-burgundy-light transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-cafe-muted/50 text-sm text-center py-2">Sin recordatorios</p>
              )}
            </div>

            {/* Notes */}
            <div className="bg-cafe-surface border border-cafe-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-cafe-burgundy-light" />
                <h2 className="font-display text-lg text-cafe-text">NOTAS</h2>
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                  className="flex-1 px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent"
                  placeholder="Nueva nota..."
                />
                <button
                  onClick={handleAddNote}
                  className="px-3 py-2 bg-cafe-accent text-white hover:bg-cafe-burgundy-light transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {notes.length > 0 ? (
                <div className="space-y-2">
                  {notes.map(note => (
                    <div key={note.id} className="flex items-start justify-between p-3 bg-cafe-card/30 rounded border border-cafe-border/20">
                      <p className="text-sm text-cafe-muted flex-1">{note.content}</p>
                      <button onClick={() => deleteStaffNote(note.id).then(loadData)} className="text-cafe-muted hover:text-cafe-burgundy-light transition-colors ml-2 shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-cafe-muted/50 text-sm text-center py-2">Sin notas</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
