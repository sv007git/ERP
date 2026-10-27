# Product Requirements Specification (PRS)
## Dreams ERP / CRM Dual-Stack Platform

**Status:** Approved Architecture Specification  
**Version:** 1.0.0  
**Target Environments:** 
- **Variant A:** Modern Web (TypeScript / React) + Supabase (PostgreSQL, Auth, RLS, Storage)
- **Variant B:** PHP 8+ Modular Service Layer + MySQL/MariaDB

---

## 1. Executive Overview & Mission

The platform is a unified, multi-tenant business management solution inspired by the design system of Dreams ERP and the enterprise capabilities of ERPNext, EspoCRM, Frappe HRMS, and Idurar. The platform guarantees strict multi-tenant isolation, immutable audit trails, double-entry financial accounting, and traceable stock movements across two independently deployable technology stacks.

---

## 2. Core Functional Modules & User Stories

### 2.1. Module 1: Platform Foundation & Administration
- **REQ-FND-01: Multi-Tenancy & Organizations**:
  - Every business record belongs to an `organization_id`.
  - Optional branch scoping via `branch_id`. Users may belong to multiple organizations or branches with specific roles.
- **REQ-FND-02: Authentication & Sessions**:
  - Secure credential storage (Argon2id or bcrypt).
  - Rate-limited login attempts, session expiration, and secure token issuance.
- **REQ-FND-03: Role-Based Access Control (RBAC)**:
  - Default roles: `Super Admin`, `Admin`, `Sales Manager`, `Sales Rep`, `HR Manager`, `Employee`, `Accountant`, `Inventory Manager`.
  - Granular entity permissions: `create`, `read`, `update`, `delete`, `approve`, `export`.
- **REQ-FND-04: Audit Trail**:
  - Immutable audit logs capturing `actor_id`, `organization_id`, `action`, `entity_type`, `entity_id`, `changes` (JSON diff), `ip_address`, and `created_at`.
- **REQ-FND-05: Global Settings & Numbering**:
  - Configurable prefix and auto-incrementing document numbers: Invoices (`INV-YYYY-XXXX`), Purchase Orders (`PO-YYYY-XXXX`), Sales Orders (`SO-YYYY-XXXX`), Deals (`DEL-XXXX`), Employees (`EMP-XXXX`).

---

### 2.2. Module 2: CRM & Sales Pipeline
- **REQ-CRM-01: Lead Management**:
  - Track leads with fields: First Name, Last Name, Email, Phone, Company, Source (`Organic Search`, `Campaigns`, `Referral`, `Marketing`, `Paid Social`, `Events`), Lead Score, Status (`New`, `Contacted`, `Qualified`, `Unqualified`, `Lost`).
  - Action to convert qualified lead into Account + Contact + Opportunity.
- **REQ-CRM-02: Deals & Opportunities**:
  - Visual Chevron Pipeline stages:
    1. `Qualify To Buy` (Probability: 20%)
    2. `Contact Made` (Probability: 40%)
    3. `Presentation` (Probability: 60%)
    4. `Proposal Made` (Probability: 80%)
    5. `Appointment / Negotiation` (Probability: 90%)
    6. `Closed Won` (Probability: 100%)
    7. `Closed Lost` (Probability: 0%)
  - Deal Value, Expected Close Date, Primary Contact, Assigned Sales Rep.
- **REQ-CRM-03: Activities & Timeline**:
  - Polymorphic activity timeline: Meetings, Calls, Notes, Tasks, and File Attachments.
  - Due date reminders and completion status.
- **REQ-CRM-04: Quotations & Sales Orders**:
  - Quotation generation with line items, unit price, quantity, tax rate, and total calculation.
  - Conversion workflow: `Quote -> Approved -> Sales Order -> Invoice`.

---

### 2.3. Module 3: HRMS & Talent Management
- **REQ-HRM-01: Employee Directory**:
  - Profiles with Employee ID, Full Name, Work Email, Phone, Department, Position / Designation, Manager / Reports To, Date of Joining, Employment Type (`Full-time`, `Part-time`, `Contractor`), Status (`Active`, `On Leave`, `Terminated`).
- **REQ-HRM-02: Attendance Tracking**:
  - Daily check-in/out logging: Status (`Present`, `Late`, `Absent`, `Remote / WFH`, `Half Day`).
  - Time tracking and monthly summaries.
- **REQ-HRM-03: Leave Management**:
  - Leave Types: Annual Leave, Sick Leave, Casual Leave, Maternity/Paternity, Unpaid Leave.
  - Leave Allocation: Annual balance credit per employee.
  - Leave Application: Date range, reason, attachment.
  - Approval State Machine: `Draft -> Submitted -> Approved (Manager / HR) -> Rejected / Cancelled`.
  - Automatic balance deduction upon approval.
