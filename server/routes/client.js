import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

// Promociones exclusivas (para clientes logueados)
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

// Banners de eventos (para clientes logueados)
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

// Pedidos frecuentes del propio cliente
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
