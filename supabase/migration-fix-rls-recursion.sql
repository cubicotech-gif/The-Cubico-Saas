-- ═══════════════════════════════════════════════════════════════════════
-- CUBICO PLATFORM — RLS RECURSION FIX
--
-- Run this in Supabase SQL Editor to fix the infinite recursion error.
-- Safe to run multiple times (idempotent).
--
-- Problem: "Staff can read all profiles" policy queries the profiles
-- table to check if user is admin/developer, which triggers the same
-- policy again → infinite recursion. Same issue cascades to orders
-- and order_messages policies that reference profiles.
--
-- Fix: Use a SECURITY DEFINER function to check role without RLS.
-- ═══════════════════════════════════════════════════════════════════════


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 1: Create a role-check function that bypasses RLS          ║
-- ╚═══════════════════════════════════════════════════════════════════╝

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO anon;


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 2: Fix PROFILES policies (remove self-referencing query)   ║
-- ╚═══════════════════════════════════════════════════════════════════╝

-- Drop the recursive policy
DROP POLICY IF EXISTS "Staff can read all profiles" ON public.profiles;

-- Recreate using the SECURITY DEFINER function (no recursion)
CREATE POLICY "Staff can read all profiles"
  ON public.profiles FOR SELECT
  USING (
    public.get_user_role() IN ('admin', 'developer')
  );


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 3: Fix ORDERS policies (same issue with profiles subquery) ║
-- ╚═══════════════════════════════════════════════════════════════════╝

-- Drop old staff policies on orders
DROP POLICY IF EXISTS "Staff can read all orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can update all orders" ON public.orders;

-- Recreate using the function
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


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 4: Fix ORDER_MESSAGES policies                             ║
-- ╚═══════════════════════════════════════════════════════════════════╝

-- Drop old policies
DROP POLICY IF EXISTS "Participants can read order messages" ON public.order_messages;
DROP POLICY IF EXISTS "Participants can send messages" ON public.order_messages;

-- Recreate: participants + admins can read
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

-- Recreate: participants + admins can send
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


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 5: Fix TRANSACTIONS policies (if table exists)             ║
-- ╚═══════════════════════════════════════════════════════════════════╝

DO $$ BEGIN
  DROP POLICY IF EXISTS "Staff can read all transactions" ON public.transactions;
  CREATE POLICY "Staff can read all transactions"
    ON public.transactions FOR SELECT
    USING (public.get_user_role() IN ('admin', 'developer'));
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Staff can update all transactions" ON public.transactions;
  CREATE POLICY "Staff can update all transactions"
    ON public.transactions FOR UPDATE
    USING (public.get_user_role() IN ('admin', 'developer'));
EXCEPTION WHEN undefined_table THEN NULL;
END $$;


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  STEP 6: Fix DELIVERABLES policies (if table exists)             ║
-- ╚═══════════════════════════════════════════════════════════════════╝

DO $$ BEGIN
  DROP POLICY IF EXISTS "Staff can read all deliverables" ON public.deliverables;
  CREATE POLICY "Staff can read all deliverables"
    ON public.deliverables FOR SELECT
    USING (public.get_user_role() IN ('admin', 'developer'));
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Staff can insert deliverables" ON public.deliverables;
  CREATE POLICY "Staff can insert deliverables"
    ON public.deliverables FOR INSERT
    WITH CHECK (public.get_user_role() IN ('admin', 'developer'));
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Staff can update deliverables" ON public.deliverables;
  CREATE POLICY "Staff can update deliverables"
    ON public.deliverables FOR UPDATE
    USING (public.get_user_role() IN ('admin', 'developer'));
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Staff can delete deliverables" ON public.deliverables;
  CREATE POLICY "Staff can delete deliverables"
    ON public.deliverables FOR DELETE
    USING (public.get_user_role() IN ('admin', 'developer'));
EXCEPTION WHEN undefined_table THEN NULL;
END $$;


-- ═══════════════════════════════════════════════════════════════════════
-- DONE! The infinite recursion is fixed.
--
-- What changed:
--   • Created get_user_role() — a SECURITY DEFINER function that reads
--     the user's role from profiles WITHOUT triggering RLS policies
--   • All "Staff can ..." policies now use get_user_role() instead of
--     a subquery on profiles, breaking the recursion cycle
-- ═══════════════════════════════════════════════════════════════════════
