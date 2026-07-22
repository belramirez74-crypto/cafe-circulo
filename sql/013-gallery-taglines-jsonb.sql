-- Café Círculo - Migrar taglines de galería a array JSONB
-- Migra gallery_tagline_1 y gallery_tagline_2 a gallery_taglines (JSONB array)

ALTER TABLE cafe_circulo.landing_settings
  ADD COLUMN IF NOT EXISTS gallery_taglines JSONB DEFAULT '["más que un café de especialidad,","una comunidad."]';

-- Migrar datos existentes de las columnas viejas al nuevo array
UPDATE cafe_circulo.landing_settings
SET gallery_taglines = jsonb_build_array(
  COALESCE(NULLIF(gallery_tagline_1, ''), 'más que un café de especialidad,'),
  COALESCE(NULLIF(gallery_tagline_2, ''), 'una comunidad.')
)
WHERE gallery_taglines IS NULL
   OR gallery_taglines = '[]'::jsonb
   OR gallery_taglines = '["más que un café de especialidad,","una comunidad."]';

-- Limpiar: quitar columnas viejas (opcional, descomentar si querés)
-- ALTER TABLE cafe_circulo.landing_settings DROP COLUMN IF EXISTS gallery_tagline_1;
-- ALTER TABLE cafe_circulo.landing_settings DROP COLUMN IF EXISTS gallery_tagline_2;
