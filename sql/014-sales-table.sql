CREATE TABLE IF NOT EXISTS cafe_circulo.sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_item_id UUID REFERENCES cafe_circulo.menu_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  category TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_by UUID,
  sold_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sales_sold_at ON cafe_circulo.sales(sold_at);
CREATE INDEX IF NOT EXISTS idx_sales_menu_item_id ON cafe_circulo.sales(menu_item_id);
