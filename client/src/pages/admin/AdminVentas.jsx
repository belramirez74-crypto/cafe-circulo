import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import { getSalesSummary, getSales, createSale, deleteSale, getMenuItems } from '../../lib/api';
import {
  TrendingUp, TrendingDown, ShoppingBag, DollarSign, BarChart3,
  Plus, Trash2, X, AlertTriangle, Star, Package, Clock
} from 'lucide-react';

const periods = [
  { key: 'today', label: 'HOY' },
  { key: 'week', label: 'SEMANA' },
  { key: 'month', label: 'MES' },
  { key: 'year', label: 'AÑO' },
];

export default function AdminVentas() {
  const [period, setPeriod] = useState('month');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [addForm, setAddForm] = useState({ menu_item_id: '', quantity: 1, notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [sumRes, menuRes] = await Promise.all([
        getSalesSummary(period),
        getMenuItems(),
      ]);
      setSummary(sumRes.data);
      setMenuItems(menuRes.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [period]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const item = menuItems.find(m => m.id === addForm.menu_item_id);
    if (!item) return;
    setSubmitting(true);
    try {
      await createSale({
        menu_item_id: item.id,
        item_name: item.name,
        category: item.category,
        quantity: parseInt(addForm.quantity) || 1,
        unit_price: parseFloat(item.price),
        notes: addForm.notes,
      });
      setShowAdd(false);
      setAddForm({ menu_item_id: '', quantity: 1, notes: '' });
      load();
    } catch {}
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminar este registro de venta?')) return;
    try {
      await deleteSale(id);
      load();
    } catch {}
  };

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cafe-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const s = summary || {};
  const maxQty = Math.max(...(s.topSelling || []).map(i => i.quantity), 1);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl text-cafe-text">
            VENTAS
          </motion.h1>
          <p className="text-cafe-muted mt-1">Seguimiento de ventas y popularidad del menú</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors rounded-xl shadow-lg shadow-black/30">
          <Plus className="w-4 h-4" /> REGISTRAR VENTA
        </button>
      </div>

      {/* Period Filter */}
      <div className="flex gap-2 mb-8">
        {periods.map(p => (
          <button key={p.key} onClick={() => setPeriod(p.key)}
            className={`px-4 py-2 text-sm font-display tracking-wider rounded-xl transition-colors ${
              period === p.key ? 'bg-cafe-accent text-white shadow-lg shadow-black/30' : 'bg-cafe-surface text-cafe-text border border-cafe-border hover:text-cafe-accent hover:border-cafe-accent'
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Report Card */}
      <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-cafe-accent" />
          <h2 className="font-display text-lg text-cafe-text">REPORTE DE VENTAS — {periods.find(p => p.key === period)?.label}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-cafe-bg/50 border border-cafe-border/50 p-4 rounded-xl text-center">
            <DollarSign className="w-4 h-4 text-cafe-accent mx-auto mb-1" />
            <p className="text-xs text-[#1a1210] font-display tracking-wider mb-1">INGRESOS</p>
            <p className="font-display text-xl text-cafe-accent">${(s.totalRevenue || 0).toLocaleString('es-AR')}</p>
          </div>
          <div className="bg-cafe-bg/50 border border-cafe-border/50 p-4 rounded-xl text-center">
            <ShoppingBag className="w-4 h-4 text-cafe-accent mx-auto mb-1" />
            <p className="text-xs text-[#1a1210] font-display tracking-wider mb-1">UNIDADES</p>
            <p className="font-display text-xl text-cafe-accent">{s.totalUnits || 0}</p>
          </div>
          <div className="bg-cafe-bg/50 border border-cafe-border/50 p-4 rounded-xl text-center">
            <BarChart3 className="w-4 h-4 text-cafe-accent mx-auto mb-1" />
            <p className="text-xs text-[#1a1210] font-display tracking-wider mb-1">TRANSACCIONES</p>
            <p className="font-display text-xl text-cafe-accent">{s.totalTransactions || 0}</p>
          </div>
          <div className="bg-cafe-bg/50 border border-cafe-border/50 p-4 rounded-xl text-center">
            <TrendingUp className="w-4 h-4 text-cafe-accent mx-auto mb-1" />
            <p className="text-xs text-[#1a1210] font-display tracking-wider mb-1">TICKET PROM.</p>
            <p className="font-display text-xl text-cafe-accent">${(s.avgTicket || 0).toLocaleString('es-AR')}</p>
          </div>
          <div className="bg-cafe-bg/50 border border-cafe-border/50 p-4 rounded-xl text-center">
            <Star className="w-4 h-4 text-cafe-accent mx-auto mb-1" />
            <p className="text-xs text-[#1a1210] font-display tracking-wider mb-1">TOP VENDIDO</p>
            <p className="font-display text-sm text-cafe-accent truncate" title={(s.topSelling || [])[0]?.name || '-'}>
              {(s.topSelling || [])[0]?.name || '-'}
            </p>
            <p className="text-xs text-[#1a1210]">{(s.topSelling || [])[0] ? `${(s.topSelling || [])[0].quantity} u` : ''}</p>
          </div>
          <div className="bg-cafe-bg/50 border border-cafe-border/50 p-4 rounded-xl text-center">
            <Package className="w-4 h-4 text-cafe-accent mx-auto mb-1" />
            <p className="text-xs text-[#1a1210] font-display tracking-wider mb-1">SIN VENTAS</p>
            <p className="font-display text-xl text-cafe-accent">{(s.neverSold || []).length}</p>
            <p className="text-xs text-[#1a1210]">items</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Selling */}
        <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-5 h-5 text-cafe-accent" />
            <h2 className="font-display text-lg text-cafe-text">MÁS VENDIDOS</h2>
          </div>
          {(s.topSelling || []).length === 0 ? (
            <p className="text-cafe-muted text-sm">Sin datos de ventas aún</p>
          ) : (
            <div className="space-y-3">
              {s.topSelling.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-xs text-cafe-muted w-5 text-right font-display">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-cafe-text truncate">{item.name}</span>
                      <span className="text-xs text-[#1a1210] font-semibold shrink-0 ml-2">{item.quantity} u · ${item.revenue.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="h-2 bg-cafe-bg rounded-full overflow-hidden">
                      <div className="h-full bg-cafe-accent rounded-full transition-all" style={{ width: `${(item.quantity / maxQty) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Selling / Never Sold */}
        <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-cafe-accent" />
            <h2 className="font-display text-lg text-[#1a1210]">RECOMENDAR A CLIENTES</h2>
          </div>
          <p className="text-[#1a1210] text-xs mb-4">Estos productos se venden poco o nunca. Promocionalos más.</p>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {(s.neverSold || []).length > 0 && (
              <>
                <p className="text-sm font-display text-[#1a1210] tracking-wider mb-2 font-semibold">NUNCA SE VENDIÓ</p>
                {s.neverSold.map(item => (
                  <div key={item.name} className="flex items-center gap-3 p-3 bg-cafe-bg/50 rounded-xl border border-cafe-border/50">
                    <Package className="w-4 h-4 text-[#1a1210] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1a1210] truncate">{item.name}</p>
                      <p className="text-xs text-[#1a1210]">{item.category} · ${parseFloat(item.price).toLocaleString('es-AR')}</p>
                    </div>
                    <span className="text-xs text-cafe-accent font-display shrink-0">0 vendidos</span>
                  </div>
                ))}
              </>
            )}
            {(s.lowSelling || []).length > 0 && (
              <>
                <p className="text-sm font-display text-[#1a1210] tracking-wider mt-4 mb-2 font-semibold">POCA VENTA</p>
                {s.lowSelling.map(item => (
                  <div key={item.name} className="flex items-center gap-3 p-3 bg-cafe-bg/50 rounded-xl border border-cafe-border/50">
                    <TrendingDown className="w-4 h-4 text-cafe-accent shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1a1210] truncate">{item.name}</p>
                      <p className="text-xs text-[#1a1210]">{item.category}</p>
                    </div>
                    <span className="text-xs text-yellow-500 font-display shrink-0">{item.quantity} vendidos</span>
                  </div>
                ))}
              </>
            )}
            {(s.neverSold || []).length === 0 && (s.lowSelling || []).length === 0 && (
              <p className="text-cafe-muted text-sm">Todos los items tienen ventas</p>
            )}
          </div>
        </div>
      </div>

      {/* Sales by Category */}
      {(s.byCategory || []).length > 0 && (
        <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl mb-8">
          <h2 className="font-display text-lg text-cafe-text mb-4">VENTAS POR CATEGORÍA</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {s.byCategory.map(cat => (
              <div key={cat.name} className="bg-cafe-bg/50 border border-cafe-border/50 p-4 rounded-xl text-center">
                <p className="text-xs text-cafe-muted font-display tracking-wider mb-1">{cat.name.toUpperCase()}</p>
                <p className="font-display text-xl text-cafe-text">{cat.quantity} u</p>
                <p className="text-xs text-cafe-text">${cat.revenue.toLocaleString('es-AR')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue by Day Chart */}
      {(s.byDay || []).length > 0 && (() => {
        const days = s.byDay;
        const bestDay = [...days].sort((a, b) => b.revenue - a.revenue)[0];
        const worstDay = [...days].sort((a, b) => a.revenue - b.revenue)[0];
        const avgDaily = Math.round(days.reduce((sum, d) => sum + d.revenue, 0) / days.length);
        const totalRev = days.reduce((sum, d) => sum + d.revenue, 0);
        const chartData = days.map(d => ({
          day: d.day.slice(5),
          fullDay: d.day,
          revenue: d.revenue,
          units: d.units,
          count: d.count,
        }));
        const CustomTooltip = ({ active, payload }) => {
          if (!active || !payload?.length) return null;
          const d = payload[0].payload;
          return (
            <div className="bg-cafe-bg border border-cafe-border px-4 py-3 rounded-xl shadow-xl">
              <p className="font-display text-sm text-[#1a1210] mb-1">{d.fullDay}</p>
              <p className="font-display text-2xl text-[#1a1210] font-bold">${d.revenue.toLocaleString('es-AR')}</p>
              <div className="flex gap-3 mt-1">
                <span className="text-xs text-[#1a1210]">{d.units} unidades</span>
                <span className="text-xs text-[#1a1210]">{d.count} ventas</span>
              </div>
            </div>
          );
        };
        return (
          <div className="bg-cafe-surface border border-cafe-border p-6 rounded-xl mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-lg text-cafe-text">INGRESOS POR DÍA</h2>
                <p className="text-sm text-[#1a1210] font-bold mt-1">Total: ${totalRev.toLocaleString('es-AR')} · {days.length} días</p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-display">
                <span className="flex items-center gap-1.5 text-[#1a1210] font-bold text-sm"><span className="w-2 h-2 rounded-full bg-green-500" />MEJOR: ${bestDay.revenue.toLocaleString('es-AR')}</span>
                <span className="flex items-center gap-1.5 text-[#1a1210] font-bold text-sm"><span className="w-2 h-2 rounded-full bg-cafe-accent" />PROM: ${avgDaily.toLocaleString('es-AR')}</span>
                <span className="flex items-center gap-1.5 text-[#1a1210] font-bold text-sm"><span className="w-2 h-2 rounded-full bg-red-500" />MENOR: ${worstDay.revenue.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(181,168,154,0.15)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#1a1210', fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 600 }}
                    axisLine={{ stroke: 'rgba(181,168,154,0.3)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#1a1210', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => v >= 1000 ? `$${Math.round(v/1000)}k` : `$${v}`}
                    width={45}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(82,18,14,0.1)', radius: 6 }} />
                  <ReferenceLine
                    y={avgDaily}
                    stroke="#eab308"
                    strokeDasharray="6 4"
                    strokeWidth={1.5}
                    label={{ value: 'PROM', position: 'right', fill: '#1a1210', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600 }}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.day}
                        fill={
                          entry.fullDay === bestDay.day ? '#22c55e' :
                          entry.fullDay === worstDay.day ? '#ef4444' :
                          '#491716'
                        }
                        className="transition-opacity hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })()}

      {/* Add Sale Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-cafe-surface border border-cafe-border p-6 rounded-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-cafe-text">REGISTRAR VENTA</h2>
                <button onClick={() => setShowAdd(false)} className="text-cafe-muted hover:text-cafe-text"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">PRODUCTO</label>
                  <select value={addForm.menu_item_id} onChange={e => setAddForm({ ...addForm, menu_item_id: e.target.value })}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent rounded-xl" required>
                    <option value="">Seleccionar producto...</option>
                    {menuItems.filter(m => m.stock).map(m => (
                      <option key={m.id} value={m.id}>{m.name} — ${parseFloat(m.price).toLocaleString('es-AR')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">CANTIDAD</label>
                  <input type="number" min="1" value={addForm.quantity}
                    onChange={e => setAddForm({ ...addForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent rounded-xl" required />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">NOTAS (opcional)</label>
                  <input type="text" value={addForm.notes} onChange={e => setAddForm({ ...addForm, notes: e.target.value })}
                    placeholder="Ej: venta por delivery"
                    className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent rounded-xl" />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-2 bg-cafe-accent text-cafe-text font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors disabled:opacity-50 rounded-xl shadow-lg shadow-black/30">
                  {submitting ? 'REGISTRANDO...' : 'REGISTRAR'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
