-- ============================================================
-- Demo Mode Setup — EnergyCompare Dashboard
-- Τρέξε αυτό στο Supabase SQL Editor (σε δύο βήματα)
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- ΒΗΜΑ 1: Τρέξε αυτό πρώτα
-- ════════════════════════════════════════════════════════════

-- Νέος πίνακας demo_sessions
CREATE TABLE IF NOT EXISTS public.demo_sessions (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

ALTER TABLE public.demo_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "demo_sessions_anon_insert"
  ON public.demo_sessions FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "demo_sessions_read"
  ON public.demo_sessions FOR SELECT TO anon, authenticated
  USING (true);

-- Demo columns σε providers
ALTER TABLE public.providers
  ADD COLUMN IF NOT EXISTS demo_session_id UUID
    REFERENCES public.demo_sessions(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Demo columns σε plans
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS demo_session_id UUID
    REFERENCES public.demo_sessions(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Demo columns σε staff
ALTER TABLE public.staff
  ADD COLUMN IF NOT EXISTS demo_session_id UUID
    REFERENCES public.demo_sessions(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Ενημέρωση SELECT policies: φιλτράρισμα expired demo records
DROP POLICY IF EXISTS "providers_public_select" ON public.providers;
CREATE POLICY "providers_public_select"
  ON public.providers FOR SELECT TO anon, authenticated
  USING (demo_session_id IS NULL OR expires_at > NOW());

DROP POLICY IF EXISTS "plans_public_select" ON public.plans;
CREATE POLICY "plans_public_select"
  ON public.plans FOR SELECT TO anon, authenticated
  USING (demo_session_id IS NULL OR expires_at > NOW());

-- Anon: INSERT demo providers
CREATE POLICY "providers_demo_insert"
  ON public.providers FOR INSERT TO anon
  WITH CHECK (
    demo_session_id IS NOT NULL
    AND expires_at IS NOT NULL
    AND expires_at > NOW()
    AND EXISTS (
      SELECT 1 FROM public.demo_sessions
      WHERE id = demo_session_id AND expires_at > NOW()
    )
  );

-- Anon: UPDATE demo providers (μόνο demo records)
CREATE POLICY "providers_demo_update"
  ON public.providers FOR UPDATE TO anon
  USING (demo_session_id IS NOT NULL AND expires_at > NOW())
  WITH CHECK (demo_session_id IS NOT NULL AND expires_at > NOW());

-- Anon: DELETE demo providers
CREATE POLICY "providers_demo_delete"
  ON public.providers FOR DELETE TO anon
  USING (demo_session_id IS NOT NULL AND expires_at > NOW());

-- Anon: INSERT demo plans
CREATE POLICY "plans_demo_insert"
  ON public.plans FOR INSERT TO anon
  WITH CHECK (
    demo_session_id IS NOT NULL
    AND expires_at IS NOT NULL
    AND expires_at > NOW()
    AND EXISTS (
      SELECT 1 FROM public.demo_sessions
      WHERE id = demo_session_id AND expires_at > NOW()
    )
  );

-- Anon: UPDATE demo plans
CREATE POLICY "plans_demo_update"
  ON public.plans FOR UPDATE TO anon
  USING (demo_session_id IS NOT NULL AND expires_at > NOW())
  WITH CHECK (demo_session_id IS NOT NULL AND expires_at > NOW());

-- Anon: DELETE demo plans
CREATE POLICY "plans_demo_delete"
  ON public.plans FOR DELETE TO anon
  USING (demo_session_id IS NOT NULL AND expires_at > NOW());

-- Anon μπορεί να διαβάζει staff (για το AppSettings tab)
CREATE POLICY "staff_anon_select"
  ON public.staff FOR SELECT TO anon
  USING (true);

-- ════════════════════════════════════════════════════════════
-- ΒΗΜΑ 2: Μετά την ενεργοποίηση pg_cron
-- Dashboard → Database → Extensions → pg_cron → Enable
-- Τότε τρέξε αυτό:
-- ════════════════════════════════════════════════════════════

SELECT cron.schedule(
  'cleanup-demo-sessions',
  '0 * * * *',
  $$DELETE FROM public.demo_sessions WHERE expires_at < NOW()$$
);
