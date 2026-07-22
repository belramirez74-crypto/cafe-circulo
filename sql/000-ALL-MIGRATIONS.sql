-- ============================================
-- Café Círculo - TODAS LAS MIGRACIONES
-- Ejecutar este archivo completo en el SQL Editor de Supabase
-- ============================================

-- 1. Schema
CREATE SCHEMA IF NOT EXISTS cafe_circulo;
SET search_path TO cafe_circulo;

-- 2. Tabla de administradores (legacy)
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Items del menú
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Eventos
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  flyer_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Índices
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_stock ON menu_items(stock);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items(featured);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- 7. Categorías por defecto
INSERT INTO categories (name, display_order) VALUES
  ('Cafetería', 1),
  ('Dulces', 2),
  ('Saladitos', 3),
  ('Bebidas', 4)
ON CONFLICT (name) DO NOTHING;

-- 8. Admin legacy
INSERT INTO admins (email, password_hash) VALUES
  ('admin@cafecirculo.com', '$2a$10$gPaaUx.BYOiCMCMniVOs/uBbIGRnUbY9TaZbBp4z9H5MRLELvGwIu')
ON CONFLICT (email) DO NOTHING;

-- 9. Exponer schema a la API
GRANT USAGE ON SCHEMA cafe_circulo TO anon, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA cafe_circulo TO anon, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA cafe_circulo TO anon, service_role;
ALTER ROLE anon SET search_path TO cafe_circulo, public;
ALTER ROLE service_role SET search_path TO cafe_circulo, public;

-- 10. Landing settings
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

-- 11. Gallery images
ALTER TABLE cafe_circulo.landing_settings ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;

-- 12. Recommended items
ALTER TABLE cafe_circulo.landing_settings ADD COLUMN IF NOT EXISTS recommended_items JSONB DEFAULT '[]'::jsonb;

-- 13. Usuarios de la app
CREATE TABLE IF NOT EXISTS cafe_circulo.app_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'staff', 'client')),
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO cafe_circulo.app_users (email, password_hash, name, role) VALUES
  ('admin@cafecirculo.com', '$2a$10$gPaaUx.BYOiCMCMniVOs/uBbIGRnUbY9TaZbBp4z9H5MRLELvGwIu', 'Administrador', 'admin'),
  ('staff@cafecirculo.com', '$2a$10$gPaaUx.BYOiCMCMniVOs/uBbIGRnUbY9TaZbBp4z9H5MRLELvGwIu', 'Staff', 'staff'),
  ('cliente@cafecirculo.com', '$2a$10$gPaaUx.BYOiCMCMniVOs/uBbIGRnUbY9TaZbBp4z9H5MRLELvGwIu', 'Cliente', 'client')
ON CONFLICT (email) DO NOTHING;

-- 14. Staff features
CREATE TABLE IF NOT EXISTS cafe_circulo.staff_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  photo_url TEXT DEFAULT '',
  position TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS cafe_circulo.time_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  clock_in TIMESTAMPTZ NOT NULL DEFAULT now(),
  clock_out TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cafe_circulo.staff_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES cafe_circulo.app_users(id),
  assigned_to UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cafe_circulo.staff_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reminder_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cafe_circulo.staff_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cafe_circulo.staff_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(staff_id, client_id)
);

