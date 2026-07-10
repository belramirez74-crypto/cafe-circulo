-- ============================================
-- Café Círculo - Exponer schema cafe_circulo
-- a la API de Supabase
-- ============================================

GRANT USAGE ON SCHEMA cafe_circulo TO anon, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA cafe_circulo TO anon, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA cafe_circulo TO anon, service_role;
ALTER ROLE anon SET search_path TO cafe_circulo, public;
ALTER ROLE service_role SET search_path TO cafe_circulo, public;
