import { Router } from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import { supabase } from '../lib/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('stock', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/all', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('featured', true)
      .eq('stock', true);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image_url, stock, featured } = req.body;
    const { data, error } = await supabase
      .from('menu_items')
      .insert([{ name, description, price, category, image_url, stock: stock ?? true, featured: featured ?? false }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/import', authenticateAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envió archivo' });

    const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

    const items = rows.map(r => ({
      name: r.Nombre || r.nombre || r.name || '',
      description: r.Descripción || r.Descripcion || r.description || '',
      price: parseFloat(r.Precio || r.precio || r.price || 0),
      category: r.Categoría || r.Categoria || r.category || 'Cafetería',
      image_url: r.Imagen || r.imagen || r.image_url || '',
      stock: true,
      featured: false,
    })).filter(i => i.name);

    if (!items.length) return res.status(400).json({ error: 'No se encontraron items válidos' });

    const { data, error } = await supabase
      .from('menu_items')
      .insert(items)
      .select();

    if (error) throw error;
    res.status(201).json({ imported: data.length, items: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
