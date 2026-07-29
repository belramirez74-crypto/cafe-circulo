import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { getAdminStaffList, createAdminStaff, deleteAdminStaff, getAdminTasks, assignAdminTask, deleteAdminTask, getAdminTimeLogs } from '../../lib/api';
import { Plus, X, Trash2, ListChecks, Users, Clock, Eye, EyeOff } from 'lucide-react';

export default function AdminStaff() {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [newTask, setNewTask] = useState({ assigned_to: '', title: '', description: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') return navigate('/');
    loadData();
  }, [user]);

  const loadData = () => {
    getAdminStaffList().then(r => setStaffList(r.data)).catch(() => {});
    getAdminTasks().then(r => setTasks(r.data)).catch(() => {});
    getAdminTimeLogs().then(r => setTimeLogs(r.data)).catch(() => {});
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await createAdminStaff(newStaff);
      setShowCreateStaff(false);
      setNewStaff({ name: '', email: '', password: '', role: 'staff' });
      loadData();
    } catch (err) { alert('Error al crear staff'); }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('¿Eliminar este miembro del staff?')) return;
    try { await deleteAdminStaff(id); loadData(); }
    catch { alert('Error al eliminar'); }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      await assignAdminTask(newTask);
      setNewTask({ assigned_to: '', title: '', description: '' });
      loadData();
    } catch (err) { alert('Error al asignar tarea'); }
  };

  if (!user) return null;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-display text-4xl text-cafe-text mb-8">GESTIÓN DE STAFF</h1>

        <div className="mb-8">
          {/* Staff List */}
          <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-cafe-burgundy-light" />
                <h2 className="font-display text-lg text-cafe-text">MIEMBROS</h2>
              </div>
              <button
                onClick={() => setShowCreateStaff(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-cafe-accent text-white font-display text-xs tracking-wider hover:bg-cafe-burgundy-light transition-colors rounded-xl shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40"
              >
                <Plus className="w-3 h-3" /> AGREGAR
              </button>
            </div>
            <div className="space-y-2">
              {staffList.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-cafe-card/30 rounded border border-cafe-border/30">
                  <div>
                    <p className="font-display text-sm text-cafe-text">{s.name}</p>
                    <p className="text-xs text-cafe-muted">{s.email} · {s.role}</p>
                  </div>
                  <button onClick={() => handleDeleteStaff(s.id)} className="text-cafe-muted hover:text-cafe-burgundy-light transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {staffList.length === 0 && <p className="text-cafe-muted/50 text-sm text-center py-4">Sin miembros</p>}
            </div>
          </div>

        </div>

        {/* Fichados del staff */}
        <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-cafe-burgundy-light" />
            <h2 className="font-display text-lg text-cafe-text">FICHADOS DEL STAFF</h2>
            <span className="text-xs text-cafe-muted/50">hoy</span>
          </div>
          {timeLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cafe-border/40">
                    <th className="text-left py-2 pr-4 text-cafe-muted/60 font-display text-xs tracking-wider">STAFF</th>
                    <th className="text-left py-2 pr-4 text-cafe-muted/60 font-display text-xs tracking-wider">ENTRADA</th>
                    <th className="text-left py-2 pr-4 text-cafe-muted/60 font-display text-xs tracking-wider">SALIDA</th>
                    <th className="text-left py-2 text-cafe-muted/60 font-display text-xs tracking-wider">ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  {timeLogs.map(log => (
                    <tr key={log.id} className="border-b border-cafe-border/10 hover:bg-cafe-card/20 transition-colors">
                      <td className="py-2.5 pr-4">
                        <span className="font-display text-cafe-text">{log.user?.name || '—'}</span>
                        <span className="text-cafe-muted/50 text-xs ml-2">{log.user?.email}</span>
                      </td>
                      <td className="py-2.5 pr-4 text-cafe-muted">
                        {new Date(log.clock_in).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2.5 pr-4 text-cafe-muted">
                        {log.clock_out
                          ? new Date(log.clock_out).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </td>
                      <td className="py-2.5">
                        {log.clock_out ? (
                          <span className="text-xs text-cafe-muted/40 font-display">COMPLETADO</span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-green-500 font-display">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            EN CURSO
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-cafe-muted/50 text-sm text-center py-4">Sin fichados hoy</p>
          )}
        </div>

        {/* Asignar tareas */}
        <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <ListChecks className="w-6 h-6 text-cafe-burgundy-light" />
            <h2 className="font-display text-lg text-cafe-text">ASIGNAR TAREAS</h2>
          </div>

          <form onSubmit={handleAssignTask} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <select
              value={newTask.assigned_to}
              onChange={e => setNewTask({ ...newTask, assigned_to: e.target.value })}
              className="px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent"
              required
            >
              <option value="">Seleccionar staff</option>
              {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input type="text" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="Título de la tarea" className="px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent" required />
            <input type="text" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} placeholder="Descripción (opcional)" className="px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent" />
            <button type="submit" className="py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors rounded-xl shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40">
              ASIGNAR
            </button>
          </form>

          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="flex items-start gap-3 p-3 bg-cafe-card/30 rounded border border-cafe-border/20">
                <div className="flex-1">
                  <p className="text-sm text-cafe-text font-display">{task.title}</p>
                  {task.description && <p className="text-xs text-cafe-muted mt-0.5">{task.description}</p>}
                  <p className="text-xs text-cafe-muted mt-1">
                    Asignado a: {task.assigned?.name || '—'} · Estado: {task.status}
                    {task.due_date && ` · Vence: ${new Date(task.due_date).toLocaleDateString('es-AR')}`}
                  </p>
                </div>
                <button onClick={() => { if (window.confirm('¿Eliminar esta tarea?')) deleteAdminTask(task.id).then(loadData); }} className="text-cafe-muted hover:text-cafe-burgundy-light transition-colors shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {tasks.length === 0 && <p className="text-cafe-muted/50 text-sm text-center py-4">Sin tareas asignadas</p>}
          </div>
        </div>

        {/* Create Staff Modal */}
        {showCreateStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setShowCreateStaff(false)}>
            <div className="bg-cafe-surface border border-cafe-border w-full max-w-md rounded-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-cafe-border">
                <h2 className="font-display text-xl text-cafe-text">NUEVO MIEMBRO</h2>
                <button onClick={() => setShowCreateStaff(false)} className="text-cafe-muted hover:text-cafe-text"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateStaff} className="p-6 space-y-4">
                <input type="text" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} placeholder="Nombre" className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent" required />
                <input type="email" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent" required />
                <div className="flex items-center border border-cafe-border bg-cafe-bg focus-within:border-cafe-accent transition-colors">
                  <input type={showStaffPassword ? 'text' : 'password'} value={newStaff.password} onChange={e => setNewStaff({ ...newStaff, password: e.target.value })} placeholder="Contraseña" className="flex-1 px-3 py-2 bg-transparent text-cafe-text focus:outline-none" required />
                  <button type="button" onClick={() => setShowStaffPassword(!showStaffPassword)} className="mr-3 text-cafe-muted hover:text-cafe-text transition-colors shrink-0">
                    {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <select value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })} className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent">
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors rounded-xl shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40">CREAR</button>
                  <button type="button" onClick={() => setShowCreateStaff(false)} className="px-6 py-2 border border-cafe-border text-cafe-muted hover:text-cafe-text transition-colors">CANCELAR</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
