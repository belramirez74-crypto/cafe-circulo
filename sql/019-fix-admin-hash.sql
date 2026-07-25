-- ============================================
-- Café Círculo - Fix admin password hash
-- ============================================

UPDATE cafe_circulo.app_users
SET password_hash = '$2a$10$iB6QqnTqr4AB.Mg0NWBZmeIR.ajKwORfItSCnKzbGBU/dy5jen71q'
WHERE email = 'admin@cafecirculo.com' AND role = 'admin';
