-- ═══════════════════════════════════════════════════════════════════════
-- CUBICO PLATFORM — V2 SUPPLEMENTARY MIGRATION
--
-- Run AFTER migration-platform.sql has been applied.
-- Adds: transactions, deliverables tables + estimated_delivery_at column.
-- This script is IDEMPOTENT — safe to run multiple times.
-- ═══════════════════════════════════════════════════════════════════════


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  ADD estimated_delivery_at TO ORDERS                             ║
-- ╚═══════════════════════════════════════════════════════════════════╝

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS estimated_delivery_at TIMESTAMPTZ;


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  TRANSACTIONS TABLE                                              ║
-- ╚═══════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS public.transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount          INTEGER NOT NULL DEFAULT 0,
  currency        TEXT NOT NULL DEFAULT 'PKR',
  method          TEXT NOT NULL DEFAULT 'card',
  transaction_id  TEXT NOT NULL DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'completed'
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Customers can read own transactions
DO $$ BEGIN
  CREATE POLICY "Customers can read own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = customer_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Customers can insert transactions (for payment recording)
DO $$ BEGIN
  CREATE POLICY "Customers can insert own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = customer_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Staff can read all transactions
DO $$ BEGIN
  CREATE POLICY "Staff can read all transactions"
    ON public.transactions FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role IN ('admin', 'developer')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Staff can update transactions (e.g. mark refunded)
DO $$ BEGIN
  CREATE POLICY "Staff can update all transactions"
    ON public.transactions FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role IN ('admin', 'developer')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_transactions_order ON public.transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_customer ON public.transactions(customer_id);


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  DELIVERABLES TABLE                                              ║
-- ╚═══════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS public.deliverables (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  asset_type  TEXT NOT NULL DEFAULT 'other'
    CHECK (asset_type IN (
      'domain',
      'hosting',
      'credentials',
      'source_code',
      'design_files',
      'documentation',
      'other'
    )),
  details     JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

-- Customers can read deliverables for their orders
DO $$ BEGIN
  CREATE POLICY "Customers can read own deliverables"
    ON public.deliverables FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = deliverables.order_id AND o.customer_id = auth.uid()
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Staff can read all deliverables
DO $$ BEGIN
  CREATE POLICY "Staff can read all deliverables"
    ON public.deliverables FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role IN ('admin', 'developer')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Staff can insert/update deliverables
DO $$ BEGIN
  CREATE POLICY "Staff can insert deliverables"
    ON public.deliverables FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role IN ('admin', 'developer')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Staff can update deliverables"
    ON public.deliverables FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role IN ('admin', 'developer')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Staff can delete deliverables"
    ON public.deliverables FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role IN ('admin', 'developer')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_deliverables_order ON public.deliverables(order_id);


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  GRANT PERMISSIONS ON NEW TABLES                                 ║
-- ╚═══════════════════════════════════════════════════════════════════╝

GRANT ALL ON public.transactions TO anon, authenticated;
GRANT ALL ON public.deliverables TO anon, authenticated;


-- ╔═══════════════════════════════════════════════════════════════════╗
-- ║  ENABLE REALTIME ON NEW TABLES                                   ║
-- ╚═══════════════════════════════════════════════════════════════════╝

ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deliverables;


-- ═══════════════════════════════════════════════════════════════════════
-- DONE! V2 migration applied.
--
-- New tables:
--   • transactions — payment records (links order + customer)
--   • deliverables — delivery assets with JSONB details
--
-- New column on orders:
--   • estimated_delivery_at — estimated delivery timestamp
-- ═══════════════════════════════════════════════════════════════════════
