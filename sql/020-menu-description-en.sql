-- Add English description to menu items
ALTER TABLE cafe_circulo.menu_items ADD COLUMN IF NOT EXISTS description_en text DEFAULT '';
