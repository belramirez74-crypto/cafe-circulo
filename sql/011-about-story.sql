-- ============================================
-- Café Círculo - Agregar about_story a landing_settings
-- ============================================

ALTER TABLE cafe_circulo.landing_settings
  ADD COLUMN IF NOT EXISTS about_story TEXT DEFAULT 'Café Círculo nació en Villa Allende con la idea de crear un espacio donde la buena música, el café de especialidad y la comunidad se encuentren.';

-- Actualizar el row existente con el default
UPDATE cafe_circulo.landing_settings
  SET about_story = 'Café Círculo nació en Villa Allende con la idea de crear un espacio donde la buena música, el café de especialidad y la comunidad se encuentren.'
  WHERE about_story IS NULL;
