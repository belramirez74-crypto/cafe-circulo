-- Add sku column to menu_items
ALTER TABLE cafe_circulo.menu_items ADD COLUMN IF NOT EXISTS sku text DEFAULT '';
