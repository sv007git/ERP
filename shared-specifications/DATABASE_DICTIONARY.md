# Shared Database Dictionary
## Dreams ERP / CRM Dual-Stack Platform

**Status:** Approved Reference Schema  
**Dialect Portability:** PostgreSQL 15+ (Variant A Supabase) and MySQL 8.0+ / MariaDB 10.11+ / SQLite 3 (Variant B PHP)  
**Conventions:**
- Primary keys: `id` (UUID in Supabase / PostgreSQL; `CHAR(36)` / UUID / `BIGINT AUTO_INCREMENT` in MySQL/MariaDB)
- Foreign keys: `<entity>_id` with explicit foreign key constraints and indexed lookup
- Multi-tenancy: Mandatory `organization_id` on all tenant-scoped tables
- Timestamps: `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`, `updated_at`

---

## 1. Platform Foundation

### 1.1 `organizations`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Tenant identifier |
| `name` | VARCHAR(120) | NOT NULL | Organization legal/trading name (e.g., "Falcon LLP") |
| `slug` | VARCHAR(64) | NOT NULL, UNIQUE | URL-safe slug |
| `currency` | CHAR(3) | NOT NULL DEFAULT 'USD'| Base reporting currency |
| `fiscal_year_start_month` | INT | NOT NULL DEFAULT 1 | Start month of fiscal year (1=Jan, 4=Apr) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last modification |

### 1.2 `branches`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Branch ID |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `name` | VARCHAR(100) | NOT NULL | Branch name (e.g., "New York HQ", "London Office") |
| `code` | VARCHAR(20) | NOT NULL | Short branch code (e.g., "NY-01") |
| `is_main` | BOOLEAN | DEFAULT FALSE | Main organization branch |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |

### 1.3 `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | User ID (maps to `auth.users.id` in Supabase) |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Active tenant |
| `email` | VARCHAR(191) | NOT NULL, UNIQUE | User email address |
| `password_hash` | VARCHAR(255) | NULL (Variant B stores hash, Supabase stores in auth.users) | Password hash |
| `full_name` | VARCHAR(120) | NOT NULL | Display name (e.g. "Jamie Anderson") |
| `avatar_url` | VARCHAR(255) | NULL | Profile image link |
| `role` | VARCHAR(50) | NOT NULL DEFAULT 'Employee' | User role title |
| `status` | VARCHAR(20) | NOT NULL DEFAULT 'Active' | `Active`, `Inactive`, `Suspended` |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Registration timestamp |

### 1.4 `audit_logs`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Log ID |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `user_id` | UUID / CHAR(36) | NULL, FK -> users(id) | User who executed the action |
| `action` | VARCHAR(50) | NOT NULL | `create`, `update`, `delete`, `post`, `approve` |
| `entity_type` | VARCHAR(60) | NOT NULL | `deal`, `invoice`, `employee`, `stock_entry` |
| `entity_id` | VARCHAR(64) | NOT NULL | Target entity primary key |
| `details` | JSON / TEXT | NULL | JSON payload of changes or parameters |
| `ip_address` | VARCHAR(45) | NULL | IPv4 / IPv6 address |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Audit timestamp |

---

## 2. CRM & Sales

