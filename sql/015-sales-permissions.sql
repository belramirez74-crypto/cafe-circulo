GRANT ALL ON cafe_circulo.sales TO service_role;
GRANT ALL ON cafe_circulo.sales TO authenticated;
ALTER TABLE cafe_circulo.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can do everything" ON cafe_circulo.sales FOR ALL USING (true) WITH CHECK (true);
