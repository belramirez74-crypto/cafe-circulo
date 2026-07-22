import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticateAdmin } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|webp|gif|svg|mp4|webm|mov)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Formato no soportado. Imágenes: jpg, png, webp, gif, svg. Videos: mp4, webm, mov'));
    }
  },
});

const router = Router();

router.post('/', authenticateAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se envió ninguna imagen' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

router.get('/', authenticateAdmin, (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Error al leer archivos' });
    const media = files
      .filter(f => /\.(jpg|jpeg|png|webp|gif|svg|mp4|webm|mov)$/i.test(f))
      .map(f => ({
        filename: f,
        url: `/uploads/${f}`,
        type: /\.(mp4|webm|mov)$/i.test(f) ? 'video' : 'image',
        uploaded_at: fs.statSync(path.join(uploadsDir, f)).mtime,
      }))
      .sort((a, b) => b.uploaded_at - a.uploaded_at);
    res.json(media);
  });
});

export default router;
