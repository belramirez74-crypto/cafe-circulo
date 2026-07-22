import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userAuthRoutes from './routes/userAuth.js';
import menuRoutes from './routes/menu.js';
import eventRoutes from './routes/events.js';
import settingsRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';
import staffRoutes from './routes/staff.js';
import clientRoutes from './routes/client.js';
import adminStaffRoutes from './routes/adminStaff.js';
import statsRoutes from './routes/stats.js';
import salesRoutes from './routes/sales.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3001'], credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/api/auth', authRoutes);
app.use('/api/auth/user', userAuthRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/admin', adminStaffRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/sales', salesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// SPA fallback - servir index.html para rutas que no son API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
