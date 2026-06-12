-- ============================================================
-- RLS helper functions — TEMPLATE
-- ============================================================
-- Lessons baked in from the Barcelos platform (franchwise
-- migrations 000011/000012, March 2026):
--
-- 1. SECURITY DEFINER is REQUIRED on helpers that read the users
--    table. Without it, RLS policies on `users` that call these
--    same helpers recurse infinitely.
-- 2. Each lookup attempt needs its own BEGIN/EXCEPTION block AND
--    an empty-string check — current_setting() returns '' (not
--    NULL, not an exception) for missing settings, so naive
--    fallback logic never triggers.
--
-- Adapt table/column names to your schema before applying.
-- ============================================================

-- Identity: verified email forwarded by the app (x-user-email header
-- set from the WorkOS sealed session), with Supabase JWT fallback.
CREATE OR REPLACE FUNCTION get_current_user_email()
RETURNS TEXT AS $$
DECLARE
  v_email TEXT;
BEGIN
  -- 1) Header set by the app layer from the VERIFIED sealed session
  BEGIN
    v_email := current_setting('request.headers.x-user-email', true);
    IF v_email IS NOT NULL AND v_email != '' THEN
      RETURN v_email;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  -- 2) Fallback: Supabase Auth JWT (if the app also uses it)
  BEGIN
    v_email := current_setting('request.jwt.claims', true)::json ->> 'email';
    IF v_email IS NOT NULL AND v_email != '' THEN
      RETURN v_email;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Org lookup for the verified identity.
-- SECURITY DEFINER: bypasses RLS on `users` to avoid infinite recursion.
CREATE OR REPLACE FUNCTION get_current_user_organization_id()
RETURNS UUID AS $$
DECLARE
  v_email TEXT;
BEGIN
  v_email := get_current_user_email();
  IF v_email IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN (SELECT organization_id FROM users WHERE email = v_email LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
DECLARE
  v_email TEXT;
BEGIN
  v_email := get_current_user_email();
  IF v_email IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN (SELECT role FROM users WHERE email = v_email LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Standard org-isolation policy skeleton:
--
-- ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY your_table_select ON your_table FOR SELECT
--   USING (organization_id = get_current_user_organization_id());
--
-- CREATE POLICY your_table_write ON your_table FOR INSERT
--   WITH CHECK (
--     organization_id = get_current_user_organization_id()
--     AND get_current_user_role() IN ('admin', 'manager')
--   );
