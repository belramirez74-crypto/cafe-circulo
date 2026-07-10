-- ============================================
-- Café Círculo - Verificar y corregir admin
-- ============================================

-- Verificar si existe el admin
SELECT * FROM cafe_circulo.admins WHERE email = 'admin@cafecirculo.com';

-- Si no existe, insertarlo con el hash correcto
INSERT INTO cafe_circulo.admins (email, password_hash)
SELECT 'admin@cafecirculo.com', '$2a$10$sH6kHvPd9dBE1NykjjF2HeNmJSpHUhZho0zGCO1TnE4HyGGHXnykq'
WHERE NOT EXISTS (
  SELECT 1 FROM cafe_circulo.admins WHERE email = 'admin@cafecirculo.com'
);

-- Si existe pero con hash viejo, actualizarlo
UPDATE cafe_circulo.admins
SET password_hash = '$2a$10$sH6kHvPd9dBE1NykjjF2HeNmJSpHUhZho0zGCO1TnE4HyGGHXnykq'
WHERE email = 'admin@cafecirculo.com'
AND password_hash != '$2a$10$sH6kHvPd9dBE1NykjjF2HeNmJSpHUhZho0zGCO1TnE4HyGGHXnykq';

-- Verificar resultado
SELECT id, email, password_hash FROM cafe_circulo.admins WHERE email = 'admin@cafecirculo.com';
