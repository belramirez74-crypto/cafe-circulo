ALTER TABLE landing_settings ADD COLUMN IF NOT EXISTS modules JSONB DEFAULT '[]'::jsonb;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS recommended BOOLEAN DEFAULT false;
