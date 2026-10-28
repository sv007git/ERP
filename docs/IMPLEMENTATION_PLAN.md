# ERP Platform — Comprehensive Implementation Plan

## 1. Objectives & Guiding Principles
This plan outlines the systematic implementation of the complete, production-grade **ERP** platform across both technology variants:
- **Variant A**: React 19 + TypeScript + Vite + Tailwind CSS + Supabase.
- **Variant B**: PHP 8.5+ + MySQL/MariaDB/SQLite + PDO layered architecture.

### Core Non-Negotiables:
1. **Total Brand Normalization**: Eliminate all instances of "Dreams ERP", "Dream ERP", or external vendor branding. Standardize on **ERP**.
2. **Detailed Deal Workstation**: Faithfully recreate the full, multi-column, tabbed deal workspace (`08_Deals_Activities.jpg` and `deal-details.html`).
3. **Comprehensive Module Coverage**: Deliver functional dashboards, data tables, and creation modals for CRM, Sales, Inventory, Procurement, Finance, HRMS, Projects, and Support.
4. **Data Persistence & Invariants**: Enforce double-entry accounting balance ($\sum \text{Debit} = \sum \text{Credit}$), immutable stock ledger entries, and atomic leave deductions.
5. **Full Test & Build Verification**: All Vitest, PHPUnit/acceptance scripts, and TypeScript builds must pass with zero errors.

---

## 2. Phase-by-Phase Execution Schedule

### Phase 1: Brand Sanitization & Core State Normalization
- Update application title, metadata, logos, and footers from "Dreams ERP" to **ERP**.
- Standardize color tokens, dark/light theme classes, and global layout definitions.
- Update `LocalErpStore` in `variant-a-supabase/src/lib/supabase.ts` with comprehensive entities for Deals, Activities, Notes, Calls, Files, Invoices, Purchase Orders, Projects, and Support Tickets.

### Phase 2: Detailed Deal Workstation (`08_Deals_Activities.jpg`)
- Rebuild `src/pages/DealsPage.tsx` into a full workstation:
  - **Summary Header**: Circle avatar `CR`, deal name, company, address, private badge, status dropdown (`Won ∨`).
  - **Information Panel**: Creation date, probability %, value ($25,11,145), due date, follow-up, source, deal owners, tags (`Collab`, `VIP`), priority (`High`), projects, contacts, last modified.
  - **Pipeline Chevron Bar**: Interactive 5-stage progression (`Qualify To Buy`, `Contact Made`, `Presentation`, `Proposal Made`, `Appointment`).
  - **Tabbed Activity Center**: 5 working tabs:
    1. `Activities`: Date-grouped chronological timeline (`Today`, `28 Sep 2025`, `27 Sep 2025`), inline reminder/priority/assignment selects, modal to add activities.
    2. `Notes`: Rich note listing and creation form.
    3. `Calls`: Call log recording with duration, outcome, and follow-up.
    4. `Files`: Document attachments with upload dialog.
    5. `Email`: Email communication history and compose modal.

### Phase 3: Sales & Revenue Operations (`07_Sales_Dashboard.jpg`)
- Build `src/pages/SalesPage.tsx`:
  - KPI row: Revenue ($12.8K), Open Invoices (28), Open Orders (156), New Customers (378).
  - Revenue trends chart with time horizon toggles (`1D`, `7D`, `1M`, `1Y`).
  - Sales by Region breakdown.
  - Top Customers, Top Selling Products, Recent Transactions.
  - Recent Sales Activity table (`Invoices`, `Sales Orders`, `Credit Notes`, `Sales Quotes`).
  - Interactive `+ Create Invoice` modal with line item calculation and printable preview.

### Phase 4: Procurement & Purchasing Operations (`05_Procurement_Dashboard.jpg`)
- Build `src/pages/ProcurementPage.tsx`:
  - KPI row: Total Spend ($2,145), Purchase Orders (128), On-Time Delivery (88%), Avg PO Value ($600).
  - Top Suppliers horizontal bar chart & Monthly Spend trend.
  - Supplier Performance scatter and Spend by Category donut.
  - Recent Procurement Activity table (`#PAR0020`, Supplier, Requestor, Ordered Qty, Delivered Qty, Status).
  - Interactive `+ New Purchase Order` modal.

### Phase 5: Customer Support & Helpdesk Operations (`06_Support_Dashboard.jpg`)
- Build `src/pages/SupportPage.tsx`:
  - Ticket Volume chart & SLA Breaches donut.
  - KPI cards: Open Tickets (128), Avg Response (2.4 hrs), SLA Compliance (94%), KB Articles (378).
  - Satisfaction Rate & Response Time charts.
  - All Tickets table (`#TKT0020`, Customer, Subject, Priority badges, Status badges).
  - Interactive `+ Add Ticket` modal.

### Phase 6: Projects & Task Management (`09_Projects.jpg`)
- Build `src/pages/ProjectsPage.tsx`:
  - Project card grid: Code (`#PRO0020`), Title, Description, Progress bar, Team member avatars, Deadline badge.
  - Interactive `+ Add New Project` modal.
  - Task status tracking and completion toggles.

### Phase 7: Top Navigation, Global Search & Theme Control
- Implement Global Command Palette (`⌘K` / `Ctrl+K`) filtering across all entities.
- Implement functional Dark/Light theme toggle altering CSS root classes.
- Implement Notifications dropdown with real unread counts and quick actions.
- Implement Tenant switcher context for multi-company isolation.

### Phase 8: Variant B (PHP & MySQL) Parity & Services
- Extend `variant-b-php-mysql`:
  - Enhance `ApiController.php` to serve CRM, Sales, Procurement, Projects, Support, and HRM endpoints.
  - Update `install.php` with self-locking security installer and database check.
  - Update database seeder with complete cross-module demo records.
  - Expand `tests/run_tests.php` to verify all domain invariants.

### Phase 9: Verification, Deployment & GitHub Synchronization
- Execute Vitest suite in `variant-a-supabase`.
- Execute PHP automated test suite in `variant-b-php-mysql`.
- Execute cross-variant Python test runner in `shared-tests/verify_acceptance.py`.
- Build production assets (`npm run build`).
- Push to GitHub `main` and deploy to `gh-pages` at `https://sv007git.github.io/ERP/`.
