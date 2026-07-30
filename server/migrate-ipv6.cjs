require('dotenv').config();
const { Pool } = require('pg');

async function run() {
  const pool = new Pool({
    host: '2600:1f18:16e0:2805:fa76:a3c:a07d:7bf8',
    port: 5432,
    database: 'postgres',
    user: 'service_role',
    password: process.env.SUPABASE_SERVICE_KEY,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    console.log('Connected!');
    await client.query('SET search_path TO cafe_circulo');
    await client.query(`ALTER TABLE landing_settings ADD COLUMN IF NOT EXISTS modules JSONB DEFAULT '[]'::jsonb`);
    console.log('modules column OK');
    await client.query(`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS recommended BOOLEAN DEFAULT false`);
    console.log('menu_items.recommended column OK');
    client.release();
    await pool.end();
    console.log('Migration completed!');
  } catch (err) {
    console.log('Error:', err.message);
    process.exit(1);
  }
}

run();
