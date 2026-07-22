-- ============================================
-- Café Círculo - Corregir hash de admin
-- Ejecutar en el SQL Editor de Supabase
-- ============================================

SET search_path TO cafe_circulo;

UPDATE admins
SET password_hash = '$2a$10$gPaaUx.BYOiCMCMniVOs/uBbIGRnUbY9TaZbBp4z9H5MRLELvGwIu'
WHERE email = 'admin@cafecirculo.com';
