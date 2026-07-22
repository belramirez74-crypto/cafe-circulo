import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { supabase } from '../lib/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});
const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 3 * 1024 * 1024 },
});

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const { data: user, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('email', email)
      .eq('role', 'admin')
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, admin: { id: user.id, email: user.email, name: user.name, role: user.role, avatar_url: user.avatar_url || null } });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/verify', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data: user } = await supabase
      .from('app_users')
      .select('avatar_url')
      .eq('id', decoded.id)
      .single();
    res.json({ valid: true, admin: { id: decoded.id, email: decoded.email, name: decoded.name, role: decoded.role, avatar_url: user?.avatar_url || null } });
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
});

router.put('/profile/avatar', authenticateAdmin, (req, res, next) => {
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
      .eq('id', req.adminId);
    if (error) throw error;

    res.json({ avatar_url: avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile/name', authenticateAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Nombre requerido' });

    const { error } = await supabase
      .from('app_users')
      .update({ name: name.trim() })
      .eq('id', req.adminId);
    if (error) throw error;

    res.json({ name: name.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/reminders', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admin_reminders')
      .select('*')
      .eq('user_id', req.adminId)
      .order('remind_at', { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reminders', authenticateAdmin, async (req, res) => {
  try {
    const { title, content, remind_at } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Título requerido' });
    if (!remind_at) return res.status(400).json({ error: 'Fecha y hora requeridas' });

    console.log('Creating reminder:', { userId: req.adminId, title, remind_at });

    const { data, error } = await supabase
      .from('admin_reminders')
      .insert({
        user_id: req.adminId,
        title: title.trim(),
        content: content?.trim() || null,
        remind_at: remind_at,
      })
      .select()
      .single();

    if (error) {
      console.log('Supabase error:', error);
      throw error;
    }
    console.log('Created:', data);
    res.status(201).json(data);
  } catch (err) {
    console.log('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/reminders/:id/done', authenticateAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('admin_reminders')
      .update({ is_done: true })
      .eq('id', req.params.id)
      .eq('user_id', req.adminId);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/reminders/:id', authenticateAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('admin_reminders')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.adminId);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
