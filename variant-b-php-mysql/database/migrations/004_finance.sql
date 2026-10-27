CREATE TABLE IF NOT EXISTS chart_of_accounts (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL,
    account_code VARCHAR(20) NOT NULL,
    account_name VARCHAR(120) NOT NULL,
    account_type VARCHAR(30) NOT NULL,
    is_group BOOLEAN DEFAULT 0,
    parent_id VARCHAR(36) NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES chart_of_accounts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS gl_entries (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL,
    posting_date DATE NOT NULL,
    account_id VARCHAR(36) NOT NULL,
    debit DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    credit DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    voucher_type VARCHAR(40) NOT NULL,
    voucher_id VARCHAR(64) NOT NULL,
    remarks VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL,
    invoice_number VARCHAR(30) NOT NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_email VARCHAR(191) NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    paid_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL,
    payment_number VARCHAR(30) NOT NULL,
    payment_type VARCHAR(20) NOT NULL,
    party_name VARCHAR(120) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'Bank Transfer',
    payment_date DATE NOT NULL,
    invoice_id VARCHAR(36) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Paid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
);
