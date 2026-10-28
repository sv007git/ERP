-- ERP: Initial Development Seed Data Migration
-- Migration: 20261027000003_seed_data.sql

DO $$
DECLARE
  org_id UUID := '00000000-0000-0000-0000-000000000001';
  admin_id UUID := '00000000-0000-0000-0000-000000000010';
  sales_id UUID := '00000000-0000-0000-0000-000000000011';
  dept_eng UUID := '00000000-0000-0000-0000-000000000020';
  emp1_id UUID := '00000000-0000-0000-0000-000000000030';
  emp2_id UUID := '00000000-0000-0000-0000-000000000031';
  deal1_id UUID := '00000000-0000-0000-0000-000000000040';
  acc_bank UUID := '00000000-0000-0000-0000-000000000050';
  acc_rev UUID := '00000000-0000-0000-0000-000000000051';
  inv1_id UUID := '00000000-0000-0000-0000-000000000060';
  pay1_id UUID := '00000000-0000-0000-0000-000000000070';
BEGIN
  -- Organization
  INSERT INTO public.organizations (id, name, slug, currency)
  VALUES (org_id, 'Falcon LLP', 'falcon-llp', 'USD')
  ON CONFLICT (id) DO NOTHING;

  -- Branch
  INSERT INTO public.branches (organization_id, name, code, is_main)
  VALUES (org_id, 'New York HQ', 'NY-01', TRUE);

  -- User Profiles
  INSERT INTO public.user_profiles (id, organization_id, full_name, email, role, status)
  VALUES 
    (admin_id, org_id, 'Jamie Anderson', 'admin@dreams.local', 'Super Admin', 'Active'),
    (sales_id, org_id, 'Robert Cosper', 'robert@falcon.local', 'Sales Manager', 'Active')
  ON CONFLICT (id) DO NOTHING;

  -- Memberships
  INSERT INTO public.organization_memberships (organization_id, user_id, role)
  VALUES 
    (org_id, admin_id, 'Super Admin'),
    (org_id, sales_id, 'Sales Manager')
  ON CONFLICT DO NOTHING;

  -- Department & Employees
  INSERT INTO public.departments (id, organization_id, name)
  VALUES (dept_eng, org_id, 'Engineering')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.employees (id, organization_id, employee_code, full_name, email, department_id, position, date_of_joining, salary, leave_balance, status)
  VALUES 
    (emp1_id, org_id, 'EMP-001', 'Alex Thompson', 'alex@falcon.com', dept_eng, 'Senior Developer', '2024-01-15', 8500.00, 20.0, 'Active'),
    (emp2_id, org_id, 'EMP-002', 'Maria Garcia', 'maria@falcon.com', dept_eng, 'UX Designer', '2024-03-01', 7200.00, 18.0, 'Active')
  ON CONFLICT (id) DO NOTHING;

  -- Attendance & Leave
  INSERT INTO public.attendance_records (organization_id, employee_id, date, check_in, status)
  VALUES (org_id, emp1_id, CURRENT_DATE, '09:00:00', 'Present')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.leave_requests (organization_id, employee_id, leave_type, start_date, end_date, days_count, reason, status)
  VALUES (org_id, emp1_id, 'Annual', CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '12 days', 3.0, 'Vacation trip', 'Pending');

  -- Leads
  INSERT INTO public.leads (organization_id, code, name, company_name, status, source, lead_owner_id)
  VALUES 
    (org_id, '#LED0020', 'Robert Cosper', 'Nexora', 'Closed', 'Organic Search', sales_id),
    (org_id, '#LED0019', 'Helen Nelson', 'Apex Media', 'Not Closed', 'Campaigns', sales_id),
    (org_id, '#LED0018', 'Thomas Neal', 'Global Logistics', 'Contacted', 'Referral', sales_id),
    (org_id, '#LED0017', 'Sarah Spivey', 'Vortex Tech', 'Lost', 'Marketing', sales_id),
    (org_id, '#LED0016', 'Jared Griffin', 'Titan Systems', 'Closed', 'Events', sales_id);

  -- Deals
  INSERT INTO public.deals (id, organization_id, code, name, company_name, stage, probability, deal_value, status, priority, owner_id)
  VALUES 
    (deal1_id, org_id, '#DEL0020', 'CRM Subscription', 'Nexora', 'Qualify To Buy', 90, 154000.00, 'Open', 'High', sales_id),
    (uuid_generate_v4(), org_id, '#DEL0019', 'ERP Implementation', 'Acme Corp', 'Contact Made', 40, 48000.00, 'Won', 'Medium', sales_id),
    (uuid_generate_v4(), org_id, '#DEL0018', 'Cloud Migration', 'Delta Inc', 'Presentation', 60, 32000.00, 'Lost', 'Normal', sales_id)
  ON CONFLICT (id) DO NOTHING;

  -- Deal Activities
  INSERT INTO public.deal_activities (organization_id, deal_id, user_id, type, title, description, priority)
  VALUES 
    (org_id, deal1_id, admin_id, 'meeting', 'Product Meeting', 'Review cross-functional roadmap and milestones.', 'High'),
    (org_id, deal1_id, sales_id, 'call', 'Pricing Call', 'Discuss annual billing discount structure.', 'Normal');

  -- Chart of Accounts
  INSERT INTO public.chart_of_accounts (id, organization_id, account_code, account_name, account_type)
  VALUES 
    (acc_bank, org_id, '1010', 'Cash at Bank', 'Asset'),
    (acc_rev, org_id, '4010', 'Sales Revenue', 'Income')
  ON CONFLICT (id) DO NOTHING;

  -- Products
  INSERT INTO public.products (organization_id, code, name, sku, category, brand, unit, quantity, selling_price, purchase_price, status)
  VALUES 
    (org_id, '#PRD0020', 'Apple iPhone 15', 'APP-PH-15', 'Smartphones', 'Apple', 'Piece', 2, 250.00, 230.00, 'In Stock'),
    (org_id, '#PRD0019', 'Dell XPS 13 9310', 'DEL-LAP-9310', 'Computers', 'Dell', 'Piece', 12, 300.00, 280.00, 'In Stock'),
    (org_id, '#PRD0018', 'Bose QuietComfort 45', 'BOS-HD-45', 'Headphones', 'Bose', 'Piece', 15, 100.00, 80.00, 'In Stock');

  -- Warehouses
  INSERT INTO public.warehouses (organization_id, code, name, contact_person, capacity, current_utilization_pct)
  VALUES 
    (org_id, '#WRH0020', 'Smart Stock Hub', 'Ethan Walker', 30000, 85),
    (org_id, '#WRH0019', 'Flow Grid Storage', 'Madison Clark', 20000, 75);

  -- Invoice & Payment & GL
  INSERT INTO public.invoices (id, organization_id, invoice_number, customer_name, customer_email, invoice_date, due_date, subtotal, total_amount, paid_amount, status)
  VALUES (inv1_id, org_id, '#INV0020', 'Alexander Kenn', 'alex@kenn.com', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 500.00, 500.00, 500.00, 'Paid')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.payments (id, organization_id, payment_number, payment_type, party_name, amount, payment_method, payment_date, invoice_id, status)
  VALUES (pay1_id, org_id, '#PAY0020', 'Receive', 'Alexander Kenn', 500.00, 'Bank Transfer', CURRENT_DATE, inv1_id, 'Paid')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.gl_entries (organization_id, posting_date, account_id, debit, credit, voucher_type, voucher_id, remarks)
  VALUES 
    (org_id, CURRENT_DATE, acc_bank, 500.00, 0.00, 'Payment', pay1_id::text, 'Payment for #INV0020'),
    (org_id, CURRENT_DATE, acc_rev, 0.00, 500.00, 'Invoice', inv1_id::text, 'Revenue for #INV0020');

END $$;
