import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/landing', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('landing_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'No landing settings found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/landing', authenticateAdmin, async (req, res) => {
  try {
    const updates = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };
    delete updates.id;

    const { data, error } = await supabase
      .from('landing_settings')
      .update(updates)
      .eq('id', req.body.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
