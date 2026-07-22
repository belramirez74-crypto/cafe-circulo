-- ============================================
-- Café Círculo - Notas/Recordatorios del Admin
-- ============================================

CREATE TABLE IF NOT EXISTS cafe_circulo.admin_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  remind_at TIMESTAMPTZ NOT NULL,
  is_done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cafe_circulo.admin_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_own_reminders" ON cafe_circulo.admin_reminders
  FOR ALL USING (true);

GRANT ALL ON cafe_circulo.admin_reminders TO service_role;
GRANT ALL ON cafe_circulo.admin_reminders TO authenticated;
