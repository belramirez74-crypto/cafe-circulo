-- Add menu_mgmt_categories to landing_settings (independent from landing categories)
ALTER TABLE cafe_circulo.landing_settings ADD COLUMN IF NOT EXISTS menu_mgmt_categories jsonb DEFAULT '["Cafetería", "Infusiones y Te", "Pastelería", "Salados", "Dulces"]'::jsonb;
