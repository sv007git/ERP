-- Dreams ERP: Enable Anon and Authenticated Full Read/Write Access
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/clobwkkjltlhxishhyhm/sql)

DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'organizations', 'branches', 'organization_memberships', 'user_profiles', 'audit_logs',
    'leads', 'deals', 'deal_activities', 'departments', 'employees',
    'attendance_records', 'leave_requests', 'chart_of_accounts', 'gl_entries',
    'invoices', 'payments', 'products', 'warehouses', 'purchase_orders', 'stock_ledger_entries'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I_anon_all ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY %I_anon_all ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);', tbl, tbl);
  END LOOP;
END $$;

-- Verify policies are applied
SELECT tablename, policyname, roles, cmd FROM pg_policies WHERE schemaname = 'public';
