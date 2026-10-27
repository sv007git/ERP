# Reference Architecture & License Analysis

This document provides a thorough analysis of the six open-source reference repositories located in `C:\Users\HARISH VYAS\Projects\ERP`, evaluating their frameworks, architecture, databases, authorization models, module structures, workflows, and licensing obligations.

---

## 1. Inventory & License Summary

| Repository | Version Verified | Primary Framework / Language | Database | License | License Compliance & Isolation Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **crm-1.89.2** | 1.89.2 | Frappe Framework (Python) + Vue 3 / Vite frontend | MariaDB / PostgreSQL | GNU AGPLv3 | Independent reference. Used for CRM workflow design, pipeline stages, activity tracking patterns. No code copied. |
| **erpnext-16.52.1** | 16.52.1 | Frappe Framework (Python) + Frappe UI / Desk | MariaDB / PostgreSQL | GNU GPLv3 | Reference for double-entry GL ledger, immutable stock ledger, invoice-to-payment lifecycle, CoA structure. No direct code reuse. |
| **espocrm-10.0.11** | 10.0.11 | Custom PHP 8.3+ modular framework (Doctrine DBAL) + Backbone / Custom Client | MySQL / MariaDB | GNU AGPLv3 | Reference for PHP architecture, metadata-driven entity modeling, role/record permissions, audit stream patterns. |
| **hrms-16.52.0** | 16.52.0 | Frappe Framework (Python) + Vue 3 / frappe-ui | MariaDB / PostgreSQL | GNU GPLv3 | Reference for HR lifecycle, leave allocation & approval state machines, attendance tracking, configurable payroll structures. |
| **icehrm-36.0.1** | 36.0.1 | IceHrm PHP framework (IceModel / PDO) + Angular / JS | MySQL / MariaDB | Elastic License 2.0 (ELv2) | **Caution: Non-permissive ELv2.** Must remain completely isolated. Inspected solely for domain requirements (attendance, employee files, leave types). Zero code copying permitted. |
| **idurar-erp-crm-4.1.1** | 4.1.1 | Node.js (Express, Mongoose) + React (Vite, Ant Design, Redux Toolkit) | MongoDB | GNU AGPLv3 | Reference for invoice/quote calculations, currency formatting, payment status transitions, clean client-side state handling. |

---

## 2. In-Depth Analysis by Repository

### 2.1. CRM 1.89.2 (Frappe CRM)
- **Framework & Core**: Built on Python/Frappe framework with an agile Vue 3 / Vite SPA frontend (`crm/frontend`).
- **Data Model**:
  - `CRM Lead`: Status progression (`Unassigned`, `Open`, `Contacted`, `Qualified`, `Lost`), lead score, lead owner, conversion to Deal/Contact.
  - `CRM Deal`: Multi-stage pipeline (`Lead In`, `Contact Made`, `Needs Defined`, `Proposal Sent`, `Negotiation`, `Won`, `Lost`), deal value, probability, expected close date.
  - `CRM Activity` & `Call Log`: Polymorphic associations with leads, deals, organizations, and contacts.
- **Architectural Lesson**:
  - Pipelines work best when stages have explicit probabilities and colored chevron visual progression (mirrored in our UI reference `08_Deals_Activities.jpg`).
  - Interaction history should unify notes, phone logs, calendar events, and email in a single chronological stream.

### 2.2. ERPNext 16.52.1
- **Framework & Core**: Full-scale ERP monolith in Python/Frappe, covering Accounting, Selling, Buying, Stock, Manufacturing, Assets, and Maintenance.
- **Key Subsystems**:
  - **Accounting**:
    - Chart of Accounts with account types: `Asset`, `Liability`, `Equity`, `Income`, `Expense`. Root types, parent-child tree hierarchy.
    - Double-entry accounting: Every journal entry, invoice, or payment generates balanced `GL Entry` records (debit = credit).
    - Immutable posting: Posted transactions cannot be edited directly; corrections require cancellation / credit notes / reversal entries.
  - **Inventory & Purchasing**:
    - Stock Ledger: Every receipt, delivery, transfer, or adjustment creates an immutable `Stock Ledger Entry`.
    - Costing methods: Moving Average and FIFO. Real-time valuation accounts tied to Inventory Asset and Cost of Goods Sold (COGS).
    - Purchase Order -> Purchase Receipt (Goods Receipt) -> Purchase Invoice -> Payment.
  - **Sales**:
    - Quotation -> Sales Order -> Delivery Note -> Sales Invoice -> Payment Entry.
- **Architectural Lesson**:
  - Transactional boundaries must wrap multi-entity postings (e.g. Sales Invoice creation posting both AR and tax ledger lines, or Delivery Note posting Stock Ledger and COGS).

### 2.3. EspoCRM 10.0.11
- **Framework & Core**: Highly structured PHP 8.3+ backend using modern OOP, PSR standards, dependency injection, and metadata-driven JSON entity definitions (`application/Espo/Resources/metadata/entityDefs`).
- **Authorization & Security**:
  - Granular RBAC: Permissions defined at entity level (`create`, `read`, `edit`, `delete`, `stream`) and scope (`all`, `team`, `own`, `no`).
  - Field-level security: Sensitive fields (e.g., salary, SSN, cost price) can be read-only or hidden based on roles.
  - Prepared statements with Doctrine DBAL, strict parameter binding, CSRF tokens on state-modifying requests.
- **Architectural Lesson**:
  - Inspires the Variant B (PHP/MySQL) architecture: Service-Layer separation where Controllers handle HTTP requests and validation, Services orchestrate business logic and transactions, and Repositories handle database interactions.

