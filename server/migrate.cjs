require('dotenv').config();
const { Pool } = require('pg');

const projectRef = process.env.SUPABASE_URL?.match(/https:\/\/(.+)\.supabase\.co/)?.[1];
const host = `db.${projectRef}.supabase.co`;

async function run() {
  // Try connecting with service key as password (JWT auth)
  const pool = new Pool({
    host,
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

    await client.query(`
      ALTER TABLE landing_settings 
      ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb
    `);
    console.log('gallery_images column OK');

    await client.query(`
      ALTER TABLE landing_settings 
      ADD COLUMN IF NOT EXISTS recommended_items JSONB DEFAULT '[]'::jsonb
    `);
    console.log('recommended_items column OK');

    await client.query(`
      ALTER TABLE landing_settings 
      ADD COLUMN IF NOT EXISTS menu_categories JSONB DEFAULT '["Cafetería", "Dulces", "Saladitos", "Bebidas"]'::jsonb
    `);
    console.log('menu_categories column OK');

    await client.query(`
      ALTER TABLE landing_settings 
      ADD COLUMN IF NOT EXISTS menu_categories_en JSONB DEFAULT '["Coffee", "Sweets", "Savory", "Drinks"]'::jsonb
    `);
    console.log('menu_categories_en column OK');

    await client.query(`
      ALTER TABLE landing_settings 
      ADD COLUMN IF NOT EXISTS modules JSONB DEFAULT '[]'::jsonb
    `);
    console.log('modules column OK');

    await client.query(`
      ALTER TABLE menu_items 
      ADD COLUMN IF NOT EXISTS recommended BOOLEAN DEFAULT false
    `);
    console.log('menu_items.recommended column OK');

    client.release();
    await pool.end();
    console.log('Migrations completed!');
  } catch (err) {
    console.log('Connection error (service_role):', err.message);
    // Try regular postgres user
    try {
      const pool2 = new Pool({
        host,
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: process.env.SUPABASE_SERVICE_KEY,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
      });
      const client2 = await pool2.connect();
      console.log('Connected as postgres!');
      
      await client2.query('SET search_path TO cafe_circulo');
      await client2.query(`ALTER TABLE landing_settings ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb`);
      console.log('gallery_images column OK');
      await client2.query(`ALTER TABLE landing_settings ADD COLUMN IF NOT EXISTS recommended_items JSONB DEFAULT '[]'::jsonb`);
      console.log('recommended_items column OK');
      await client2.query(`ALTER TABLE landing_settings ADD COLUMN IF NOT EXISTS menu_categories JSONB DEFAULT '["Cafetería", "Dulces", "Saladitos", "Bebidas"]'::jsonb`);
      console.log('menu_categories column OK');
      await client2.query(`ALTER TABLE landing_settings ADD COLUMN IF NOT EXISTS menu_categories_en JSONB DEFAULT '["Coffee", "Sweets", "Savory", "Drinks"]'::jsonb`);
      console.log('menu_categories_en column OK');
      
      await client2.query(`ALTER TABLE landing_settings ADD COLUMN IF NOT EXISTS modules JSONB DEFAULT '[]'::jsonb`);
      console.log('modules column OK');
      await client2.query(`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS recommended BOOLEAN DEFAULT false`);
      console.log('menu_items.recommended column OK');
      
      client2.release();
      await pool2.end();
      console.log('Migrations completed!');
    } catch (err2) {
      console.log('Connection error (postgres):', err2.message);
      process.exit(1);
    }
  }
}

run();
