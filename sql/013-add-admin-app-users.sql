-- ============================================
-- Café Círculo - Agregar admin a app_users
-- ============================================

INSERT INTO cafe_circulo.app_users (email, password_hash, name, role) VALUES
  ('admin@cafecirculo.com', '$2a$10$sH6kHvPd9dBE1NykjjF2HeNmJSpHUhZho0zGCO1TnE4HyGGHXnykq', 'Administrador', 'admin')
ON CONFLICT (email) DO NOTHING;
