require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    db: { schema: 'cafe_circulo' }
  });

  const names = ['exec_sql', 'exec', 'query', 'run_sql', 'execute_sql', 'pg_exec', 'sql'];
  for (const name of names) {
    const { data, error } = await supabase.rpc(name, { query: 'SELECT 1' });
    console.log(`${name}:`, error?.message || 'OK ' + JSON.stringify(data));
  }
}

main().catch(console.error);
