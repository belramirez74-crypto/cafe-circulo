-- Add menu_categories to landing_settings
ALTER TABLE cafe_circulo.landing_settings ADD COLUMN IF NOT EXISTS menu_categories jsonb DEFAULT '["Cafetería", "Dulces", "Saladitos", "Bebidas"]'::jsonb;
