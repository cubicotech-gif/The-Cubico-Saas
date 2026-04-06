-- ═══════════════════════════════════════════════════════════════════
-- CUBICO PLATFORM — Orders, Profiles, Messages
-- Run this in Supabase SQL Editor after enabling Auth
-- ═══════════════════════════════════════════════════════════════════

-- ── Profiles (extends Supabase Auth users) ──────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL DEFAULT '',
  phone       TEXT DEFAULT '',
  business_name TEXT DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'developer', 'admin')),
  avatar_url  TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins/devs can read all profiles
CREATE POLICY "Staff can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'developer')
    )
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ── Orders ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  developer_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Template & business info
  template_key    TEXT NOT NULL,                     -- e.g. 'restaurant', 'clinic'
  business_name   TEXT NOT NULL DEFAULT '',
  business_industry TEXT DEFAULT '',
  business_description TEXT DEFAULT '',

  -- Customer-provided assets
  logo_url        TEXT DEFAULT '',                   -- uploaded logo
  content_notes   TEXT DEFAULT '',                   -- what they want on the site
  color_preferences TEXT DEFAULT '',
  domain_info     TEXT DEFAULT '',                   -- "I have a domain" / "buy for me"
  extra_notes     TEXT DEFAULT '',

  -- Status tracking
  status          TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN (
      'pending',        -- just submitted
      'accepted',       -- dev assigned, working on it
      'preview_ready',  -- live preview link available
      'revision',       -- customer requested changes
      'completed',      -- site is live
      'delivered',      -- paid and ownership transferred
      'cancelled'
    )),

  -- Preview & delivery
  preview_url     TEXT DEFAULT '',                   -- cubico.dev/preview/xxx
  live_url        TEXT DEFAULT '',                   -- www.customer-domain.com
  domain_name     TEXT DEFAULT '',

  -- Pricing (set by admin/dev)
  price_amount    INTEGER DEFAULT 0,                 -- in smallest unit (PKR)
  price_currency  TEXT DEFAULT 'PKR',
  is_paid         BOOLEAN DEFAULT FALSE,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Customers can see their own orders
CREATE POLICY "Customers can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);

-- Customers can create orders
CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Customers can update their own orders (limited fields handled in app)
CREATE POLICY "Customers can update own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = customer_id);

-- Staff can read all orders
CREATE POLICY "Staff can read all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'developer')
    )
  );

-- Staff can update all orders
CREATE POLICY "Staff can update all orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'developer')
    )
  );

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_developer ON orders(developer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);


-- ── Order Messages (chat between customer & developer) ──────────

CREATE TABLE IF NOT EXISTS order_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body        TEXT NOT NULL DEFAULT '',
  attachment_url TEXT DEFAULT '',                    -- optional file/image
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE order_messages ENABLE ROW LEVEL SECURITY;

-- Participants can read messages for their orders
CREATE POLICY "Participants can read order messages"
  ON order_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_messages.order_id
        AND (orders.customer_id = auth.uid() OR orders.developer_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Participants can send messages
CREATE POLICY "Participants can send order messages"
  ON order_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND (
      EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_messages.order_id
          AND (orders.customer_id = auth.uid() OR orders.developer_id = auth.uid())
      )
      OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE INDEX IF NOT EXISTS idx_messages_order ON order_messages(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON order_messages(created_at);


-- ── Updated_at triggers ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── Storage bucket for order assets (logos, attachments) ────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-assets',
  'order-assets',
  true,
  10485760,  -- 10 MB
  ARRAY['image/jpeg','image/png','image/webp','image/svg+xml','application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload order assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'order-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Public can read order assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'order-assets');
