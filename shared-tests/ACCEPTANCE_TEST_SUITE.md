# Shared Acceptance Test Suite Specification
## Dreams ERP / CRM Dual-Stack Platform

**Document:** `shared-tests/ACCEPTANCE_TEST_SUITE.md`  
**Purpose:** Formal acceptance test definitions mapped to both Variant A (Supabase/React) and Variant B (PHP/MySQL).

---

## 1. Test Invariants & Pass/Fail Criteria

### Scenario 1: Sales-to-Cash Cycle & Double-Entry Financial Invariant
- **Action**:
  1. Create sales invoice for $1,200.00.
  2. Verify initial GL entries posted (Debit Accounts Receivable = $1,200, Credit Sales Revenue = $1,200).
  3. Settle invoice with full payment of $1,200.00 via Bank Transfer.
  4. Verify payment GL entries posted (Debit Cash at Bank = $1,200, Credit Accounts Receivable = $1,200).
- **Pass Criteria**:
  - Invoice status transitions to `Paid`.
  - General Ledger mathematical balance: $\sum \text{Debit} - \sum \text{Credit} = 0.00$.

### Scenario 2: Procure-to-Stock & Traceable Inventory Ledger
- **Action**:
  1. Record baseline quantity of product `#PRD0020`.
  2. Receive purchase order delivery of +10 units into warehouse `#WRH0020`.
  3. Verify product stock level incremented by exactly 10 units.
  4. Verify immutable `stock_ledger_entries` record exists linking product, warehouse, unit cost, and quantity delta.
- **Pass Criteria**:
  - Final quantity == Baseline quantity + 10.
  - Stock ledger entry appended with `delta_qty = +10`.

### Scenario 3: Employee Leave Lifecycle & Atomic Balance Deduction
- **Action**:
  1. Record baseline leave balance of employee `EMP-001` (20.0 days).
  2. Submit leave request for 3 business days (`Pending`).
  3. Authorized manager approves the leave request.
- **Pass Criteria**:
  - Leave request status transitions to `Approved`.
  - Employee's remaining leave balance becomes exactly 17.0 days.

### Scenario 4: Deal Pipeline Chevron Stage Progression
- **Action**:
  1. Advance deal `#DEL0020` to stage `Won`.
- **Pass Criteria**:
  - Deal stage updated to `Won`.
  - Probability automatically synchronized to 100%.
  - Audit log entry created.

### Scenario 5: Multi-Tenant Data Isolation
- **Action**:
  1. Query tenant A (`org-falcon-llp-001`) with tenant B credentials.
- **Pass Criteria**:
  - Result is empty or HTTP `403 Forbidden` / RLS empty set. Zero cross-tenant data leakage.
