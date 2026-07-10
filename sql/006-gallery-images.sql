-- ============================================
-- Café Círculo - Galería de imágenes para landing
-- ============================================

SET search_path TO cafe_circulo;

ALTER TABLE landing_settings ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;
