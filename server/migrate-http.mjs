import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function run() {
  try {
    const sql = `
      ALTER TABLE landing_settings ADD COLUMN IF NOT EXISTS modules JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS recommended BOOLEAN DEFAULT false;
    `;

    const { data, error } = await supabase.rpc('exec_sql', { sql_text: sql });
    if (error) {
      // Try direct query approach
      const { error: err2 } = await supabase.from('landing_settings').select('id').limit(1);
      console.log('Test query result:', err2 ? err2.message : 'Connected');

      // Use raw SQL via REST
      const url = `${process.env.SUPABASE_URL}/rest/v1/rpc/`;
      console.log('Trying direct REST approach...');
    }

    console.log('Migration completed');
  } catch (err) {
    console.log('Error:', err.message);
  }
}

run();
