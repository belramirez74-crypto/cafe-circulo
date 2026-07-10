-- ============================================
-- Café Círculo - Staff, Clientes y Admin
-- ============================================

-- Perfiles extendidos de staff/admin
CREATE TABLE IF NOT EXISTS cafe_circulo.staff_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  photo_url TEXT DEFAULT '',
  position TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Fichado de entrada/salida
CREATE TABLE IF NOT EXISTS cafe_circulo.time_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  clock_in TIMESTAMPTZ NOT NULL DEFAULT now(),
  clock_out TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tareas (admin asigna a staff)
CREATE TABLE IF NOT EXISTS cafe_circulo.staff_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES cafe_circulo.app_users(id),
  assigned_to UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Recordatorios personales
CREATE TABLE IF NOT EXISTS cafe_circulo.staff_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reminder_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notas personales
CREATE TABLE IF NOT EXISTS cafe_circulo.staff_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Relación staff-cliente
CREATE TABLE IF NOT EXISTS cafe_circulo.staff_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(staff_id, client_id)
);

-- Pedidos frecuentes del cliente
CREATE TABLE IF NOT EXISTS cafe_circulo.client_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES cafe_circulo.app_users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Promociones exclusivas para clientes
CREATE TABLE IF NOT EXISTS cafe_circulo.exclusive_promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  start_date DATE,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Banners de eventos visibles para clientes
CREATE TABLE IF NOT EXISTS cafe_circulo.event_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  link_url TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Eventos del calendario (admin crea, staff ve)
CREATE TABLE IF NOT EXISTS cafe_circulo.schedule_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES cafe_circulo.app_users(id),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  event_date DATE NOT NULL,
  event_time TIME,
  visible_to TEXT DEFAULT 'staff' CHECK (visible_to IN ('staff', 'all')),
  created_at TIMESTAMPTZ DEFAULT now()
);
