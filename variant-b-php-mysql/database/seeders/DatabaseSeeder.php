<?php

declare(strict_types=1);

namespace App\Database\Seeders;

use PDO;

class DatabaseSeeder
{
    public static function seed(PDO $pdo): void
    {
        echo "Seeding Dreams ERP development records...\n";

        // 1. Organization
        $orgId = 'org-falcon-llp-001';
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO organizations (id, name, slug, currency) VALUES (?, ?, ?, ?)");
        $stmt->execute([$orgId, 'Falcon LLP', 'falcon-llp', 'USD']);

        // 2. Branch
        $branchId = 'br-ny-01';
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO branches (id, organization_id, name, code, is_main) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$branchId, $orgId, 'New York HQ', 'NY-01', 1]);

        // 3. Users
        $adminId = 'usr-admin-jamie';
        $salesRepId = 'usr-sales-robert';
        $passHash = password_hash('Password123!', PASSWORD_BCRYPT);

        $stmt = $pdo->prepare("INSERT OR REPLACE INTO users (id, organization_id, email, password_hash, full_name, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$adminId, $orgId, 'admin@dreams.local', $passHash, 'Jamie Anderson', 'Super Admin', 'Active']);
        $stmt->execute([$salesRepId, $orgId, 'robert@falcon.local', $passHash, 'Robert Cosper', 'Sales Manager', 'Active']);

        // 4. Departments
        $deptEngId = 'dept-eng-01';
        $deptSalesId = 'dept-sales-01';
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO departments (id, organization_id, name) VALUES (?, ?, ?)");
        $stmt->execute([$deptEngId, $orgId, 'Engineering']);
        $stmt->execute([$deptSalesId, $orgId, 'Sales']);

        // 5. Employees
        $emp1Id = 'emp-001';
        $emp2Id = 'emp-002';
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO employees (id, organization_id, employee_code, full_name, email, department_id, position, date_of_joining, salary, leave_balance, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$emp1Id, $orgId, 'EMP-001', 'Alex Thompson', 'alex@falcon.com', $deptEngId, 'Senior Developer', '2024-01-15', 8500.00, 20.0, 'Active']);
        $stmt->execute([$emp2Id, $orgId, 'EMP-002', 'Maria Garcia', 'maria@falcon.com', $deptEngId, 'UX Designer', '2024-03-01', 7200.00, 18.0, 'Active']);

        // 6. Attendance & Leaves
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO attendance_records (id, organization_id, employee_id, date, check_in, status) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute(['att-001', $orgId, $emp1Id, date('Y-m-d'), '09:00:00', 'Present']);
        $stmt->execute(['att-002', $orgId, $emp2Id, date('Y-m-d'), '09:15:00', 'Present']);

        $stmt = $pdo->prepare("INSERT OR REPLACE INTO leave_requests (id, organization_id, employee_id, leave_type, start_date, end_date, days_count, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute(['lr-001', $orgId, $emp1Id, 'Annual', '2026-11-10', '2026-11-12', 3.0, 'Vacation trip', 'Pending']);

        // 7. CRM Leads
        $leads = [
            ['led-020', '#LED0020', 'Robert Cosper', 'Nexora', 'Closed', 'Organic Search'],
            ['led-019', '#LED0019', 'Helen Nelson', 'Apex Media', 'Not Closed', 'Campaigns'],
            ['led-018', '#LED0018', 'Thomas Neal', 'Global Logistics', 'Contacted', 'Referral'],
            ['led-017', '#LED0017', 'Sarah Spivey', 'Vortex Tech', 'Lost', 'Marketing'],
            ['led-016', '#LED0016', 'Jared Griffin', 'Titan Systems', 'Closed', 'Events'],
        ];
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO leads (id, organization_id, code, name, company_name, status, source, lead_owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($leads as $l) {
            $stmt->execute([$l[0], $orgId, $l[1], $l[2], $l[3], $l[4], $l[5], $salesRepId]);
        }

        // 8. CRM Deals
        $deals = [
            ['del-020', '#DEL0020', 'CRM Subscription', 'Nexora', 'Qualify To Buy', 90, 154000.00, 'Open', 'High'],
            ['del-019', '#DEL0019', 'ERP Implementation', 'Acme Corp', 'Contact Made', 40, 48000.00, 'Won', 'Medium'],
            ['del-018', '#DEL0018', 'Cloud Migration', 'Delta Inc', 'Presentation', 60, 32000.00, 'Lost', 'Normal'],
            ['del-017', '#DEL0017', 'Cybersecurity Upgrade', 'SecureLink', 'Proposal Made', 50, 75000.00, 'Won', 'High'],
            ['del-016', '#DEL0016', 'SaaS Renewal', 'Echo Media', 'Appointment', 70, 25000.00, 'Lost', 'Normal'],
        ];
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO deals (id, organization_id, code, name, company_name, stage, probability, deal_value, status, priority, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($deals as $d) {
            $stmt->execute([$d[0], $orgId, $d[1], $d[2], $d[3], $d[4], $d[5], $d[6], $d[7], $d[8], $salesRepId]);
        }

        // 9. Deal Activities for #DEL0020
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO deal_activities (id, organization_id, deal_id, user_id, type, title, description, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute(['act-001', $orgId, 'del-020', $adminId, 'meeting', 'Product Meeting', 'Review cross-functional roadmap and milestones with client team.', 'High']);
        $stmt->execute(['act-002', $orgId, 'del-020', $salesRepId, 'call', 'Pricing Call', 'Discuss annual billing discounts and payment schedule.', 'Normal']);

        // 10. Chart of Accounts
        $accounts = [
            ['coa-1010', '1010', 'Cash at Bank', 'Asset', 0],
            ['coa-1200', '1200', 'Accounts Receivable', 'Asset', 0],
            ['coa-1300', '1300', 'Inventory Asset', 'Asset', 0],
            ['coa-2010', '2010', 'Accounts Payable', 'Liability', 0],
            ['coa-3010', '3010', 'Retained Earnings', 'Equity', 0],
            ['coa-4010', '4010', 'Sales Revenue', 'Income', 0],
            ['coa-5010', '5010', 'Cost of Goods Sold', 'Expense', 0],
        ];
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO chart_of_accounts (id, organization_id, account_code, account_name, account_type, is_group) VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($accounts as $a) {
            $stmt->execute([$a[0], $orgId, $a[1], $a[2], $a[3], $a[4]]);
        }

        // 11. Products
        $products = [
            ['prd-020', '#PRD0020', 'Apple iPhone 15', 'APP-PH-15', 'Smartphones', 'Apple', 'Piece', 2, 250.00, 230.00, 'In Stock'],
            ['prd-019', '#PRD0019', 'Dell XPS 13 9310', 'DEL-LAP-9310', 'Computers', 'Dell', 'Piece', 12, 300.00, 280.00, 'In Stock'],
            ['prd-018', '#PRD0018', 'Bose QuietComfort 45', 'BOS-HD-45', 'Headphones', 'Bose', 'Piece', 15, 100.00, 80.00, 'In Stock'],
            ['prd-017', '#PRD0017', 'Adidas Running Shoe', 'ADI-SHO-RUN', 'Footwear', 'Adidas', 'Pack', 20, 400.00, 380.00, 'In Stock'],
            ['prd-016', '#PRD0016', 'Dyson Vacuum Cleaner', 'DYS-VC-100', 'Appliances', 'Dyson', 'Piece', 0, 750.00, 730.00, 'Out of Stock'],
        ];
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO products (id, organization_id, code, name, sku, category, brand, unit, quantity, selling_price, purchase_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($products as $p) {
            $stmt->execute([$p[0], $orgId, $p[1], $p[2], $p[3], $p[4], $p[5], $p[6], $p[7], $p[8], $p[9], $p[10]]);
        }

        // 12. Warehouses
        $warehouses = [
            ['wrh-020', '#WRH0020', 'Smart Stock Hub', 'Ethan Walker', 30000, 85],
            ['wrh-019', '#WRH0019', 'Flow Grid Storage', 'Madison Clark', 20000, 75],
            ['wrh-018', '#WRH0018', 'Prime Storage Solutions', 'James Harris', 300000, 61],
        ];
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO warehouses (id, organization_id, code, name, contact_person, capacity, current_utilization_pct) VALUES (?, ?, ?, ?, ?, ?, ?)");
        foreach ($warehouses as $w) {
            $stmt->execute([$w[0], $orgId, $w[1], $w[2], $w[3], $w[4], $w[5]]);
        }

        // 13. Invoices & Payments & General Ledger
        $invId = 'inv-020';
        $payId = 'pay-020';
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO invoices (id, organization_id, invoice_number, customer_name, customer_email, invoice_date, due_date, subtotal, tax_amount, total_amount, paid_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$invId, $orgId, '#INV0020', 'Alexander Kenn', 'alex@kenn.com', '2026-09-11', '2026-10-11', 500.00, 0.00, 500.00, 500.00, 'Paid']);

        $stmt = $pdo->prepare("INSERT OR REPLACE INTO payments (id, organization_id, payment_number, payment_type, party_name, amount, payment_method, payment_date, invoice_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$payId, $orgId, '#PAY0020', 'Receive', 'Alexander Kenn', 500.00, 'Bank Transfer', '2026-09-11', $invId, 'Paid']);

        // Balanced GL Entries (Debit Bank 1010 $500, Credit Revenue 4010 $500)
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO gl_entries (id, organization_id, posting_date, account_id, debit, credit, voucher_type, voucher_id, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute(['gl-001', $orgId, '2026-09-11', 'coa-1010', 500.00, 0.00, 'Payment', $payId, 'Payment received for #INV0020']);
        $stmt->execute(['gl-002', $orgId, '2026-09-11', 'coa-4010', 0.00, 500.00, 'Invoice', $invId, 'Sales invoice #INV0020']);

        // 14. Purchase Order
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO purchase_orders (id, organization_id, po_number, supplier_name, category, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute(['po-020', $orgId, '#ORD0020', 'Alpha Distributors', 'Raw Materials', 500.00, 'Delivered']);

        echo "Seeding completed successfully!\n";
    }
}
