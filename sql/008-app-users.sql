-- ============================================
-- Café Círculo - Usuarios (clientes/staff)
-- ============================================

CREATE TABLE IF NOT EXISTS cafe_circulo.app_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'staff', 'client')),
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO cafe_circulo.app_users (email, password_hash, name, role) VALUES
  ('staff@cafecirculo.com', '$2a$10$gPaaUx.BYOiCMCMniVOs/uBbIGRnUbY9TaZbBp4z9H5MRLELvGwIu', 'Staff', 'staff'),
  ('cliente@cafecirculo.com', '$2a$10$gPaaUx.BYOiCMCMniVOs/uBbIGRnUbY9TaZbBp4z9H5MRLELvGwIu', 'Cliente', 'client')
ON CONFLICT (email) DO NOTHING;
