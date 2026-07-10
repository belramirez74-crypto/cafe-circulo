-- ============================================
-- Café Círculo - Corregir hash de admin
-- Ejecutar en el SQL Editor de Supabase
-- ============================================

SET search_path TO cafe_circulo;

UPDATE admins
SET password_hash = '$2a$10$sH6kHvPd9dBE1NykjjF2HeNmJSpHUhZho0zGCO1TnE4HyGGHXnykq'
WHERE email = 'admin@cafecirculo.com';
