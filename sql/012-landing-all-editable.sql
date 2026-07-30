-- ============================================
-- Café Círculo - Agregar columnas faltantes a landing_settings
-- ============================================

ALTER TABLE cafe_circulo.landing_settings
  ADD COLUMN IF NOT EXISTS hero_button_text TEXT DEFAULT 'VER MENÚ',
  ADD COLUMN IF NOT EXISTS reserva_heading TEXT DEFAULT 'RESERVA',
  ADD COLUMN IF NOT EXISTS reserva_description TEXT DEFAULT 'Contactanos para reservar tu lugar y disfrutar de una experiencia única.',
  ADD COLUMN IF NOT EXISTS reserva_whatsapp_url TEXT DEFAULT 'https://wa.me/5493541530797',
  ADD COLUMN IF NOT EXISTS reserva_instagram_url TEXT DEFAULT 'https://www.instagram.com/circuloescafe',
  ADD COLUMN IF NOT EXISTS gallery_tagline_1 TEXT DEFAULT 'más que un café de especialidad,',
  ADD COLUMN IF NOT EXISTS gallery_tagline_2 TEXT DEFAULT 'una comunidad.',
  ADD COLUMN IF NOT EXISTS encontranos_subtitle TEXT DEFAULT 'Visitanos',
  ADD COLUMN IF NOT EXISTS encontranos_heading TEXT DEFAULT 'ENCONTRANOS',
  ADD COLUMN IF NOT EXISTS ubicacion_heading TEXT DEFAULT 'UBICACIÓN',
  ADD COLUMN IF NOT EXISTS maps_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.123456789!2d-64.123456789!3d-31.123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCaf%C3%A9+C%C3%ADrculo!5e0!3m2!1ses!2sar!4v1234567890',
  ADD COLUMN IF NOT EXISTS nosotros_subtitle TEXT DEFAULT 'Nuestra historia',
  ADD COLUMN IF NOT EXISTS nosotros_heading TEXT DEFAULT 'SOBRE NOSOTROS',
  ADD COLUMN IF NOT EXISTS nosotros_paragraph2 TEXT DEFAULT 'Un lugar para desconectar, trabajar, leer o simplemente disfrutar de una tarde entre amigos mientras suenan vinilos seleccionados cuidadosamente.',
  ADD COLUMN IF NOT EXISTS nosotros_paragraph3 TEXT DEFAULT 'Nos apasiona lo que hacemos y queremos compartirlo con vos.';

-- Actualizar defaults en el row existente
UPDATE cafe_circulo.landing_settings
  SET hero_button_text = COALESCE(NULLIF(hero_button_text, ''), 'VER MENÚ'),
      reserva_heading = COALESCE(NULLIF(reserva_heading, ''), 'RESERVA'),
      reserva_description = COALESCE(NULLIF(reserva_description, ''), 'Contactanos para reservar tu lugar y disfrutar de una experiencia única.'),
      reserva_whatsapp_url = COALESCE(NULLIF(reserva_whatsapp_url, ''), 'https://wa.me/5493541530797'),
      reserva_instagram_url = COALESCE(NULLIF(reserva_instagram_url, ''), 'https://instagram.com/cafecirculo'),
      gallery_tagline_1 = COALESCE(NULLIF(gallery_tagline_1, ''), 'más que un café de especialidad,'),
      gallery_tagline_2 = COALESCE(NULLIF(gallery_tagline_2, ''), 'una comunidad.'),
      encontranos_subtitle = COALESCE(NULLIF(encontranos_subtitle, ''), 'Visitanos'),
      encontranos_heading = COALESCE(NULLIF(encontranos_heading, ''), 'ENCONTRANOS'),
      ubicacion_heading = COALESCE(NULLIF(ubicacion_heading, ''), 'UBICACIÓN'),
      nosotros_subtitle = COALESCE(NULLIF(nosotros_subtitle, ''), 'Nuestra historia'),
      nosotros_heading = COALESCE(NULLIF(nosotros_heading, ''), 'SOBRE NOSOTROS'),
      nosotros_paragraph2 = COALESCE(NULLIF(nosotros_paragraph2, ''), 'Un lugar para desconectar, trabajar, leer o simplemente disfrutar de una tarde entre amigos mientras suenan vinilos seleccionados cuidadosamente.'),
      nosotros_paragraph3 = COALESCE(NULLIF(nosotros_paragraph3, ''), 'Nos apasiona lo que hacemos y queremos compartirlo con vos.')
  WHERE id = (SELECT id FROM cafe_circulo.landing_settings LIMIT 1);
