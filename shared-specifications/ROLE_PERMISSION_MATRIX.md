# Role & Permission Matrix

**System:** ERP / CRM Dual-Stack Platform  
**Document:** `shared-specifications/ROLE_PERMISSION_MATRIX.md`  
**Security Model:** Mandatory Multi-Tenant Role-Based Access Control (RBAC)  

---

## 1. Standard Enterprise Roles

1. **Super Admin**: Complete platform visibility, organization provisioning, cross-module configuration.
2. **Organization Admin**: Full administrative authority over their tenant (`organization_id`), users, roles, settings, and company profile.
3. **Sales Manager**: Complete authority over CRM leads, deals, opportunities, quotes, sales orders, and pipeline analytics. Can view and reassign team deals.
4. **Sales Representative**: Personal lead and opportunity management. Can create contacts, log activities, advance their own deals, and view catalog pricing. Cannot delete deals or access HR/Accounting.
5. **HR Manager**: Authority over employee directory, department hierarchy, attendance management, leave approvals, salary configurations, and monthly payroll runs.
6. **Employee**: Self-service access: View own profile, submit leave applications, view personal attendance logs, and download monthly payslips.
7. **Accountant / Finance Manager**: Full authority over Chart of Accounts, General Ledger, journal entries, invoice finalization, bill settlements, tax definitions, and financial reporting.
8. **Inventory & Purchasing Manager**: Authority over catalog, warehouses, stock adjustments, purchase orders, goods receipts, and vendor management.

---

## 2. Granular Permissions Matrix

| Entity / Action | Super Admin | Org Admin | Sales Mgr | Sales Rep | HR Mgr | Employee | Accountant | Inv Mgr |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Organization & Settings** |
| `manage_organization` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `manage_users` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `view_audit_logs` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **CRM & Sales** |
| `leads:view_all` | ✅ | ✅ | ✅ | ❌ (Own) | ❌ | ❌ | ❌ | ❌ |
| `leads:create_edit` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `deals:pipeline` | ✅ | ✅ | ✅ | ✅ (Own) | ❌ | ❌ | ❌ | ❌ |
| `deals:advance_stage` | ✅ | ✅ | ✅ | ✅ (Own) | ❌ | ❌ | ❌ | ❌ |
| `quotes:create` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **HRMS** |
| `employees:view_all` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ (Read) | ❌ |
| `employees:manage` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `attendance:view_all` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `attendance:clock_self` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `leave:apply_self` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `leave:approve` | ✅ | ✅ | ✅ (Team) | ❌ | ✅ | ❌ | ❌ | ❌ |
| `payroll:process` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| `payslip:view_self` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Finance & Accounting** |
| `chart_of_accounts:manage` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| `journal_entries:post` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| `invoices:create` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `invoices:cancel_reverse` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| `payments:record` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| `financial_reports:view` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Inventory & Purchasing** |
| `products:manage` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `stock:view` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| `stock:adjust` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `purchase_orders:create` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `goods_receipt:receive` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. Scope Levels

- **Global (`all`)**: Accessible across all records within the authenticated organization.
- **Team / Department (`team`)**: Accessible to records belonging to the user's branch or department.
- **Personal (`own`)**: Accessible only to records where `owner_id == current_user.id` or `employee_id == current_user.employee_id`.
- **None (`no`)**: Forbidden. Attempting access results in HTTP `403 Forbidden` and an audit security event.
