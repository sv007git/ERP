-- ERP: Initial PostgreSQL / Supabase Schema Migration
-- Migration: 20261027000001_initial_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations (Tenants)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(64) NOT NULL UNIQUE,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    fiscal_year_start_month INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Branches
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization Memberships (User <-> Tenant Mapping)
CREATE TABLE IF NOT EXISTS public.organization_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Employee',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Users Profile
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY, -- Maps to auth.users.id
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    avatar_url VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'Employee',
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(60) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM Leads
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(120) NOT NULL,
    company_name VARCHAR(120),
    email VARCHAR(191),
    phone VARCHAR(50),
    lead_owner_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'Organic Search',
    status VARCHAR(30) NOT NULL DEFAULT 'Not Closed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM Deals
CREATE TABLE IF NOT EXISTS public.deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL,
    company_name VARCHAR(120),
    stage VARCHAR(50) NOT NULL DEFAULT 'Qualify To Buy',
    probability INT NOT NULL DEFAULT 20,
    deal_value NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    due_date DATE,
    priority VARCHAR(20) NOT NULL DEFAULT 'High',
    status VARCHAR(20) NOT NULL DEFAULT 'Open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deal Activities
CREATE TABLE IF NOT EXISTS public.deal_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'Normal',
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HRMS Departments
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(80) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HRMS Employees
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    employee_code VARCHAR(20) NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(191) NOT NULL,
    phone VARCHAR(50),
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    position VARCHAR(100) NOT NULL,
    manager_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    date_of_joining DATE NOT NULL,
    salary NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    leave_balance NUMERIC(4,1) NOT NULL DEFAULT 20.0,
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HRMS Attendance
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status VARCHAR(20) NOT NULL DEFAULT 'Present',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- HRMS Leave Requests
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(40) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count NUMERIC(4,1) NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    approved_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Finance Chart of Accounts
CREATE TABLE IF NOT EXISTS public.chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    account_code VARCHAR(20) NOT NULL,
    account_name VARCHAR(120) NOT NULL,
    account_type VARCHAR(30) NOT NULL,
    is_group BOOLEAN DEFAULT FALSE,
    parent_id UUID REFERENCES public.chart_of_accounts(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Finance General Ledger
CREATE TABLE IF NOT EXISTS public.gl_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    posting_date DATE NOT NULL,
    account_id UUID NOT NULL REFERENCES public.chart_of_accounts(id) ON DELETE RESTRICT,
    debit NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    credit NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    voucher_type VARCHAR(40) NOT NULL,
    voucher_id VARCHAR(64) NOT NULL,
    remarks VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Finance Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    invoice_number VARCHAR(30) NOT NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_email VARCHAR(191),
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Finance Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    payment_number VARCHAR(30) NOT NULL,
    payment_type VARCHAR(20) NOT NULL,
    party_name VARCHAR(120) NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'Bank Transfer',
    payment_date DATE NOT NULL,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Paid',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    category VARCHAR(60) NOT NULL,
    brand VARCHAR(60),
    unit VARCHAR(20) NOT NULL DEFAULT 'Piece',
    quantity INT NOT NULL DEFAULT 0,
    selling_price NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    purchase_price NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'In Stock',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Warehouses
CREATE TABLE IF NOT EXISTS public.warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    capacity INT NOT NULL DEFAULT 10000,
    current_utilization_pct INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchasing Purchase Orders
CREATE TABLE IF NOT EXISTS public.purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    po_number VARCHAR(30) NOT NULL,
    supplier_name VARCHAR(120) NOT NULL,
    category VARCHAR(60) NOT NULL,
    amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Stock Ledger Entries
CREATE TABLE IF NOT EXISTS public.stock_ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    delta_qty INT NOT NULL,
    unit_cost NUMERIC(15,2) NOT NULL,
    voucher_type VARCHAR(40) NOT NULL,
    voucher_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_org ON public.leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_deals_org ON public.deals(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_org ON public.employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_gl_entries_org_account ON public.gl_entries(organization_id, account_id);
CREATE INDEX IF NOT EXISTS idx_stock_ledger_org_product ON public.stock_ledger_entries(organization_id, product_id);
