ALTER TABLE cafe_circulo.landing_settings
  ADD COLUMN IF NOT EXISTS menu_categories JSONB DEFAULT '["Cafetería", "Dulces", "Saladitos", "Bebidas"]'::jsonb,
  ADD COLUMN IF NOT EXISTS menu_categories_en JSONB DEFAULT '["Coffee", "Sweets", "Savory", "Drinks"]'::jsonb;