### 2.1 `leads`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Lead identifier |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `code` | VARCHAR(20) | NOT NULL | Auto-number (e.g., `#LED0020`) |
| `name` | VARCHAR(120) | NOT NULL | Lead person name (e.g., "Robert Cosper") |
| `company_name` | VARCHAR(120) | NULL | Prospective company |
| `email` | VARCHAR(191) | NULL | Email |
| `phone` | VARCHAR(50) | NULL | Telephone |
| `lead_owner_id` | UUID / CHAR(36) | NULL, FK -> users(id) | Assigned sales rep |
| `source` | VARCHAR(50) | NOT NULL DEFAULT 'Organic Search' | `Organic Search`, `Campaigns`, `Referral`, etc. |
| `status` | VARCHAR(30) | NOT NULL DEFAULT 'Not Closed' | `Not Closed`, `Contacted`, `Closed`, `Lost` |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### 2.2 `deals`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Deal identifier |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `code` | VARCHAR(20) | NOT NULL | Deal code (e.g., `#DEL0020`) |
| `name` | VARCHAR(150) | NOT NULL | Deal title (e.g., "CRM Subscription") |
| `company_name` | VARCHAR(120) | NULL | Client company (e.g., "Nexora") |
| `stage` | VARCHAR(50) | NOT NULL DEFAULT 'Qualify To Buy'| Chevron stage (e.g. `Qualify To Buy`, `Contact Made`, `Presentation`, `Proposal Made`, `Appointment`, `Closed Won`, `Closed Lost`) |
| `probability` | INT | NOT NULL DEFAULT 20 | 0 to 100 percentage |
| `deal_value` | DECIMAL(15,2) | NOT NULL DEFAULT 0.00 | Monetary value |
| `owner_id` | UUID / CHAR(36) | NULL, FK -> users(id) | Deal owner |
| `due_date` | DATE | NULL | Target close date |
| `priority` | VARCHAR(20) | NOT NULL DEFAULT 'High' | `Low`, `Medium`, `High`, `Urgent` |
| `status` | VARCHAR(20) | NOT NULL DEFAULT 'Open' | `Open`, `Won`, `Lost` |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record created |

### 2.3 `deal_activities`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Activity identifier |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `deal_id` | UUID / CHAR(36) | NOT NULL, FK -> deals(id) | Target deal |
| `user_id` | UUID / CHAR(36) | NOT NULL, FK -> users(id) | Performed by |
| `type` | VARCHAR(30) | NOT NULL | `meeting`, `note`, `call`, `email`, `task` |
| `title` | VARCHAR(200) | NOT NULL | Activity headline |
| `description` | TEXT | NULL | Full text |
| `priority` | VARCHAR(20) | DEFAULT 'Normal' | Priority level |
| `scheduled_at` | TIMESTAMP | NULL | Scheduled execution |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Logged time |

---

## 3. HRMS

### 3.1 `departments`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Department ID |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `name` | VARCHAR(80) | NOT NULL | `Engineering`, `Marketing`, `Finance`, `Sales`, `HR` |

### 3.2 `employees`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Employee identifier |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `employee_code` | VARCHAR(20) | NOT NULL | Code (e.g. `EMP-001`) |
| `user_id` | UUID / CHAR(36) | NULL, FK -> users(id) | Linked user login |
| `full_name` | VARCHAR(120) | NOT NULL | e.g., "Alex Thompson" |
| `email` | VARCHAR(191) | NOT NULL | Work email |
| `phone` | VARCHAR(50) | NULL | Phone |
| `department_id` | UUID / CHAR(36) | NULL, FK -> departments(id) | Department |
| `position` | VARCHAR(100) | NOT NULL | Designation (e.g. "Senior Developer") |
| `manager_id` | UUID / CHAR(36) | NULL, FK -> employees(id) | Direct supervisor |
| `date_of_joining` | DATE | NOT NULL | Start date |
| `salary` | DECIMAL(15,2) | NOT NULL DEFAULT 0.00 | Monthly base salary |
| `status` | VARCHAR(20) | NOT NULL DEFAULT 'Active' | `Active`, `On Leave`, `Terminated` |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Created time |

### 3.3 `attendance_records`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Record ID |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `employee_id` | UUID / CHAR(36) | NOT NULL, FK -> employees(id) | Employee reference |
| `date` | DATE | NOT NULL | Attendance date |
| `check_in` | TIME | NULL | Clock in time |
| `check_out` | TIME | NULL | Clock out time |
| `status` | VARCHAR(20) | NOT NULL DEFAULT 'Present' | `Present`, `Late`, `Absent`, `Remote` |
| UNIQUE(`employee_id`, `date`) | | | One record per employee per day |

