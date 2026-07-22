-- ============================================
-- Café Círculo - Avatar de perfil admin
-- ============================================

ALTER TABLE cafe_circulo.app_users
ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT NULL;
