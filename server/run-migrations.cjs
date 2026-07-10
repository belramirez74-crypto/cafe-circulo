require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function run() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { db: { schema: 'cafe_circulo' } }
  );

  // Check current columns
  const { data: row } = await supabase.from('landing_settings').select('*').single();
  console.log('Existing columns:', Object.keys(row || {}).join(', '));

  // Try adding gallery_images column via update test
  const hasGallery = row && 'gallery_images' in row;
  const hasRecommended = row && 'recommended_items' in row;

  if (!hasGallery) {
    console.log('Adding gallery_images column...');
    const { error } = await supabase
      .from('landing_settings')
      .update({ gallery_images: [] })
      .eq('id', row.id);
    if (error) console.log('Error adding gallery_images:', error.message);
    else console.log('gallery_images added!');
  }

  if (!hasRecommended) {
    console.log('Adding recommended_items column...');
    const { error } = await supabase
      .from('landing_settings')
      .update({ recommended_items: [] })
      .eq('id', row.id);
    if (error) console.log('Error adding recommended_items:', error.message);
    else console.log('recommended_items added!');
  }
}

run().catch(console.error);