### 3.4 `leave_requests`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Request ID |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `employee_id` | UUID / CHAR(36) | NOT NULL, FK -> employees(id) | Requester |
| `leave_type` | VARCHAR(40) | NOT NULL | `Annual`, `Sick`, `Casual`, `Unpaid` |
| `start_date` | DATE | NOT NULL | From date |
| `end_date` | DATE | NOT NULL | To date |
| `days_count` | DECIMAL(4,1) | NOT NULL | Total business days |
| `reason` | TEXT | NULL | Application reason |
| `status` | VARCHAR(20) | NOT NULL DEFAULT 'Pending' | `Pending`, `Approved`, `Rejected` |
| `approved_by` | UUID / CHAR(36) | NULL, FK -> users(id) | Authorizing manager |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Application time |

---

## 4. Finance & Accounting

### 4.1 `chart_of_accounts`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Account identifier |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `account_code` | VARCHAR(20) | NOT NULL | e.g., `1010`, `1200`, `2000`, `4000`, `5000` |
| `account_name` | VARCHAR(120) | NOT NULL | e.g. "Cash at Bank", "Accounts Receivable", "Sales Revenue" |
| `account_type` | VARCHAR(30) | NOT NULL | `Asset`, `Liability`, `Equity`, `Income`, `Expense` |
| `is_group` | BOOLEAN | DEFAULT FALSE | Parent folder or postable account |
| `parent_id` | UUID / CHAR(36) | NULL, FK -> chart_of_accounts(id) | Tree parent |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status |

### 4.2 `gl_entries` (General Ledger - Double Entry)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Ledger entry ID |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `posting_date` | DATE | NOT NULL | Effective transaction date |
| `account_id` | UUID / CHAR(36) | NOT NULL, FK -> chart_of_accounts(id) | Debited or credited account |
| `debit` | DECIMAL(15,2) | NOT NULL DEFAULT 0.00 | Debit amount |
| `credit` | DECIMAL(15,2) | NOT NULL DEFAULT 0.00 | Credit amount |
| `voucher_type` | VARCHAR(40) | NOT NULL | `Invoice`, `Bill`, `Payment`, `Journal Entry` |
| `voucher_id` | VARCHAR(64) | NOT NULL | Document primary key |
| `remarks` | VARCHAR(255) | NULL | Narrative memo |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Posting timestamp |

### 4.3 `invoices`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Invoice ID |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `invoice_number` | VARCHAR(30) | NOT NULL | e.g. `#INV0020` |
| `customer_name` | VARCHAR(120) | NOT NULL | e.g. "Alexander Kenn" |
| `customer_email` | VARCHAR(191) | NULL | Customer email |
| `invoice_date` | DATE | NOT NULL | Issuing date |
| `due_date` | DATE | NOT NULL | Payment due date |
| `subtotal` | DECIMAL(15,2) | NOT NULL DEFAULT 0.00 | Sum of line totals before tax |
| `tax_amount` | DECIMAL(15,2) | NOT NULL DEFAULT 0.00 | Tax amount |
| `total_amount` | DECIMAL(15,2) | NOT NULL DEFAULT 0.00 | Subtotal + tax |
| `paid_amount` | DECIMAL(15,2) | NOT NULL DEFAULT 0.00 | Amount settled |
| `status` | VARCHAR(20) | NOT NULL DEFAULT 'Pending' | `Draft`, `Pending`, `Paid`, `Cancelled` |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Created time |

