import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getStatsOverview, getStatsMenu, getStatsStaff, getStatsClients, getStatsEvents } from '../../lib/api';
import { Users, ShoppingBag, Calendar, ClipboardList, TrendingUp, Clock, Star, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

function KPICard({ icon: Icon, label, value, sub, color = 'text-[#5c1514]' }) {
  return (
    <div className="bg-cafe-surface border border-cafe-border p-5 rounded-xl">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-cafe-card`}>
          <Icon className={`w-5 h-5 text-[#5c1514]`} />
        </div>
        <span className="font-body text-xs text-cafe-muted tracking-wide">{label}</span>
      </div>
      <p className="font-display text-3xl text-cafe-text">{value}</p>
      {sub && <p className="font-body text-xs text-cafe-muted-dark mt-1">{sub}</p>}
    </div>
  );
}

function BarChart({ data, maxVal, labelKey, valueKey, color = 'bg-[#5c1514]' }) {
  const max = maxVal || Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="font-body text-xs text-cafe-muted w-20 text-right truncate">{item[labelKey]}</span>
          <div className="flex-1 h-5 bg-cafe-card rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item[valueKey] / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className={`h-full ${color} rounded`}
            />
          </div>
          <span className="font-body text-xs text-cafe-text w-8 text-right">{item[valueKey]}</span>
        </div>
      ))}
    </div>
  );
}

