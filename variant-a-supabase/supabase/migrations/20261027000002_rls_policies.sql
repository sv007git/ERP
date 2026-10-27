-- Dreams ERP: Row Level Security (RLS) Policies Migration
-- Migration: 20261027000002_rls_policies.sql

-- Helper function: Check if current user belongs to organization
CREATE OR REPLACE FUNCTION public.user_belongs_to_org(org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_memberships
    WHERE organization_id = org_id
    AND user_id = auth.uid()
  );
$$;

-- Enable RLS on all tenant-scoped tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gl_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_ledger_entries ENABLE ROW LEVEL SECURITY;

-- Organization Policies
CREATE POLICY "Users can view organizations they belong to"
  ON public.organizations FOR SELECT
  USING (public.user_belongs_to_org(id));

-- Generic Tenant Isolation Policies
DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'branches', 'audit_logs', 'leads', 'deals', 'deal_activities',
    'departments', 'employees', 'attendance_records', 'leave_requests',
    'chart_of_accounts', 'gl_entries', 'invoices', 'payments',
    'products', 'warehouses', 'purchase_orders', 'stock_ledger_entries'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('
      CREATE POLICY %I_tenant_select ON public.%I
        FOR SELECT USING (public.user_belongs_to_org(organization_id));
      CREATE POLICY %I_tenant_insert ON public.%I
        FOR INSERT WITH CHECK (public.user_belongs_to_org(organization_id));
      CREATE POLICY %I_tenant_update ON public.%I
        FOR UPDATE USING (public.user_belongs_to_org(organization_id))
        WITH CHECK (public.user_belongs_to_org(organization_id));
      CREATE POLICY %I_tenant_delete ON public.%I
        FOR DELETE USING (public.user_belongs_to_org(organization_id));
    ', tbl, tbl, tbl, tbl, tbl, tbl, tbl, tbl);
  END LOOP;
END $$;
