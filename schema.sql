-- Café Circulo - Esquema de Base de Datos (Supabase)
-- Schema único: cafe_circulo
-- Ejecutar en el Editor SQL de Supabase

CREATE SCHEMA IF NOT EXISTS cafe_circulo;
SET search_path TO cafe_circulo;

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de items del menú
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

-- Tabla de eventos
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  flyer_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_stock ON menu_items(stock);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items(featured);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Insertar categorías por defecto
INSERT INTO categories (name, display_order) VALUES
  ('Cafetería', 1),
  ('Dulces', 2),
  ('Saladitos', 3),
  ('Bebidas', 4)
ON CONFLICT (name) DO NOTHING;

-- Insertar admin por defecto (contraseña: admin123)
-- NOTA: Cambiar después del primer login
-- El hash es de bcrypt para 'admin123'
INSERT INTO admins (email, password_hash) VALUES
  ('admin@cafecirculo.com', '$2a$10$gPaaUx.BYOiCMCMniVOs/uBbIGRnUbY9TaZbBp4z9H5MRLELvGwIu')
ON CONFLICT (email) DO NOTHING;
