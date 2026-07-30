import { Router } from 'express';
import pkg from 'pg';
const { Pool } = pkg;

const router = Router();

router.post('/run', async (req, res) => {
  try {
    const projectRef = process.env.SUPABASE_URL?.match(/https:\/\/(.+)\.supabase\.co/)?.[1];
    if (!projectRef) return res.status(500).json({ error: 'No SUPABASE_URL' });

    const pool = new Pool({
      host: `db.${projectRef}.supabase.co`,
      port: 5432,
      database: 'postgres',
      user: 'service_role',
      password: process.env.SUPABASE_SERVICE_KEY,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    });

    const client = await pool.connect();
    await client.query('SET search_path TO cafe_circulo');

    await client.query(`ALTER TABLE landing_settings ADD COLUMN IF NOT EXISTS modules JSONB DEFAULT '[]'::jsonb`);
    console.log('modules column OK');

    await client.query(`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS recommended BOOLEAN DEFAULT false`);
    console.log('menu_items.recommended column OK');

    client.release();
    await pool.end();

    res.json({ success: true, message: 'Migration completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
