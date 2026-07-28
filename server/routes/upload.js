import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { supabase } from '../lib/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|webp|gif|svg|mp4|webm|mov)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Formato no soportado'));
    }
  },
});

const BUCKET = 'media';

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true });
  }
}
ensureBucket().catch(() => {});

const router = Router();

router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envió ninguna imagen' });
    const ext = path.extname(req.file.originalname) || '.jpg';
    const fileName = `menu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });
    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    res.json({ url: urlData.publicUrl, filename: fileName });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error al subir imagen' });
  }
});

router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { data: files, error } = await supabase.storage.from(BUCKET).list('', {
      limit: 200,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (error) throw error;

    const media = (files || [])
      .filter(f => /\.(jpg|jpeg|png|webp|gif|svg|mp4|webm|mov)$/i.test(f.name))
      .map(f => {
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
        return {
          filename: f.name,
          url: urlData.publicUrl,
          type: /\.(mp4|webm|mov)$/i.test(f.name) ? 'video' : 'image',
          uploaded_at: f.created_at,
        };
      });
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error al listar archivos' });
  }
});

export default router;