- **REQ-HRM-04: Payroll Configuration & Salary Processing**:
  - Salary Structures: Basic Pay, House Rent Allowance (HRA), Transport Allowance, Deductions (Tax, Social Security / PF).
  - Payroll Runs: Monthly batch processing generating individual `Salary Slips` with net pay calculation and payslip generation.

---

### 2.4. Module 4: Finance & Double-Entry Accounting
- **REQ-ACC-01: Chart of Accounts (CoA)**:
  - Standard five-category accounting model:
    1. `Asset` (Current, Bank, Accounts Receivable, Inventory)
    2. `Liability` (Accounts Payable, Credit Cards, Payroll Liabilities)
    3. `Equity` (Retained Earnings, Owner Capital)
    4. `Income / Revenue` (Operating Revenue, Sales, Service Fees)
    5. `Expense` (COGS, Rent, Salaries, Office Supplies, Utilities)
- **REQ-ACC-02: Double-Entry General Ledger (`gl_entries`)**:
  - Every financial transaction posts at least one debit and one credit line.
  - Mandatory invariant: `SUM(debit) == SUM(credit)` within every transaction bundle.
  - Posted entries are immutable. Reversals create explicit offset entries.
- **REQ-ACC-03: Accounts Receivable (Invoices & Payments)**:
  - Customer Invoices: Line items, subtotal, tax amount, total, due date.
  - Statuses: `Draft`, `Pending / Unpaid`, `Partially Paid`, `Paid`, `Cancelled`.
  - Automatic GL Posting on Invoice Finalization:
    - Debit: `Accounts Receivable`
    - Credit: `Sales Revenue`
    - Credit: `Tax Payable` (if applicable)
  - Payment Allocation: Matching incoming funds against open invoices.
    - Debit: `Bank / Cash`
    - Credit: `Accounts Receivable`
- **REQ-ACC-04: Accounts Payable (Vendor Bills & Payments)**:
  - Supplier bills linked to purchase orders.
  - On Bill Approval:
    - Debit: `Expense / Inventory Asset`
    - Credit: `Accounts Payable`
  - On Bill Payment:
    - Debit: `Accounts Payable`
    - Credit: `Bank / Cash`
- **REQ-ACC-05: Financial Reporting**:
  - Real-time generation of:
    - Trial Balance (Debit vs Credit verification)
    - Profit & Loss Statement (Income minus Expenses over date range)
    - Balance Sheet (Assets = Liabilities + Equity at point in time)

---

### 2.5. Module 5: Inventory & Purchasing
- **REQ-INV-01: Products & Services**:
  - Item Code / SKU, Barcode, Name, Description, Type (`Goods`, `Service`), Category, Unit of Measure (`Piece`, `Box`, `Kg`, `Hour`), Cost Price, Selling Price.
- **REQ-INV-02: Warehouses & Stock Locations**:
  - Multi-warehouse support with contact person, capacity, and current utilization percentage.
- **REQ-INV-03: Traceable Stock Ledger (`stock_ledger_entries`)**:
  - Every movement is an immutable record: Item ID, Warehouse ID, Quantity In / Out, Unit Cost, Total Value, Transaction Reference (`Goods Receipt`, `Delivery Note`, `Adjustment`).
- **REQ-INV-04: Purchase Orders & Goods Receipts**:
  - Supplier selection, item lines, expected delivery date.
  - Receiving workflow: `Purchase Order -> Goods Receipt (Stock In) -> Vendor Bill`.
  - Low stock warning triggered when quantity on hand falls below `reorder_level`.

---

## 3. Non-Functional Requirements (NFRs)

- **NFR-SEC-01 (Multi-Tenant Isolation)**: Strict row-level or query-level scoping ensuring tenant A can never read, modify, or infer tenant B's data.
- **NFR-SEC-02 (Input Validation & Output Sanitization)**: Server-side validation of all payloads; parameterized queries to completely prevent SQL injection; HTML escaping on render.
- **NFR-PERF-01 (Response Time)**: Sub-200ms API response time for typical CRUD queries; optimized indexes on foreign keys and frequently queried status/date fields.
- **NFR-REL-01 (Transactional Integrity)**: ACID transactions wrapping all multi-step postings (Accounting GL, Payment allocation, Stock ledger updates).
- **NFR-MAINT-01 (Zero-Pain Updates)**: Decoupled database migrations, deterministic seeders, and documented patch application commands.
