# ERP Platform — Source Code Integration & Architectural Mapping

## 1. Clean-Room Architectural Strategy & Licensing Compliance
The ERP platform utilizes the six extracted reference repositories as domain, workflow, and architectural specifications. To prevent licensing contamination while adopting industry-standard ERP patterns, a **clean-room implementation strategy** is strictly observed:

1. **License Isolation**:
   - `icehrm-36.0.1` is licensed under **Elastic License 2.0 (ELv2)** and commercial dual-licensing. No code from IceHrm is copied directly into the codebase. Its relational concepts (such as atomic leave balance deductions and attendance state machines) are re-implemented cleanly in standard TypeScript and PHP.
   - `hrms-16.52.0`, `erpnext-16.52.1`, `espocrm-10.0.11`, and `crm-1.89.2` are licensed under **GNU General Public License v3 (GPL v3)**. They serve as architectural references for enterprise double-entry posting, immutable stock movements, and RBAC matrix design.
   - `idurar-erp-crm-4.1.1` is licensed under **MIT License**, permitting flexible structural reference for CRM pipeline stages, invoice calculation logic, and payment terms.
2. **Original Reference Preservation**:
   - All extracted directories in `C:\Users\HARISH VYAS\Projects\ERP` (`idurar-erp-crm-4.1.1`, `icehrm-36.0.1`, `hrms-16.52.0`, `espocrm-10.0.11`, `erpnext-16.52.1`, `crm-1.89.2`, and `New folder/`) remain completely untouched and unmodified.

---

## 2. Source-to-Target Integration Mapping

### 2.1 IDURAR ERP/CRM 4.1.1 (MIT)
- **Extracted Location**: `idurar-erp-crm-4.1.1/idurar-erp-crm-4.1.1/`
- **Key Reference Modules**:
  - `backend/src/models/appModels/Lead.js`, `Client.js`, `People.js`
  - `backend/src/models/appModels/Invoice.js`, `Quote.js`, `Payment.js`
  - `frontend/src/modules/CrmModule/`
- **Target ERP Implementation**:
  - **Variant A**:
    - `src/pages/CrmDashboard.tsx`: Lead capture, lead owners, status tags (`Closed`, `Contacted`, `Lost`).
    - `src/pages/DealsPage.tsx`: Full deal workstation, pipeline transitions.
    - `src/lib/supabase.ts`: Database store with schema matching IDURAR CRM fields (`name`, `source`, `status`, `value`, `assigned_to`).
  - **Variant B**:
    - `src/Models/Lead.php`, `Deal.php`, `Invoice.php`
    - `src/Controllers/ApiController.php`: REST API endpoints `/api/leads`, `/api/deals`, `/api/invoices`.

### 2.2 ERPNext 16.52.1 & Frappe (GNU GPL v3)
- **Extracted Location**: `erpnext-16.52.1/erpnext-16.52.1/erpnext/`
- **Key Reference Modules**:
  - `accounts/doctype/gl_entry/gl_entry.py`: Double-entry validation ($\sum \text{Debit} = \sum \text{Credit}$).
  - `stock/doctype/stock_ledger_entry/stock_ledger_entry.py`: Immutable stock ledger architecture.
  - `buying/doctype/purchase_order/purchase_order.py`: Procurement PO lifecycle.
  - `selling/doctype/sales_order/sales_order.py`: Sales order fulfillment tracking.
- **Target ERP Implementation**:
  - **Double-Entry Financial Invariant**:
    - `variant-b-php-mysql/src/Services/AccountingService.php`: Enforces zero-tolerance variance between debit and credit sums before committing `gl_entries`.
    - `variant-a-supabase/supabase/migrations/20261027000001_initial_schema.sql`: Table `gl_entries` with foreign keys to `chart_of_accounts` and transactional integrity.
  - **Immutable Stock Ledger**:
    - `variant-b-php-mysql/src/Services/InventoryService.php`: Appends to `stock_ledger_entries` for all stock receipts, issues, and transfers; calculates physical balance dynamically.
    - `variant-a-supabase/src/pages/InventoryDashboard.tsx`: Interactive stock receipts (+10) and dispatches (-5) maintaining stock ledger records.

### 2.3 IceHrm 36.0.1 (Elastic License 2.0)
- **Extracted Location**: `icehrm-36.0.1/icehrm-36.0.1/`
- **Key Reference Modules**:
  - `app/modules/leave/`: Leave entitlement calculation, leave requests, manager approval flows.
  - `app/modules/attendance/`: Clock-in/clock-out timestamps, employee daily logs.
- **Target ERP Implementation (Clean-room re-implementation)**:
  - **Leave Approval State Machine**:
    - `variant-b-php-mysql/src/Services/HrmService.php`: Method `approveLeaveRequest($requestId, $approverId)` executes atomic balance deduction:
      $$\text{new\_balance} = \text{leave\_balance} - \text{leave\_days}$$
    - `variant-a-supabase/src/pages/HrmDashboard.tsx`: Single-click "Approve Leave" action immediately updating employee leave balance and record status.
  - **Attendance Logging**:
    - `variant-a-supabase/src/lib/supabase.ts`: Method `recordAttendance()` logging check-in time and status (`Present`, `Late`, `Remote`).

### 2.4 HRMS 16.52.0 (Frappe HRMS, GNU GPL v3)
- **Extracted Location**: `hrms-16.52.0/hrms-16.52.0/hrms/`
- **Key Reference Modules**:
  - `payroll/doctype/salary_structure/salary_structure.py`
  - `payroll/doctype/payroll_entry/payroll_entry.py`: Bulk payroll processing.
- **Target ERP Implementation**:
  - **Payroll Operations**:
    - `variant-a-supabase/src/pages/HrmDashboard.tsx`: "Run Payroll" action processing monthly compensation ($1,248K) and generating employee payslips.
    - `variant-b-php-mysql/src/Services/HrmService.php`: Service method executing payroll calculations and posting corresponding salary expenses to general ledger.

### 2.5 EspoCRM 10.0.11 (GNU GPL v3)
- **Extracted Location**: `espocrm-10.0.11/espocrm-10.0.11/`
- **Key Reference Modules**:
  - `application/Espo/Core/Acl/`: Granular role-based permissions matrix.
  - `application/Espo/Modules/Crm/Entities/Case.php`: Customer support ticket lifecycle and SLA management.
- **Target ERP Implementation**:
  - **Support Dashboard & Tickets**:
    - `src/pages/SupportDashboard.tsx`: Ticket volume tracking, SLA compliance %, and ticket table with priority badges.
  - **Audit Logging**:
    - `audit_logs` table recording `action`, `entity_type`, `entity_id`, `actor_id`, and `metadata` on all state changes.

### 2.6 Frappe CRM 1.89.2 (GNU GPL v3)
- **Extracted Location**: `crm-1.89.2/crm-1.89.2/`
- **Key Reference Modules**:
  - `frontend/src/views/Deal.vue`: Modern deal overview, chevron stage pipeline.
  - `frontend/src/components/ActivityTimeline.vue`: Date-grouped activity timeline.
- **Target ERP Implementation**:
  - Re-implemented in React 19 / TypeScript in `variant-a-supabase/src/pages/DealsPage.tsx` and `variant-a-supabase/src/components/crm/DealPipeline.tsx` to match the exact visual specification of `08_Deals_Activities.jpg`.

---

## 3. Summary of Source Reuse Compliance
1. No copyrighted code strings or third-party proprietary trade secrets are imported into production binaries.
2. All architectural patterns are adapted into modern idiomatic TypeScript/React and clean PHP 8.5+.
3. Dual-stack implementations maintain absolute operational independence.
