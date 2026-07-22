-- ============================================
-- Café Círculo - Fix permisos y usuarios
-- ============================================

-- Re-grant para tablas nuevas
GRANT ALL ON ALL TABLES IN SCHEMA cafe_circulo TO anon, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA cafe_circulo TO anon, service_role;

-- Asegurar que los usuarios existan con el hash correcto
DELETE FROM cafe_circulo.app_users WHERE email IN ('staff@cafecirculo.com', 'cliente@cafecirculo.com');

INSERT INTO cafe_circulo.app_users (email, password_hash, name, role) VALUES
  ('staff@cafecirculo.com', '$2a$10$gPaaUx.BYOiCMCMniVOs/uBbIGRnUbY9TaZbBp4z9H5MRLELvGwIu', 'Staff', 'staff'),
  ('cliente@cafecirculo.com', '$2a$10$gPaaUx.BYOiCMCMniVOs/uBbIGRnUbY9TaZbBp4z9H5MRLELvGwIu', 'Cliente', 'client');
