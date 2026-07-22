import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

// Verificar que sea admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Solo admin' });
  next();
};

// Listar staff
router.get('/staff', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { data } = await supabase
      .from('app_users')
      .select('id, email, name, role, created_at')
      .in('role', ['staff', 'admin'])
      .order('created_at', { ascending: false });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Crear staff
router.post('/staff', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const bcrypt = (await import('bcryptjs')).default;
    const hash = await bcrypt.hash(req.body.password, 10);
    const { data, error } = await supabase
      .from('app_users')
      .insert({ email: req.body.email, password_hash: hash, name: req.body.name, role: req.body.role || 'staff' })
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Eliminar staff
router.delete('/staff/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await supabase.from('app_users').delete().eq('id', req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Asignar tarea a staff
router.post('/tasks', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { data } = await supabase
      .from('staff_tasks')
      .insert({ created_by: req.user.id, assigned_to: req.body.assigned_to, title: req.body.title, description: req.body.description || '', due_date: req.body.due_date || null })
      .select()
      .single();
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Ver tareas de todo el staff
router.get('/tasks', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { data } = await supabase
      .from('staff_tasks')
      .select('*, assigned:assigned_to(id, name, email)')
      .order('created_at', { ascending: false });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Eliminar tarea
router.delete('/tasks/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await supabase.from('staff_tasks').delete().eq('id', req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Asignar recordatorio a staff
router.post('/reminders', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { data } = await supabase
      .from('staff_reminders')
      .insert({ user_id: req.body.user_id, title: req.body.title, reminder_date: req.body.reminder_date || null })
      .select()
      .single();
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Crear evento en calendario
router.post('/schedule-events', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { data } = await supabase
      .from('schedule_events')
      .insert({ created_by: req.user.id, title: req.body.title, description: req.body.description || '', event_date: req.body.event_date, event_time: req.body.event_time || null, visible_to: req.body.visible_to || 'staff' })
      .select()
      .single();
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Obtener todos los eventos del calendario
router.get('/schedule-events', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { data } = await supabase
      .from('schedule_events')
      .select('*')
      .order('event_date', { ascending: true });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Eliminar evento
router.delete('/schedule-events/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await supabase.from('schedule_events').delete().eq('id', req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Obtener fichados de todo el staff (hoy)
router.get('/time-logs', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('time_logs')
      .select('*, user:user_id(id, name, email)')
      .gte('created_at', today)
      .order('clock_in', { ascending: false });
    res.json(data || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Obtener todos los clientes
router.get('/clients', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { data } = await supabase
      .from('app_users')
      .select('id, email, name, role, created_at, avatar_url')
      .eq('role', 'client')
      .order('created_at', { ascending: false });
    res.json(data || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Obtener favoritos de un cliente (auto + pinned)
router.get('/clients/:id/favorites', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const clientId = req.params.id;

    // Auto favorites from sales
    const { data: sales } = await supabase
      .from('sales')
      .select('item_name, category, menu_item_id, unit_price, quantity')
      .eq('client_id', clientId)
      .order('sold_at', { ascending: false });

    const counts = {};
    (sales || []).forEach(s => {
      const key = s.item_name;
      if (!counts[key]) counts[key] = { item_name: s.item_name, category: s.category, unit_price: s.unit_price, total_quantity: 0, order_count: 0 };
      counts[key].total_quantity += s.quantity;
      counts[key].order_count++;
    });
    const autoFavorites = Object.values(counts)
      .sort((a, b) => b.order_count - a.order_count)
      .slice(0, 5);

    // Pinned favorites
    const { data: pinned } = await supabase
      .from('client_favorites')
      .select('id, created_at, menu_items(id, name, category, price, image_url)')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    res.json({ autoFavorites, pinnedFavorites: pinned || [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
