import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getTodayTimeLogs, clockIn, clockOut, getStaffClients, getStaffTasks, getStaffSchedule, searchClients, addStaffClient } from '../../lib/api';
import { Clock, LogIn, LogOut, Calendar, Users, ListChecks, User, Coffee, Plus, Search, X, UserPlus } from 'lucide-react';

export default function StaffDashboard() {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [openEntry, setOpenEntry] = useState(null);
  const [todayEntries, setTodayEntries] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [clocking, setClocking] = useState(false);
  const [today, setToday] = useState('');
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const handleCalNav = (delta) => {
    const d = new Date(calYear, calMonth + delta, 1);
    setCalMonth(d.getMonth());
    setCalYear(d.getFullYear());
  };

  const handleDayClick = (day, dateStr) => {
    setSelectedDay(prev => prev === dateStr ? null : dateStr);
  };

  const selectedDayEvents = selectedDay
    ? events.filter(ev => ev.event_date?.startsWith(selectedDay))
    : [];

  useEffect(() => {
    if (!user || user.role === 'client') return navigate('/');
    setToday(new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    loadData();
  }, [user]);

  const loadData = () => {
    getTodayTimeLogs().then(r => { setOpenEntry(r.data.openEntry); setTodayEntries(r.data.entries || []); }).catch(() => {});
    getStaffClients().then(r => setClients(r.data)).catch(() => {});
    getStaffTasks().then(r => setTasks(r.data)).catch(() => {});
    getStaffSchedule().then(r => setEvents(r.data)).catch(() => {});
  };

  const handleClock = async (action) => {
    setClocking(true);
    try {
      if (action === 'in') {
        await clockIn();
      } else {
        await clockOut();
      }
      loadData();
    } catch (err) {
      alert('Error al fichar');
    } finally {
      setClocking(false);
    }
  };

  if (!user) return null;

  const handleSearchClient = async (q) => {
    setClientSearch(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await searchClients(q);
      const assignedIds = new Set(clients.map(c => c.client_id));
      setSearchResults(res.data.filter(c => !assignedIds.has(c.id)));
    } catch {}
    setSearching(false);
  };

  const handleAssignClient = async (clientId) => {
    try {
      await addStaffClient(clientId);
      setShowAddClient(false);
      setClientSearch('');
      setSearchResults([]);
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al asignar');
    }
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-cafe-text">STAFF DASHBOARD</h1>
            <p className="text-cafe-muted text-sm mt-1 capitalize">{today}</p>
          </div>
          <Link
            to="/staff/profile"
            className="flex items-center gap-2 px-4 py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors rounded-xl shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40"
          >
            <User className="w-4 h-4" /> MI PERFIL
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Clock In/Out */}
          <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-cafe-burgundy-light" />
              <h2 className="font-display text-lg text-cafe-text">FICHADO</h2>
            </div>

            {/* Last completed entry (if exists today) */}
            {!openEntry && todayEntries.length > 0 && (
              <div className="mb-4 p-3 bg-cafe-card/30 rounded border border-cafe-border/20">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-cafe-muted">
                      Entrada: <span className="text-cafe-text font-display">
                        {new Date(todayEntries[0].clock_in).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </p>
                    <p className="text-cafe-muted">
                      Salida: <span className="text-cafe-text font-display">
                        {todayEntries[0].clock_out
                          ? new Date(todayEntries[0].clock_out).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </span>
                    </p>
                  </div>
                  <span className="text-xs text-green-400 font-display tracking-wider bg-green-500/15 px-2 py-0.5 rounded">COMPLETADO</span>
                </div>
              </div>
            )}

            {/* Currently clocked in */}
            {openEntry ? (
              <div>
                <div className="p-3 bg-cafe-card/30 rounded border border-cafe-border/20 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-cafe-muted">
                        Entrada: <span className="text-cafe-text font-display">
                          {new Date(openEntry.clock_in).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </p>
                      <p className="text-cafe-muted">
                        Salida estimada: <span className="text-cafe-text font-display">17:00</span>
                      </p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
                <button
                  onClick={() => handleClock('out')}
                  disabled={clocking}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cafe-burgundy-light text-white font-display text-sm tracking-wider hover:bg-cafe-accent transition-colors disabled:opacity-50 rounded-xl shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40"
                >
                  <LogOut className="w-4 h-4" /> {clocking ? 'PROCESANDO...' : 'FICHAR SALIDA'}
                </button>
              </div>
            ) : (
              <div>
                {/* Show today's completed entries summary */}
                {todayEntries.length > 0 && (
                  <p className="text-xs text-cafe-muted/50 mb-3">
                    {todayEntries.length} registro{todayEntries.length !== 1 ? 's' : ''} hoy
                  </p>
                )}
                <button
                  onClick={() => handleClock('in')}
                  disabled={clocking}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors disabled:opacity-50 rounded-xl shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40"
                >
                  <LogIn className="w-4 h-4" /> {clocking ? 'PROCESANDO...' : 'FICHAR ENTRADA'}
                </button>
              </div>
            )}
          </div>

          {/* CALENDARIO */}
          <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-cafe-burgundy-light" />
                <h2 className="font-display text-lg text-cafe-text">CALENDARIO</h2>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleCalNav(-1)} className="p-1 text-cafe-muted hover:text-cafe-text transition-colors text-sm">&lt;</button>
                <span className="font-display text-sm text-cafe-text min-w-[120px] text-center">
                  {new Date(calYear, calMonth).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => handleCalNav(1)} className="p-1 text-cafe-muted hover:text-cafe-text transition-colors text-sm">&gt;</button>
              </div>
            </div>

            {/* Day-of-week header */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'].map((d, i) => (
                <div key={i} className="text-center text-xs text-cafe-muted/50 font-display py-1">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayEvents = events.filter(ev => ev.event_date?.startsWith(dateStr));
                const isToday = dateStr === todayStr;
                return (
                  <div
                    key={day}
                    onClick={() => handleDayClick(day, dateStr)}
                    className={`relative text-center py-1.5 text-sm rounded cursor-pointer transition-colors
                      ${isToday ? 'bg-cafe-accent/20 text-cafe-accent font-display' : ''}
                      ${dateStr === selectedDay ? 'ring-1 ring-cafe-accent bg-cafe-accent/10' : ''}
                      ${!isToday && dateStr !== selectedDay ? 'text-cafe-muted hover:bg-cafe-card/60' : ''}
                      ${dayEvents.length > 0 ? 'font-display' : ''}
                    `}
                    title={dayEvents.length > 0 ? dayEvents.map(e => e.title).join('\n') : ''}
                  >
                    {day}
                    {dayEvents.length > 0 && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayEvents.slice(0, 3).map((_, ei) => (
                          <span key={ei} className="w-1 h-1 rounded-full bg-cafe-accent" />
                        ))}
                        {dayEvents.length > 3 && <span className="w-1 h-1 rounded-full bg-cafe-accent" />}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Events for selected day */}
            {selectedDayEvents.length > 0 && (
              <div className="mt-4 pt-3 border-t border-cafe-border/40 space-y-1.5">
                <p className="text-xs text-cafe-muted/50 font-display uppercase tracking-wider mb-2">
                  Eventos — {selectedDay}
                </p>
                {selectedDayEvents.map(ev => (
                  <div key={ev.id} className="flex items-center gap-2 text-sm">
                    {ev.event_time && (
                      <span className="text-cafe-muted/60 text-xs shrink-0">
                        {ev.event_time.slice(0, 5)}
                      </span>
                    )}
                    <span className="text-cafe-muted">{ev.title}</span>
                    {ev.description && (
                      <span className="text-cafe-muted/70 text-xs truncate hidden sm:inline">{ev.description}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tareas pendientes */}
          <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <ListChecks className="w-6 h-6 text-cafe-burgundy-light" />
              <h2 className="font-display text-lg text-cafe-text">TAREAS</h2>
            </div>
            {tasks.filter(t => t.status !== 'completed').length > 0 ? (
              <div className="space-y-2">
                {tasks.filter(t => t.status !== 'completed').slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-start gap-2 text-sm">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${task.status === 'in_progress' ? 'bg-cafe-burgundy-light' : 'bg-cafe-muted'}`} />
                    <div>
                      <p className="text-cafe-muted truncate">{task.title}</p>
                      {task.description && <p className="text-xs text-cafe-muted/70 truncate">{task.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-cafe-muted/50 text-sm">Sin tareas pendientes</p>
            )}
          </div>
        </div>

        {/* Clients Section */}
        <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#5c1514]" />
              <h2 className="font-display text-lg text-cafe-text">MIS CLIENTES</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-cafe-muted text-sm">{clients.length} clientes</span>
              <button
                onClick={() => setShowAddClient(!showAddClient)}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-display text-xs tracking-wider transition-colors rounded-lg ${showAddClient ? 'bg-green-600 text-white' : 'bg-[#5c1514] text-white hover:bg-[#731c1a]'}`}
              >
                {showAddClient ? <X className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                {showAddClient ? 'CANCELAR' : 'ASIGNAR CLIENTE'}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {showAddClient && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted" />
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={e => handleSearchClient(e.target.value)}
                    placeholder="Buscar cliente por nombre..."
                    className="w-full pl-10 pr-4 py-2.5 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-[#5c1514] rounded-lg"
                    autoFocus
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-cafe-bg border border-cafe-border rounded-lg max-h-48 overflow-y-auto">
                    {searchResults.map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleAssignClient(c.id)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-cafe-card transition-colors text-left border-b border-cafe-border/30 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#5c1514]/10 flex items-center justify-center shrink-0">
                          {c.avatar_url ? (
                            <img src={c.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-[#5c1514]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-cafe-text font-display">{c.name || 'Cliente'}</p>
                          <p className="text-xs text-cafe-muted">{c.email}</p>
                        </div>
                        <Plus className="w-4 h-4 text-[#5c1514]" />
                      </button>
                    ))}
                  </div>
                )}
                {clientSearch.length >= 2 && searchResults.length === 0 && !searching && (
                  <p className="text-xs text-cafe-muted text-center py-3">No se encontraron clientes disponibles</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {clients.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {clients.map(sc => (
                <div key={sc.id} className="flex items-center gap-3 p-3 bg-cafe-card/50 rounded-xl border border-cafe-border/40">
                  <div className="w-10 h-10 rounded-full bg-[#5c1514]/10 flex items-center justify-center border border-[#5c1514]/20">
                    {sc.client?.avatar_url ? (
                      <img src={sc.client.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-[#5c1514]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm text-cafe-text truncate">{sc.client?.name || 'Cliente'}</p>
                    <p className="text-xs text-cafe-muted truncate">{sc.client?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-cafe-muted/50 text-sm text-center py-4">No tenés clientes asignados — usá "ASIGNAR CLIENTE" para agregar</p>
          )}
        </div>
      </div>
    </div>
  );
}
