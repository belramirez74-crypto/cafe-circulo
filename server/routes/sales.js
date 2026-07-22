import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Solo admin' });
  next();
};

router.get('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { from, to } = req.query;
    let query = supabase.from('sales').select('*').order('sold_at', { ascending: false });
    if (from) query = query.gte('sold_at', from);
    if (to) query = query.lte('sold_at', to);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/summary', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate;

    if (period === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    } else if (period === 'week') {
      const day = now.getDay();
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day).toISOString();
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1).toISOString();
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    }

    const { data: sales, error } = await supabase
      .from('sales')
      .select('*')
      .gte('sold_at', startDate);

    if (error) throw error;

    const items = sales || [];
    const totalRevenue = items.reduce((s, i) => s + parseFloat(i.total_price || 0), 0);
    const totalUnits = items.reduce((s, i) => s + (i.quantity || 0), 0);
    const avgTicket = items.length > 0 ? Math.round(totalRevenue / items.length) : 0;

    const itemCounts = {};
    items.forEach(s => {
      const name = s.item_name || 'Desconocido';
      if (!itemCounts[name]) itemCounts[name] = { name, category: s.category, quantity: 0, revenue: 0 };
      itemCounts[name].quantity += s.quantity || 0;
      itemCounts[name].revenue += parseFloat(s.total_price || 0);
    });

    const popular = Object.values(itemCounts).sort((a, b) => b.quantity - a.quantity);
    const topSelling = popular.slice(0, 10);
    const lowSelling = popular.filter(i => i.quantity <= 2).sort((a, b) => a.quantity - b.quantity);

    const { data: menuItems } = await supabase.from('menu_items').select('id, name, category, price, stock, featured');
    const menuNames = new Set(items.map(s => s.item_name));
    const neverSold = (menuItems || [])
      .filter(m => !menuNames.has(m.name) && m.stock)
      .map(m => ({ name: m.name, category: m.category, price: m.price, quantity: 0, revenue: 0 }));

    const byDay = {};
    items.forEach(s => {
      const day = (s.sold_at || s.created_at || '').slice(0, 10);
      if (!byDay[day]) byDay[day] = { day, revenue: 0, units: 0, count: 0 };
      byDay[day].revenue += parseFloat(s.total_price || 0);
      byDay[day].units += s.quantity || 0;
      byDay[day].count++;
    });

    const byCategory = {};
    items.forEach(s => {
      const cat = s.category || 'Sin categoría';
      if (!byCategory[cat]) byCategory[cat] = { name: cat, quantity: 0, revenue: 0 };
      byCategory[cat].quantity += s.quantity || 0;
      byCategory[cat].revenue += parseFloat(s.total_price || 0);
    });

    res.json({
      period,
      totalRevenue: Math.round(totalRevenue),
      totalUnits,
      totalTransactions: items.length,
      avgTicket,
      topSelling,
      lowSelling,
      neverSold,
      byDay: Object.values(byDay).sort((a, b) => a.day.localeCompare(b.day)),
      byCategory: Object.values(byCategory).sort((a, b) => b.revenue - a.revenue),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { menu_item_id, item_name, category, quantity, unit_price, notes, sold_at, client_id } = req.body;

    if (!item_name) return res.status(400).json({ error: 'Nombre del item requerido' });
    const qty = parseInt(quantity) || 1;
    const price = parseFloat(unit_price) || 0;

    const { data, error } = await supabase
      .from('sales')
      .insert([{
        menu_item_id: menu_item_id || null,
        item_name,
        category: category || null,
        quantity: qty,
        unit_price: price,
        total_price: qty * price,
        notes: notes || null,
        created_by: req.user.id,
        client_id: client_id || null,
        sold_at: sold_at || new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from('sales').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
