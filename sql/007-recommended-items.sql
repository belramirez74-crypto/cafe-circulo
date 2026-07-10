-- ============================================
-- Café Círculo - Items recomendados en landing
-- ============================================

ALTER TABLE cafe_circulo.landing_settings
ADD COLUMN IF NOT EXISTS recommended_items JSONB DEFAULT '[]'::jsonb;
