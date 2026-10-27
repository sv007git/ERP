# Dual-Stack Feature Parity Matrix

**Document:** `shared-specifications/FEATURE_PARITY.md`  
**System:** Dreams ERP / CRM Dual-Stack Platform  
**Purpose:** Maps every business workflow to both Variant A and Variant B implementations to ensure strict functional equivalence.

---

## 1. Feature Parity Mapping

| Module / Workflow | Specific Business Acceptance Criteria | Variant A (Supabase + React) | Variant B (PHP + MySQL/MariaDB) | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Foundation: Multi-Tenancy** | Isolation by `organization_id`; users cannot query other tenants | Row Level Security (RLS) | Repository Tenant Scoping Middleware | **Complete** |
| **Foundation: Authentication** | Secure login, session/JWT issuance, password hashing | Supabase Auth | Native PHP Password Hash (Bcrypt/Argon2) | **Complete** |
| **Foundation: Audit Logging** | Changes to sensitive entities appended to immutable `audit_logs` | PostgreSQL Trigger / Audit Service | Domain Event Audit Service | **Complete** |
| **CRM: Leads & Conversion** | Create lead, track source, convert lead to deal + contact | Supabase Database Table + UI Form | PHP Controller + Validation | **Complete** |
| **CRM: Deals & Pipeline** | Chevron stage advancement, probability calculation, deal values | Interactive Chevron Component + DB update | REST API Endpoint + DB update | **Complete** |
| **CRM: Activity Timeline** | Log meetings, calls, notes attached to deal | Polymorphic Activity Feed | Activity Service + Repository | **Complete** |
| **HRMS: Employee Directory** | List employees with department, manager, salary, code | Supabase Schema + Filterable Table | PHP Repository + Search/Filters | **Complete** |
| **HRMS: Attendance Clocking** | Daily clock-in/out, status calculation (Present/Late) | Attendance API + Realtime UI | Attendance Controller + DB Unique Key | **Complete** |
| **HRMS: Leave Management** | Submit request, manager approval, atomic balance deduction | Supabase Stored Function / RLS | Transactional Leave Service | **Complete** |
| **HRMS: Payroll Slips** | Monthly salary slip generation with basic + allowances - tax | Payroll Calculation RPC / Service | Batch Payroll Service | **Complete** |
| **Finance: Chart of Accounts**| 5 standard root account types, hierarchical code tree | CoA Table with recursive parent_id | Hierarchical CoA Repository | **Complete** |
| **Finance: Double-Entry GL** | Balanced debits and credits on invoices, bills, payments | Transactional Trigger / Function | ACID Database Transaction Service | **Complete** |
| **Finance: Invoices & Payment**| Create invoice -> record payment -> update status to Paid | Client API + Realtime DB | Invoicing & Payment Service | **Complete** |
| **Inventory: Products & SKU** | Code, SKU, Category, UOM, Cost/Selling price, Quantity | Products Table with stock tracking | Products Repository + Validation | **Complete** |
| **Inventory: Warehouses** | Capacity, Utilization gauge %, location details | Warehouses Table + Calculation | Warehouse Model + Stats API | **Complete** |
| **Inventory: Stock Ledger** | Traceable quantity deltas per movement (In/Out) | Immutable `stock_ledger_entries` | Immutable `stock_ledger_entries` | **Complete** |
| **Purchasing: PO to Receipt** | Create PO -> Goods Receipt -> increment stock balance | PO State Machine + Stock Entry | Purchase Order Service + Inventory | **Complete** |
| **UI: Dreams ERP Aesthetic** | 4-card KPI row, sidebar navigation, dark/light theme | Tailwind CSS + Lucide React | Clean Blade / HTML + Tailwind | **Complete** |

---

## 2. Shared Acceptance Test Scenarios

### Workflow Test Scenario 1: Complete Sales-to-Cash Cycle
1. Create a customer / lead `#LED0020` ("Robert Cosper").
2. Create deal `#DEL0020` ("CRM Subscription") valued at $154,000.
3. Advance deal through stages: `Qualify To Buy` -> `Contact Made` -> `Won`.
4. Issue Invoice `#INV0020` for $154,000.
5. Post payment `#PAY0020` for $154,000 via Bank Transfer.
6. Verify General Ledger:
   - Debit: `Cash at Bank` = $154,000
   - Credit: `Sales Revenue` = $154,000
   - Invariant verified: $\sum \text{Debit} - \sum \text{Credit} = 0$.

### Workflow Test Scenario 2: Procure-to-Stock Cycle
1. Create purchase order `#ORD0020` to "Alpha Distributors" for 10 units of "Apple iPhone 15" at $230/unit ($2,300).
2. Receive goods receipt into "Smart Stock Hub" warehouse.
3. Verify product `#PRD0020` stock quantity increases by +10.
4. Verify `stock_ledger_entries` records `delta_qty: +10`, `unit_cost: $230.00`.

### Workflow Test Scenario 3: Employee Leave Approval
1. Employee "Alex Thompson" submits leave request for 3 days.
2. Initial status is `Pending`.
3. Authorized manager approves the request.
4. Verify status transitions to `Approved`.
5. Verify employee's remaining leave balance is decremented by 3 days.
