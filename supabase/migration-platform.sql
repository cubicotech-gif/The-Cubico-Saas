-- ═══════════════════════════════════════════════════════════════════════
-- CUBICO PLATFORM — COMPLETE SETUP (run once in Supabase SQL Editor)
--
-- This script is IDEMPOTENT — safe to run multiple times.
-- It will drop and recreate everything cleanly.
--
-- BEFORE RUNNING:
--   1. Go to Supabase Dashboard → Authentication → Users
--   2. Delete any stuck/failed users
--   3. Then paste this entire script into SQL Editor and click "Run"
-- ═══════════════════════════════════════════════════════════════════════


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 0: CLEAN SLATE — drop old tables, triggers, functions     ║
-- ╚═══════════════════════════════════════════════════════════════════╝

-- Drop triggers first (they reference functions)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS orders_updated_at ON orders;

-- Drop tables in dependency order (messages → orders → profiles)
DROP TABLE IF EXISTS order_messages CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;

-- Drop storage policies (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Authenticated users can upload order assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can read order assets" ON storage.objects;


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 1: PROFILES TABLE                                         ║
-- ╚═══════════════════════════════════════════════════════════════════╝

CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL DEFAULT '',
  phone         TEXT DEFAULT '',
  business_name TEXT DEFAULT '',
  role          TEXT NOT NULL DEFAULT 'customer'
                  CHECK (role IN ('customer', 'developer', 'admin')),
  avatar_url    TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role without triggering RLS (avoids infinite recursion)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO anon;

-- Policies
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Staff can read all profiles"
  ON public.profiles FOR SELECT
  USING (
    public.get_user_role() IN ('admin', 'developer')
  );


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 2: AUTO-CREATE PROFILE ON SIGNUP (trigger)                ║
-- ╚═══════════════════════════════════════════════════════════════════╝

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 3: ORDERS TABLE                                           ║
-- ╚═══════════════════════════════════════════════════════════════════╝

CREATE TABLE public.orders (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  developer_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Template & business info
  template_key         TEXT NOT NULL,
  business_name        TEXT NOT NULL DEFAULT '',
  business_industry    TEXT DEFAULT '',
  business_description TEXT DEFAULT '',

  -- Customer-provided assets & preferences
  logo_url             TEXT DEFAULT '',
  content_notes        TEXT DEFAULT '',
  color_preferences    TEXT DEFAULT '',
  domain_info          TEXT DEFAULT '',
  domain_name          TEXT DEFAULT '',
  extra_notes          TEXT DEFAULT '',

  -- Status tracking
  status               TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN (
      'pending',
      'accepted',
      'preview_ready',
      'revision',
      'completed',
      'delivered',
      'cancelled'
    )),

  -- Preview & delivery
  preview_url          TEXT DEFAULT '',
  live_url             TEXT DEFAULT '',

  -- Pricing
  price_amount         INTEGER DEFAULT 0,
  price_currency       TEXT DEFAULT 'PKR',
  is_paid              BOOLEAN DEFAULT FALSE,

  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Customers
CREATE POLICY "Customers can read own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = customer_id);

-- Staff (uses get_user_role() to avoid infinite recursion through profiles RLS)
CREATE POLICY "Staff can read all orders"
  ON public.orders FOR SELECT
  USING (
    public.get_user_role() IN ('admin', 'developer')
  );

CREATE POLICY "Staff can update all orders"
  ON public.orders FOR UPDATE
  USING (
    public.get_user_role() IN ('admin', 'developer')
  );

-- Indexes
CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_developer ON public.orders(developer_id);
CREATE INDEX idx_orders_status ON public.orders(status);


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 4: ORDER MESSAGES TABLE (chat)                            ║
-- ╚═══════════════════════════════════════════════════════════════════╝

CREATE TABLE public.order_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body            TEXT NOT NULL DEFAULT '',
  attachment_url  TEXT DEFAULT '',
  is_read         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can read order messages"
  ON public.order_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_messages.order_id
        AND (o.customer_id = auth.uid() OR o.developer_id = auth.uid())
    )
    OR public.get_user_role() = 'admin'
  );

CREATE POLICY "Participants can send messages"
  ON public.order_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND (
      EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_messages.order_id
          AND (o.customer_id = auth.uid() OR o.developer_id = auth.uid())
      )
      OR public.get_user_role() = 'admin'
    )
  );

CREATE INDEX idx_messages_order ON public.order_messages(order_id);
CREATE INDEX idx_messages_created ON public.order_messages(created_at);


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 5: UPDATED_AT AUTO-TRIGGER                                ║
-- ╚═══════════════════════════════════════════════════════════════════╝

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 6: STORAGE BUCKET (for logo uploads)                      ║
-- ╚═══════════════════════════════════════════════════════════════════╝

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-assets',
  'order-assets',
  true,
  10485760,  -- 10 MB
  ARRAY['image/jpeg','image/png','image/webp','image/svg+xml','application/pdf']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload order assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'order-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Public can read order assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'order-assets');


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 7: ENABLE REALTIME (for live chat & notifications)        ║
-- ╚═══════════════════════════════════════════════════════════════════╝

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_messages;


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 8: GRANT PERMISSIONS                                      ║
-- ╚═══════════════════════════════════════════════════════════════════╝

-- Make sure the anon and authenticated roles can access the tables
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;


-- ═══════════════════════════════════════════════════════════════════════
-- DONE! You can now sign up at your Cubico website.
--
-- To make yourself an admin, run this AFTER signing up:
--
--   UPDATE public.profiles
--   SET role = 'admin'
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL_HERE');
--
-- ═══════════════════════════════════════════════════════════════════════
