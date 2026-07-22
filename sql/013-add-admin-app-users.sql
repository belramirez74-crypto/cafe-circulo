-- ============================================
-- Café Círculo - Agregar admin a app_users
-- ============================================

INSERT INTO cafe_circulo.app_users (email, password_hash, name, role) VALUES
  ('admin@cafecirculo.com', '$2a$10$gPaaUx.BYOiCMCMniVOs/uBbIGRnUbY9TaZbBp4z9H5MRLELvGwIu', 'Administrador', 'admin')
ON CONFLICT (email) DO NOTHING;
