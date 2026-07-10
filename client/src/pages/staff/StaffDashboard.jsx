import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { getTodayTimeLogs, clockIn, clockOut, getStaffClients, getStaffTasks, getStaffSchedule } from '../../lib/api';
import { Clock, LogIn, LogOut, Calendar, Users, ListChecks, User, Coffee } from 'lucide-react';

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
            className="flex items-center gap-2 px-4 py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors"
          >
            <User className="w-4 h-4" /> MI PERFIL
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Clock In/Out */}
          <div className="bg-cafe-surface border border-cafe-border p-6">
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
                  <span className="text-xs text-cafe-accent/60 font-display">COMPLETADO</span>
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cafe-burgundy-light text-white font-display text-sm tracking-wider hover:bg-cafe-accent transition-colors disabled:opacity-50"
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" /> {clocking ? 'PROCESANDO...' : 'FICHAR ENTRADA'}
                </button>
              </div>
            )}
          </div>

          {/* CALENDARIO */}
          <div className="bg-cafe-surface border border-cafe-border p-6">
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
              {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
                <div key={d} className="text-center text-xs text-cafe-muted/50 font-display py-1">{d}</div>
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
                      <span className="text-cafe-muted/40 text-xs truncate hidden sm:inline">{ev.description}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tareas pendientes */}
          <div className="bg-cafe-surface border border-cafe-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <ListChecks className="w-6 h-6 text-cafe-burgundy-light" />
              <h2 className="font-display text-lg text-cafe-text">TAREAS</h2>
            </div>
            {tasks.filter(t => t.status !== 'completed').length > 0 ? (
              <div className="space-y-2">
                {tasks.filter(t => t.status !== 'completed').slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-start gap-2 text-sm">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${task.status === 'in_progress' ? 'bg-cafe-burgundy-light' : 'bg-cafe-muted'}`} />
                    <span className="text-cafe-muted truncate">{task.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-cafe-muted/50 text-sm">Sin tareas pendientes</p>
            )}
          </div>
        </div>

        {/* Clients Section */}
        <div className="bg-cafe-surface border border-cafe-border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-cafe-burgundy-light" />
              <h2 className="font-display text-lg text-cafe-text">MIS CLIENTES</h2>
            </div>
            <span className="text-cafe-muted text-sm">{clients.length} clientes</span>
          </div>
          {clients.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {clients.map(sc => (
                <div key={sc.id} className="flex items-center gap-3 p-3 bg-cafe-card/50 rounded border border-cafe-border/40">
                  <div className="w-10 h-10 rounded-full bg-cafe-surface border border-cafe-border/60 flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-cafe-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm text-cafe-text truncate">{sc.client?.name || 'Cliente'}</p>
                    <p className="text-xs text-cafe-muted truncate">{sc.client?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-cafe-muted/50 text-sm text-center py-4">No tenés clientes asignados todavía</p>
          )}
        </div>
      </div>
    </div>
  );
}
