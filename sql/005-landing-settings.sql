-- ============================================
-- Café Círculo - Configuración de Landing Page
-- ============================================

CREATE TABLE IF NOT EXISTS cafe_circulo.landing_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_subtitle TEXT DEFAULT 'Desde 2025 en Villa Allende',
  hero_title_line1 TEXT DEFAULT 'CAFÉ',
  hero_title_line2 TEXT DEFAULT 'Círculo',
  hero_description TEXT DEFAULT 'Café de especialidad, comunidad y buena música',
  hero_bg_image TEXT DEFAULT 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&q=80',
  hours_weekdays TEXT DEFAULT 'Lun - Vie: 8:00 - 20:30',
  hours_weekends TEXT DEFAULT 'Sáb - Dom: 9:00 - 20:30',
  location_line1 TEXT DEFAULT 'Villa Allende, Córdoba',
  location_line2 TEXT DEFAULT 'Argentina',
  culture_line1 TEXT DEFAULT 'Tardes de Vinilos',
  culture_line2 TEXT DEFAULT 'Eventos culturales',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insertar fila por defecto si no existe
INSERT INTO cafe_circulo.landing_settings (
  hero_subtitle, hero_title_line1, hero_title_line2, hero_description,
  hours_weekdays, hours_weekends,
  location_line1, location_line2,
  culture_line1, culture_line2
) VALUES (
  'Desde 2025 en Villa Allende',
  'CAFÉ', 'Círculo',
  'Café de especialidad, comunidad y buena música',
  'Lun - Vie: 8:00 - 20:30', 'Sáb - Dom: 9:00 - 20:30',
  'Villa Allende, Córdoba', 'Argentina',
  'Tardes de Vinilos', 'Eventos culturales'
)
ON CONFLICT DO NOTHING;

GRANT ALL ON ALL TABLES IN SCHEMA cafe_circulo TO anon, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA cafe_circulo TO anon, service_role;
