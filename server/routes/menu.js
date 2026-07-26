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

    if (!rows.length) return res.status(400).json({ error: 'El archivo está vacío' });

    const cols = Object.keys(rows[0]);

    const findCol = (keywords) => {
      for (const col of cols) {
        const lower = col.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        for (const kw of keywords) {
          if (lower.includes(kw)) return col;
        }
      }
      return null;
    };

    const nameCol = findCol(['nombre', 'name', 'producto', 'item']);
    const descCol = findCol(['descripcion', 'descripción', 'description', 'desc']);
    const descEnCol = findCol(['descripcion_en', 'descripción_en', 'description_en', 'desc_en', 'inglés', 'ingles', 'english']);
    const priceCol = findCol(['precio', 'price', 'costo', 'cost', 'importe']);
    const catCol = findCol(['seccion', 'sección', 'categoria', 'categoría', 'category', 'section', 'sección']);
    const skuCol = findCol(['sku', 'código', 'codigo', 'code']);
    const imgCol = findCol(['imagen', 'image', 'foto', 'photo', 'img', 'url']);

    if (!nameCol) {
      return res.status(400).json({ error: `No se encontró columna de nombre. Columnas encontradas: ${cols.join(', ')}` });
    }

    const items = rows.map(r => {
      const name = r[nameCol] || '';
      if (!name) return null;
      return {
        name: String(name).trim(),
        description: descCol ? String(r[descCol] || '').trim() : '',
        description_en: descEnCol ? String(r[descEnCol] || '').trim() : '',
        price: parseFloat(String(r[priceCol] || '0').replace(',', '.')) || 0,
        category: catCol ? String(r[catCol] || 'Cafetería').trim() : 'Cafetería',
        sku: skuCol ? String(r[skuCol] || '').trim() : '',
        image_url: imgCol ? String(r[imgCol] || '').trim() : '',
        stock: true,
        featured: false,
      };
    }).filter(Boolean);

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