function MiniBarChart({ data, labelKey, valueKey, height = 80 }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  const barWidth = Math.max(Math.floor(100 / data.length) - 2, 4);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(item[valueKey] / max) * 100}%` }}
            transition={{ duration: 0.5, delay: i * 0.03 }}
            className="w-full bg-[#5c1514]/80 rounded-t min-h-[2px]"
          />
        </div>
      ))}
    </div>
  );
}

function MiniBarLabels({ data, labelKey }) {
  const skip = data.length > 8 ? Math.ceil(data.length / 8) : 1;
  return (
    <div className="flex gap-1 mt-1">
      {data.map((item, i) => (
        <div key={i} className="flex-1 text-center">
          {i % skip === 0 && (
            <span className="font-body text-[9px] text-cafe-muted-dark leading-none">{item[labelKey]}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function TaskBar({ label, count, total, color }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="font-body text-xs text-cafe-muted w-24 text-right">{label}</span>
      <div className="flex-1 h-6 bg-cafe-card rounded overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6 }}
          className={`h-full ${color} rounded flex items-center justify-end pr-2`}
        >
          {count > 0 && <span className="font-body text-[10px] text-white font-medium">{count}</span>}
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminStats() {
  const [overview, setOverview] = useState(null);
  const [menu, setMenu] = useState(null);
  const [staff, setStaff] = useState(null);
  const [clients, setClients] = useState(null);
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getStatsOverview().catch(() => ({ data: null })),
      getStatsMenu().catch(() => ({ data: null })),
      getStatsStaff().catch(() => ({ data: null })),
      getStatsClients().catch(() => ({ data: null })),
      getStatsEvents().catch(() => ({ data: null })),
    ]).then(([ov, me, st, cl, ev]) => {
      setOverview(ov.data);
      setMenu(me.data);
      setStaff(st.data);
      setClients(cl.data);
      setEvents(ev.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3rem)]">
        <div className="w-8 h-8 border-2 border-[#5c1514] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const menuCategories = menu?.categories ? Object.entries(menu.categories).map(([name, v]) => ({
    name, total: v.total, inStock: v.inStock, outOfStock: v.outOfStock, avgPrice: v.avgPrice,
  })) : [];

  const staffMembers = staff?.staff ? Object.entries(staff.staff).map(([id, v]) => ({
    id, ...v,
  })) : [];

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl text-cafe-text"
          >
            REPORTES
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-body text-cafe-muted mt-2"
          >
            Resumen general del café
          </motion.p>
        </div>

        {/* KPI Cards */}
        {overview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <KPICard icon={ShoppingBag} label="Items en menú" value={overview.totalMenuItems} sub={`${overview.itemsInStock} disponibles`} />
            <KPICard icon={Users} label="Clientes" value={overview.totalClients} sub={`+${overview.clientsThisMonth} este mes`} color="text-cafe-burgundy-light" />
            <KPICard icon={ClipboardList} label="Tareas pendientes" value={overview.pendingTasks} sub={`${overview.completedTasks} completadas`} color="text-cafe-cream" />
            <KPICard icon={Calendar} label="Eventos" value={overview.upcomingEvents} sub={`${overview.totalEvents} totales`} />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Menu by Category */}
          {menuCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-cafe-surface border border-cafe-border p-6 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <BarChart3 className="w-5 h-5 text-[#5c1514]" />
                <h2 className="font-display text-lg text-cafe-text">MENÚ POR CATEGORÍA</h2>
              </div>
              <BarChart
                data={menuCategories}
                maxVal={Math.max(...menuCategories.map(c => c.total))}
                labelKey="name"
                valueKey="total"
              />
              <div className="mt-4 pt-4 border-t border-cafe-border/40 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="font-display text-xl text-cafe-text">{overview?.itemsInStock || 0}</p>
                  <p className="font-body text-[10px] text-cafe-muted-dark">EN STOCK</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-xl text-cafe-text">{overview?.itemsOutOfStock || 0}</p>
                  <p className="font-body text-[10px] text-cafe-muted-dark">SIN STOCK</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-xl text-white">${overview?.avgPrice?.toLocaleString('es-AR') || 0}</p>
                  <p className="font-body text-[10px] text-cafe-muted-dark">PRECIO PROM.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Staff Status */}
          {staff && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-cafe-surface border border-cafe-border p-6 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <Users className="w-5 h-5 text-[#5c1514]" />
                <h2 className="font-display text-lg text-cafe-text">STAFF</h2>
              </div>
              <div className="space-y-3">
                {staffMembers.length > 0 ? staffMembers.map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-3 bg-cafe-card/30 rounded-lg border border-cafe-border/20">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${s.clockedIn ? 'bg-green-500' : 'bg-cafe-muted/30'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-body text-sm text-cafe-text truncate">{s.name}</span>
                        <span className="font-body text-[10px] text-cafe-muted-dark uppercase">{s.role}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-body text-[10px] text-cafe-muted">
                          {s.tasksCompleted}/{s.tasksTotal} tareas
                        </span>
                        <span className="font-body text-[10px] text-cafe-muted">
                          {s.hoursToday > 0 ? `${s.hoursToday.toFixed(1)}h hoy` : 'Sin fichar'}
                        </span>
                      </div>
                    </div>
                    {s.tasksTotal > 0 && (
                      <div className="w-16 h-1.5 bg-cafe-card rounded-full overflow-hidden shrink-0">
                        <div
                          className="h-full bg-cafe-accent rounded-full"
                          style={{ width: `${(s.tasksCompleted / s.tasksTotal) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                )) : (
                  <p className="font-body text-sm text-cafe-muted text-center py-4">Sin miembros de staff</p>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Client Registrations */}
          {clients && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-cafe-surface border border-cafe-border p-6 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <TrendingUp className="w-5 h-5 text-[#5c1514]" />
                <h2 className="font-display text-lg text-cafe-text">REGISTROS CLIENTES</h2>
              </div>
              <MiniBarChart data={clients.registrations} labelKey="label" valueKey="count" height={100} />
              <MiniBarLabels data={clients.registrations} labelKey="label" />
              <div className="mt-4 pt-4 border-t border-cafe-border/40">
                <p className="font-body text-xs text-cafe-muted-dark">
                  Total: <span className="text-cafe-text font-medium">{clients.totalClients}</span> clientes registrados
                </p>
              </div>
            </motion.div>
          )}

          {/* Tasks Summary */}
          {overview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-cafe-surface border border-cafe-border p-6 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <ClipboardList className="w-5 h-5 text-[#5c1514]" />
                <h2 className="font-display text-lg text-cafe-text">RESUMEN TAREAS</h2>
              </div>
              <div className="space-y-3">
                <TaskBar
                  label="Pendientes"
                  count={overview.pendingTasks}
                  total={overview.totalTasks || 1}
                  color="bg-cafe-muted/40"
                />
                <TaskBar
                  label="En progreso"
                  count={(overview.totalTasks || 0) - overview.pendingTasks - overview.completedTasks}
                  total={overview.totalTasks || 1}
                  color="bg-yellow-600/70"
                />
                <TaskBar
                  label="Completadas"
                  count={overview.completedTasks}
                  total={overview.totalTasks || 1}
                  color="bg-green-600/70"
                />
              </div>
              <div className="mt-4 pt-4 border-t border-cafe-border/40 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-body text-xs text-cafe-muted">
                    {overview.totalTasks > 0 ? Math.round((overview.completedTasks / overview.totalTasks) * 100) : 0}% completado
                  </span>
                </div>
                {overview.pendingTasks > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="font-body text-xs text-cafe-muted">
                      {overview.pendingTasks} pendiente{overview.pendingTasks !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Favorites */}
          {clients?.topFavorites?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-cafe-surface border border-cafe-border p-6 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <Star className="w-5 h-5 text-[#5c1514]" />
                <h2 className="font-display text-lg text-cafe-text">TOP FAVORITOS</h2>
              </div>
              <div className="space-y-2">
                {clients.topFavorites.map((fav, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-cafe-card/30 rounded-lg">
                    <span className="font-display text-sm text-[#5c1514] w-6 text-center">{i + 1}</span>
                    <span className="font-body text-sm text-cafe-text flex-1 truncate">{fav.name}</span>
                    <span className="font-body text-xs text-cafe-muted">{fav.count} pedido{fav.count !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Events Timeline */}
          {events && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-cafe-surface border border-cafe-border p-6 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <Calendar className="w-5 h-5 text-[#5c1514]" />
                <h2 className="font-display text-lg text-cafe-text">EVENTOS POR MES</h2>
              </div>
              <MiniBarChart data={events.byMonth} labelKey="label" valueKey="count" height={100} />
              <MiniBarLabels data={events.byMonth} labelKey="label" />
              <div className="mt-4 pt-4 border-t border-cafe-border/40 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="font-display text-xl text-cafe-text">{events.total}</p>
                  <p className="font-body text-[10px] text-cafe-muted-dark">TOTALES</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-xl text-green-500">{events.upcoming}</p>
                  <p className="font-body text-[10px] text-cafe-muted-dark">PRÓXIMOS</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-xl text-cafe-muted">{events.past}</p>
                  <p className="font-body text-[10px] text-cafe-muted-dark">PASADOS</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