CREATE TABLE IF NOT EXISTS cafe_circulo.client_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cafe_circulo.exclusive_promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  start_date DATE,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cafe_circulo.event_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  link_url TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cafe_circulo.schedule_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES cafe_circulo.app_users(id),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  event_date DATE NOT NULL,
  event_time TIME,
  visible_to TEXT DEFAULT 'staff' CHECK (visible_to IN ('staff', 'all')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. Re-grant permisos
GRANT ALL ON ALL TABLES IN SCHEMA cafe_circulo TO anon, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA cafe_circulo TO anon, service_role;

-- 16. About story
ALTER TABLE cafe_circulo.landing_settings
  ADD COLUMN IF NOT EXISTS about_story TEXT DEFAULT 'Café Círculo nació en Villa Allende con la idea de crear un espacio donde la buena música, el café de especialidad y la comunidad se encuentren.';

UPDATE cafe_circulo.landing_settings
  SET about_story = 'Café Círculo nació en Villa Allende con la idea de crear un espacio donde la buena música, el café de especialidad y la comunidad se encuentren.'
  WHERE about_story IS NULL;

-- 17. Landing full editable
ALTER TABLE cafe_circulo.landing_settings
  ADD COLUMN IF NOT EXISTS hero_button_text TEXT DEFAULT 'VER MENÚ',
  ADD COLUMN IF NOT EXISTS reserva_heading TEXT DEFAULT 'RESERVA',
  ADD COLUMN IF NOT EXISTS reserva_description TEXT DEFAULT 'Contactanos para reservar tu lugar y disfrutar de una experiencia única.',
  ADD COLUMN IF NOT EXISTS reserva_whatsapp_url TEXT DEFAULT 'https://wa.me/5493541530797',
  ADD COLUMN IF NOT EXISTS reserva_instagram_url TEXT DEFAULT 'https://instagram.com/cafecirculo',
  ADD COLUMN IF NOT EXISTS gallery_tagline_1 TEXT DEFAULT 'más que un café de especialidad,',
  ADD COLUMN IF NOT EXISTS gallery_tagline_2 TEXT DEFAULT 'una comunidad.',
  ADD COLUMN IF NOT EXISTS encontranos_subtitle TEXT DEFAULT 'Visitanos',
  ADD COLUMN IF NOT EXISTS encontranos_heading TEXT DEFAULT 'ENCONTRANOS',
  ADD COLUMN IF NOT EXISTS ubicacion_heading TEXT DEFAULT 'UBICACIÓN',
  ADD COLUMN IF NOT EXISTS maps_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.123456789!2d-64.123456789!3d-31.123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCaf%C3%A9+C%C3%ADrculo!5e0!3m2!1ses!2sar!4v1234567890',
  ADD COLUMN IF NOT EXISTS nosotros_subtitle TEXT DEFAULT 'Nuestra historia',
  ADD COLUMN IF NOT EXISTS nosotros_heading TEXT DEFAULT 'SOBRE NOSOTROS',
  ADD COLUMN IF NOT EXISTS nosotros_paragraph2 TEXT DEFAULT 'Un lugar para desconectar, trabajar, leer o simplemente disfrutar de una tarde entre amigos mientras suenan vinilos seleccionados cuidadosamente.',
  ADD COLUMN IF NOT EXISTS nosotros_paragraph3 TEXT DEFAULT 'Nos apasiona lo que hacemos y queremos compartirlo con vos.';

UPDATE cafe_circulo.landing_settings
  SET hero_button_text = COALESCE(NULLIF(hero_button_text, ''), 'VER MENÚ'),
      reserva_heading = COALESCE(NULLIF(reserva_heading, ''), 'RESERVA'),
      reserva_description = COALESCE(NULLIF(reserva_description, ''), 'Contactanos para reservar tu lugar y disfrutar de una experiencia única.'),
      reserva_whatsapp_url = COALESCE(NULLIF(reserva_whatsapp_url, ''), 'https://wa.me/5493541530797'),
      reserva_instagram_url = COALESCE(NULLIF(reserva_instagram_url, ''), 'https://instagram.com/cafecirculo'),
      gallery_tagline_1 = COALESCE(NULLIF(gallery_tagline_1, ''), 'más que un café de especialidad,'),
      gallery_tagline_2 = COALESCE(NULLIF(gallery_tagline_2, ''), 'una comunidad.'),
      encontranos_subtitle = COALESCE(NULLIF(encontranos_subtitle, ''), 'Visitanos'),
      encontranos_heading = COALESCE(NULLIF(encontranos_heading, ''), 'ENCONTRANOS'),
      ubicacion_heading = COALESCE(NULLIF(ubicacion_heading, ''), 'UBICACIÓN'),
      nosotros_subtitle = COALESCE(NULLIF(nosotros_subtitle, ''), 'Nuestra historia'),
      nosotros_heading = COALESCE(NULLIF(nosotros_heading, ''), 'SOBRE NOSOTROS'),
      nosotros_paragraph2 = COALESCE(NULLIF(nosotros_paragraph2, ''), 'Un lugar para desconectar, trabajar, leer o simplemente disfrutar de una tarde entre amigos mientras suenan vinilos seleccionados cuidadosamente.'),
      nosotros_paragraph3 = COALESCE(NULLIF(nosotros_paragraph3, ''), 'Nos apasiona lo que hacemos y queremos compartirlo con vos.')
  WHERE id = (SELECT id FROM cafe_circulo.landing_settings LIMIT 1);
