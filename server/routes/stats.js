import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Solo admin' });
  next();
};

router.get('/overview', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const [menuRes, clientsRes, staffRes, eventsRes, promosRes, tasksRes, timeLogsRes] = await Promise.all([
      supabase.from('menu_items').select('id, stock, featured, category, price'),
      supabase.from('app_users').select('id, created_at').eq('role', 'client'),
      supabase.from('app_users').select('id, role').in('role', ['staff', 'admin']),
      supabase.from('events').select('id, date'),
      supabase.from('exclusive_promotions').select('id').eq('active', true),
      supabase.from('staff_tasks').select('id, status'),
      supabase.from('time_logs').select('id, clock_in, clock_out, user_id'),
    ]);

    const today = new Date().toISOString().split('T')[0];

    const menuItems = menuRes.data || [];
    const clients = clientsRes.data || [];
    const staff = staffRes.data || [];
    const events = eventsRes.data || [];
    const promos = promosRes.data || [];
    const tasks = tasksRes.data || [];
    const timeLogs = timeLogsRes.data || [];

    const todayLogs = timeLogs.filter(l => l.clock_in && l.clock_in.startsWith(today));
    const activeNow = todayLogs.filter(l => !l.clock_out).length;

    res.json({
      totalMenuItems: menuItems.length,
      itemsInStock: menuItems.filter(m => m.stock).length,
      itemsOutOfStock: menuItems.filter(m => !m.stock).length,
      featuredItems: menuItems.filter(m => m.featured).length,
      avgPrice: menuItems.length > 0
        ? Math.round(menuItems.reduce((s, m) => s + parseFloat(m.price || 0), 0) / menuItems.length)
        : 0,
      totalClients: clients.length,
      clientsThisMonth: clients.filter(c => c.created_at && c.created_at.startsWith(today.slice(0, 7))).length,
      totalStaff: staff.length,
      totalEvents: events.length,
      upcomingEvents: events.filter(e => e.date >= today).length,
      activePromos: promos.length,
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      activeStaffNow: activeNow,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/menu', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('id, category, price, stock, featured, created_at');

    if (error) throw error;

    const items = data || [];
    const byCategory = {};
    items.forEach(item => {
      if (!byCategory[item.category]) {
        byCategory[item.category] = { total: 0, inStock: 0, outOfStock: 0, featured: 0, totalPrice: 0 };
      }
      byCategory[item.category].total++;
      if (item.stock) byCategory[item.category].inStock++;
      else byCategory[item.category].outOfStock++;
      if (item.featured) byCategory[item.category].featured++;
      byCategory[item.category].totalPrice += parseFloat(item.price || 0);
    });

    Object.keys(byCategory).forEach(cat => {
      byCategory[cat].avgPrice = Math.round(byCategory[cat].totalPrice / byCategory[cat].total);
    });

    res.json({ categories: byCategory, total: items.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/staff', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [tasksRes, staffRes, timeLogsRes] = await Promise.all([
      supabase.from('staff_tasks').select('id, status, assigned_to, assigned:assigned_to(id, name)'),
      supabase.from('app_users').select('id, name, role').in('role', ['staff', 'admin']),
      supabase.from('time_logs').select('id, user_id, clock_in, clock_out, user:user_id(id, name)')
        .gte('created_at', today)
        .order('clock_in', { ascending: false }),
    ]);

    const tasks = tasksRes.data || [];
    const staff = staffRes.data || [];
    const todayLogs = timeLogsRes.data || [];

    const byStaff = {};
    staff.forEach(s => {
      byStaff[s.id] = { name: s.name, role: s.role, tasksTotal: 0, tasksCompleted: 0, hoursToday: 0, clockedIn: false };
    });

    tasks.forEach(t => {
      if (byStaff[t.assigned_to]) {
        byStaff[t.assigned_to].tasksTotal++;
        if (t.status === 'completed') byStaff[t.assigned_to].tasksCompleted++;
      }
    });

    const staffClockMap = {};
    todayLogs.forEach(log => {
      const uid = log.user_id;
      if (!staffClockMap[uid]) staffClockMap[uid] = { logs: [], clockedIn: false };
      staffClockMap[uid].logs.push(log);
      if (!log.clock_out) staffClockMap[uid].clockedIn = true;
    });

    Object.keys(staffClockMap).forEach(uid => {
      if (byStaff[uid]) {
        byStaff[uid].clockedIn = staffClockMap[uid].clockedIn;
        staffClockMap[uid].logs.forEach(log => {
          if (log.clock_out) {
            const start = new Date(log.clock_in);
            const end = new Date(log.clock_out);
            byStaff[uid].hoursToday += (end - start) / (1000 * 60 * 60);
          }
        });
      }
    });

    res.json({ staff: byStaff, todayLogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/clients', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const [clientsRes, favoritesRes] = await Promise.all([
      supabase.from('app_users').select('id, created_at, name').eq('role', 'client'),
      supabase.from('client_favorites').select('id, item_name, client_id'),
    ]);

    const clients = clientsRes.data || [];
    const favorites = favoritesRes.data || [];

    const last12 = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
      last12.push({ key, label, count: 0 });
    }

    clients.forEach(c => {
      if (c.created_at) {
        const key = c.created_at.slice(0, 7);
        const entry = last12.find(e => e.key === key);
        if (entry) entry.count++;
      }
    });

    const favCount = {};
    favorites.forEach(f => {
      const name = f.item_name || 'Sin nombre';
      favCount[name] = (favCount[name] || 0) + 1;
    });

    const topFavorites = Object.entries(favCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({ registrations: last12, topFavorites, totalClients: clients.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/events', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase.from('events').select('id, title, date');
    if (error) throw error;

    const events = data || [];
    const last12 = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
      last12.push({ key, label, count: 0 });
    }

    events.forEach(e => {
      if (e.date) {
        const key = e.date.slice(0, 7);
        const entry = last12.find(e2 => e2.key === key);
        if (entry) entry.count++;
      }
    });

    res.json({
      byMonth: last12,
      upcoming: events.filter(e => e.date >= today).length,
      past: events.filter(e => e.date < today).length,
      total: events.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
