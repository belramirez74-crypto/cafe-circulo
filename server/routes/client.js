import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { supabase } from '../lib/supabase.js';
import { authenticateUser } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `client-avatar-${Date.now()}${ext}`);
  },
});
const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 3 * 1024 * 1024 },
});

const router = Router();

router.get('/promotions', authenticateUser, async (req, res) => {
  try {
    const { data } = await supabase
      .from('exclusive_promotions')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/event-banners', authenticateUser, async (req, res) => {
  try {
    const { data } = await supabase
      .from('event_banners')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('id, name, email, avatar_url, role, created_at')
      .eq('id', req.user.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile/avatar', authenticateUser, (req, res, next) => {
  avatarUpload.single('avatar')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envió imagen' });
    const avatarUrl = `/uploads/${req.file.filename}`;
    const { error } = await supabase
      .from('app_users')
      .update({ avatar_url: avatarUrl })
      .eq('id', req.user.id);
    if (error) throw error;
    res.json({ avatar_url: avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile/name', authenticateUser, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Nombre requerido' });
    const { error } = await supabase
      .from('app_users')
      .update({ name: name.trim() })
      .eq('id', req.user.id);
    if (error) throw error;
    res.json({ name: name.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/favorites/auto', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('item_name, category, menu_item_id, unit_price, quantity')
      .eq('client_id', req.user.id)
      .order('sold_at', { ascending: false });
    if (error) throw error;

    const counts = {};
    (data || []).forEach(s => {
      const key = s.item_name;
      if (!counts[key]) counts[key] = { item_name: s.item_name, category: s.category, menu_item_id: s.menu_item_id, unit_price: s.unit_price, total_quantity: 0, order_count: 0 };
      counts[key].total_quantity += s.quantity;
      counts[key].order_count++;
    });

    const top = Object.values(counts)
      .sort((a, b) => b.order_count - a.order_count)
      .slice(0, 5);

    res.json(top);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/favorites/pinned', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('client_favorites')
      .select('id, menu_item_id, created_at, menu_items(id, name, category, price, image_url)')
      .eq('client_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/favorites/pinned', authenticateUser, async (req, res) => {
  try {
    const { menu_item_id } = req.body;
    if (!menu_item_id) return res.status(400).json({ error: 'menu_item_id requerido' });
    const { data, error } = await supabase
      .from('client_favorites')
      .insert({ client_id: req.user.id, menu_item_id })
      .select()
      .single();
    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Ya está en tus favoritos' });
      throw error;
    }
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/favorites/pinned/:id', authenticateUser, async (req, res) => {
  try {
    const { error } = await supabase
      .from('client_favorites')
      .delete()
      .eq('id', req.params.id)
      .eq('client_id', req.user.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/favorites', authenticateUser, async (req, res) => {
  try {
    const { data } = await supabase
      .from('client_favorites')
      .select('*')
      .eq('client_id', req.user.id);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