### 4.4 `payments`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Payment ID |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `payment_number` | VARCHAR(30) | NOT NULL | e.g. `#PAY0020` |
| `payment_type` | VARCHAR(20) | NOT NULL | `Receive` (from customer) or `Pay` (to supplier) |
| `party_name` | VARCHAR(120) | NOT NULL | Customer or Supplier name |
| `amount` | DECIMAL(15,2) | NOT NULL | Settled funds |
| `payment_method` | VARCHAR(30) | NOT NULL DEFAULT 'Bank Transfer' | `Bank Transfer`, `Credit Card`, `Cash` |
| `payment_date` | DATE | NOT NULL | Date settled |
| `invoice_id` | UUID / CHAR(36) | NULL, FK -> invoices(id) | Associated invoice |
| `status` | VARCHAR(20) | NOT NULL DEFAULT 'Paid' | `Paid`, `Pending`, `Failed` |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Recorded timestamp |

---

## 5. Inventory & Purchasing

### 5.1 `products`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Product ID |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `code` | VARCHAR(20) | NOT NULL | Product Code (e.g. `#PRD0020`) |
| `name` | VARCHAR(150) | NOT NULL | e.g., "Apple iPhone 15" |
| `sku` | VARCHAR(50) | NOT NULL | e.g., `APP-PH-15` |
| `category` | VARCHAR(60) | NOT NULL | e.g., `Smartphones`, `Computers` |
| `brand` | VARCHAR(60) | NULL | e.g., `Apple`, `Dell`, `Bose` |
| `unit` | VARCHAR(20) | NOT NULL DEFAULT 'Piece' | `Piece`, `Pack`, `Kg`, `Box` |
| `quantity` | INT | NOT NULL DEFAULT 0 | Current stock on hand |
| `selling_price` | DECIMAL(15,2) | NOT NULL DEFAULT 0.00 | Unit retail price |
| `purchase_price`| DECIMAL(15,2) | NOT NULL DEFAULT 0.00 | Unit cost |
| `status` | VARCHAR(20) | NOT NULL DEFAULT 'In Stock' | `In Stock`, `Out of Stock`, `Low Stock` |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Created time |

### 5.2 `warehouses`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Warehouse ID |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `code` | VARCHAR(20) | NOT NULL | e.g. `#WRH0020` |
| `name` | VARCHAR(100) | NOT NULL | e.g., "Smart Stock Hub" |
| `contact_person`| VARCHAR(100) | NOT NULL | e.g., "Ethan Walker" |
| `capacity` | INT | NOT NULL DEFAULT 10000 | Max unit capacity |
| `current_utilization_pct` | INT | NOT NULL DEFAULT 0 | e.g. 85 for 85% |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Created time |

### 5.3 `purchase_orders`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Purchase Order ID |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `po_number` | VARCHAR(30) | NOT NULL | e.g. `#ORD0020` |
| `supplier_name` | VARCHAR(120) | NOT NULL | e.g., "Alpha Distributors" |
| `category` | VARCHAR(60) | NOT NULL | e.g., "Raw Materials", "IT Equipment" |
| `amount` | DECIMAL(15,2) | NOT NULL DEFAULT 0.00 | Total purchase value |
| `status` | VARCHAR(20) | NOT NULL DEFAULT 'Pending' | `Pending`, `Delivered`, `In Transit`, `Cancelled` |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

### 5.4 `stock_ledger_entries`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / CHAR(36) | PRIMARY KEY | Ledger entry ID |
| `organization_id` | UUID / CHAR(36) | NOT NULL, FK -> organizations(id) | Tenant reference |
| `product_id` | UUID / CHAR(36) | NOT NULL, FK -> products(id) | Product reference |
| `warehouse_id` | UUID / CHAR(36) | NOT NULL, FK -> warehouses(id) | Storage location |
| `delta_qty` | INT | NOT NULL | +Qty for In, -Qty for Out |
| `unit_cost` | DECIMAL(15,2) | NOT NULL | Valuation cost per unit |
| `voucher_type` | VARCHAR(40) | NOT NULL | `Goods Receipt`, `Delivery Note`, `Adjustment` |
| `voucher_id` | VARCHAR(64) | NOT NULL | Source document ID |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ledger entry time |