### 2.4. HRMS 16.52.0 (Frappe HRMS)
- **Framework & Core**: Modern human resources module suite for Frappe.
- **Key Workflows**:
  - **Employee Lifecycle**: Profile, personal details, employment details, reporting hierarchy (manager / supervisor), status (`Active`, `Suspended`, `Left`).
  - **Attendance**: Daily records (`Present`, `Absent`, `Half Day`, `Work From Home`), late check-in tracking.
  - **Leave Management**: Leave Types (Annual, Sick, Casual, Maternity, Unpaid), Leave Allocation per period, Leave Application with approval states (`Draft`, `Applied`, `Approved`, `Rejected`, `Cancelled`). Automatic balance deduction upon approval.
  - **Payroll**: Configurable Salary Structure (Earnings like Basic, HRA, Allowances; Deductions like Tax, Provident Fund), Salary Slip generation per pay period, bank transfer export.
- **Architectural Lesson**:
  - Keep payroll calculation rules modular and configurable to avoid statutory hardcoding.
  - Multi-level leave approvals need clear role boundaries (only designated managers or HR admins can approve).

### 2.5. IceHrm 36.0.1
- **Framework & Core**: PHP application with custom MVC/IceModel framework, using PDO MySQL.
- **Key Modules**: Employee Information System, Leave Tracking, Attendance Punch In/Out, Performance Reviews, Company Documents.
- **Licensing Constraint**:
  - Governed by Elastic License 2.0 (ELv2), which prohibits providing the software to third parties as a hosted service.
  - **Compliance Decision**: All code, schemas, and assets must be developed completely independently. Only high-level conceptual requirements are studied.

### 2.6. Idurar ERP/CRM 4.1.1
- **Framework & Core**: MERN stack (Node.js/Express + React/Ant Design) tailored for small business invoicing and client management.
- **Key Modules**: Clients, Quotes, Invoices, Payments, Expenses, Payment Modes, PDF Generation.
- **Architectural Lesson**:
  - Clean status flow for invoices: `Draft` -> `Pending` -> `Sent` -> `Partially Paid` -> `Paid` -> `Cancelled`.
  - Monetary calculations require rigorous rounding and decimal precision (using high-precision numeric storage rather than raw floating-point math).

---

## 3. Feature Comparison Matrix

| Capability / Module | CRM 1.89.2 | ERPNext 16.52.1 | EspoCRM 10.0.11 | HRMS 16.52.0 | IceHrm 36.0.1 | Idurar 4.1.1 | **Our Target Platform** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Authentication & RBAC** | ✅ (Frappe) | ✅ (Frappe) | ✅ (Espo ACL) | ✅ (Frappe) | ✅ (IceHrm) | ✅ (JWT) | **✅ Multi-tenant / Role Matrix** |
| **Organization & Branches** | ✅ | ✅ Multi-company | ✅ Teams | ✅ | ✅ | ❌ Single | **✅ Org & Branch Scoped** |
| **Leads & Deals Pipeline** | ✅ (Primary) | ✅ | ✅ (Primary) | ❌ | ❌ | ✅ | **✅ Visual Chevron Pipeline** |
| **Contacts & Accounts** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | **✅ Full CRM 360 View** |
| **Employee Directory** | ❌ | ✅ | ❌ | ✅ (Primary) | ✅ (Primary) | ❌ | **✅ Hierarchy & Profiles** |
| **Attendance & Leave** | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | **✅ Balance + Approval Flow** |
| **Configurable Payroll** | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | **✅ Salary Slips & Structures** |
| **Chart of Accounts & GL** | ❌ | ✅ (Primary) | ❌ | ❌ | ❌ | ❌ | **✅ Double-Entry Ledger** |
| **Invoices, Bills & Payments** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | **✅ AR / AP + Settlements** |
| **Product & Stock Ledger** | ❌ | ✅ (Primary) | ❌ | ❌ | ❌ | ✅ (Basic) | **✅ Multi-warehouse & Movements** |
| **Purchase Orders & Receipts**| ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | **✅ 3-Way Match POs & Receipts** |
| **Audit Trail & Timeline** | ✅ | ✅ | ✅ (Stream) | ✅ | ❌ | ❌ | **✅ Entity Activity Logs** |

---

## 4. Synthesis & Adopted Patterns

Based on the analysis of these six systems and the reference UI assets in the workspace:

1. **Visual Language**: Adopt the "Dreams ERP" design language evidenced in `02_CRM_Dashboard.jpg` through `09_Projects.jpg`—emerald primary branding, clean card surfaces, chevron deal pipelines, comprehensive multi-metric KPI rows, and responsive data tables with status badges.
2. **Double-Entry Financial Architecture**: Adopt ERPNext's pattern of immutable `gl_entries` for all posted financial transactions, paired with decimal-safe numeric fields (stored as `DECIMAL(15,2)`).
3. **Traceable Inventory Ledger**: Adopt ERPNext's pattern of immutable `stock_ledger_entries` recording every quantity delta with warehouse, batch/reference, and valuation impact.
4. **Service-Layer PHP Architecture**: Adopt EspoCRM's clean layered architecture for Variant B: PSR-4 controllers, request validation, business service layer, transactional boundaries, and parameter-bound PDO queries.
5. **Modern Supabase Architecture**: For Variant A, implement normalized PostgreSQL tables with foreign keys, composite indexes, Row Level Security (RLS) policies scoped to `organization_id`, and a responsive TypeScript/React web frontend.
6. **Strict License Isolation**: No proprietary or AGPL/GPL/ELv2 code is imported into the new codebase. All schemas, controllers, frontend components, and services are original implementations fulfilling the common specification.
