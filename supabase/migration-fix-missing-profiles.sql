-- ═══════════════════════════════════════════════════════════════════════
-- CUBICO — Fix missing profiles for existing auth users
--
-- Run this AFTER migration-fix-rls-recursion.sql
-- Creates profile rows for any auth.users that don't have one yet
-- (their profiles were lost due to the earlier RLS recursion bug)
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO public.profiles (id, full_name, phone)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data ->> 'full_name', ''),
  COALESCE(u.raw_user_meta_data ->> 'phone', '')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Show what was created
SELECT
  p.id,
  p.full_name,
  p.role,
  u.email
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
ORDER BY p.created_at DESC;
