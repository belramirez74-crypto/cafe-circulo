import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

// Profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    let { data } = await supabase.from('staff_profiles').select('*').eq('user_id', req.user.id).single();
    if (!data) {
      const { data: created } = await supabase.from('staff_profiles').insert({ user_id: req.user.id }).select().single();
      return res.json(created);
    }
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const { photo_url, position, notes } = req.body;
    const { data } = await supabase.from('staff_profiles').update({ photo_url, position, notes }).eq('user_id', req.user.id).select().single();
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Time logs
router.post('/time-logs', authenticateUser, async (req, res) => {
  try {
    if (req.body.action === 'out') {
      const { data: entries } = await supabase.from('time_logs').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false }).limit(10);
      const open = entries?.find(e => !e.clock_out);
      if (open) {
        const { data } = await supabase.from('time_logs').update({ clock_out: new Date().toISOString() }).eq('id', open.id).select().single();
        return res.json(data);
      }
      return res.status(400).json({ error: 'No hay entrada abierta' });
    }
    const { data } = await supabase.from('time_logs').insert({ user_id: req.user.id }).select().single();
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/time-logs', authenticateUser, async (req, res) => {
  try {
    const { data } = await supabase.from('time_logs').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false }).limit(20);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/time-logs/today', authenticateUser, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('time_logs').select('*').eq('user_id', req.user.id).gte('created_at', today).order('created_at', { ascending: false });
    const openEntry = data?.find(t => !t.clock_out) || null;
    res.json({ entries: data || [], openEntry });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Tasks
router.get('/tasks', authenticateUser, async (req, res) => {
  try {
    const { data } = await supabase.from('staff_tasks').select('*').eq('assigned_to', req.user.id).order('created_at', { ascending: false });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/tasks/:id/status', authenticateUser, async (req, res) => {
  try {
    const { data } = await supabase.from('staff_tasks').update({ status: req.body.status }).eq('id', req.params.id).eq('assigned_to', req.user.id).select().single();
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Reminders
router.get('/reminders', authenticateUser, async (req, res) => {
  try {
    const { data } = await supabase.from('staff_reminders').select('*').eq('user_id', req.user.id).order('reminder_date', { ascending: true });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/reminders', authenticateUser, async (req, res) => {
  try {
    const { data } = await supabase.from('staff_reminders').insert({ user_id: req.user.id, title: req.body.title, reminder_date: req.body.reminder_date }).select().single();
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/reminders/:id', authenticateUser, async (req, res) => {
  try {
    await supabase.from('staff_reminders').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Notes
router.get('/notes', authenticateUser, async (req, res) => {
  try {
    const { data } = await supabase.from('staff_notes').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/notes', authenticateUser, async (req, res) => {
  try {
    const { data } = await supabase.from('staff_notes').insert({ user_id: req.user.id, content: req.body.content }).select().single();
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/notes/:id', authenticateUser, async (req, res) => {
  try {
    await supabase.from('staff_notes').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Clients (staff's clients)
router.get('/clients', authenticateUser, async (req, res) => {
  try {
    const { data } = await supabase.from('staff_clients').select('*, client:client_id(id, email, name, role)').eq('staff_id', req.user.id);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/clients/search', authenticateUser, async (req, res) => {
  try {
    const q = req.query.q || '';
    const { data } = await supabase
      .from('app_users')
      .select('id, name, email, avatar_url')
      .eq('role', 'client')
      .ilike('name', `%${q}%`)
      .limit(20);
    res.json(data || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/clients', authenticateUser, async (req, res) => {
  try {
    const { data: existing } = await supabase.from('staff_clients').select('*').eq('staff_id', req.user.id).eq('client_id', req.body.client_id).maybeSingle();
    if (existing) return res.status(400).json({ error: 'Cliente ya agregado' });
    const { data } = await supabase.from('staff_clients').insert({ staff_id: req.user.id, client_id: req.body.client_id, notes: req.body.notes || '' }).select().single();
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/clients/:id', authenticateUser, async (req, res) => {
  try {
    await supabase.from('staff_clients').delete().eq('id', req.params.id).eq('staff_id', req.user.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Client favorites (what the client always orders)
router.get('/clients/:clientId/favorites', authenticateUser, async (req, res) => {
  try {
    const { data } = await supabase.from('client_favorites').select('*').eq('client_id', req.params.clientId);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Schedule events (shared calendar)
router.get('/schedule', authenticateUser, async (req, res) => {
  try {
    const { data } = await supabase.from('schedule_events').select('*').gte('event_date', new Date().toISOString().split('T')[0]).order('event_date', { ascending: true });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
