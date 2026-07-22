-- Agregar client_id a la tabla sales para rastrear qué pide cada cliente
ALTER TABLE cafe_circulo.sales
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES cafe_circulo.app_users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_sales_client_id ON cafe_circulo.sales(client_id);

-- Tabla de favoritos manuales del cliente
CREATE TABLE IF NOT EXISTS cafe_circulo.client_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES cafe_circulo.menu_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(client_id, menu_item_id)
);

CREATE INDEX IF NOT EXISTS idx_client_favorites_client_id ON cafe_circulo.client_favorites(client_id);

-- RLS
ALTER TABLE cafe_circulo.client_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients manage own favorites"
  ON cafe_circulo.client_favorites
  FOR ALL
  TO authenticated
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

-- Permisos
GRANT SELECT, INSERT, DELETE ON cafe_circulo.client_favorites TO authenticated;
GRANT SELECT ON cafe_circulo.client_favorites TO anon;
