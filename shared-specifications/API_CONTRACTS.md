# Shared API Contracts Specification

**Document:** `shared-specifications/API_CONTRACTS.md`  
**Protocol:** HTTPS / JSON REST  
**Authentication:** Bearer JWT Header (`Authorization: Bearer <token>`) or Cookie Session  
**Multi-Tenant Header (Optional):** `X-Organization-Id: <uuid>` (Defaults to user's primary organization)

---

## 1. Standard Response Envelope

### 1.1 Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 142,
    "total_pages": 8
  }
}
```

### 1.2 Error Response (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `422 Unprocessable`)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The given data failed validation.",
    "details": {
      "deal_value": ["The deal_value field must be a positive number."],
      "stage": ["Invalid pipeline stage provided."]
    }
  }
}
```

---

## 2. Core API Endpoints

### 2.1 Authentication & Session
- `POST /api/v1/auth/login`
  - **Body**: `{ "email": "admin@dreams.local", "password": "..." }`
  - **Response**: `{ "success": true, "data": { "token": "...", "user": { "id": "...", "name": "Jamie Anderson", "role": "Super Admin" }, "organization": { "id": "...", "name": "Falcon LLP" } } }`
- `GET /api/v1/auth/me`
  - **Response**: Returns current user profile, organization memberships, and active permissions.

---

### 2.2 CRM & Pipeline
- `GET /api/v1/crm/dashboard`
  - **Query**: `?period=last_30_days`
  - **Response**: Returns KPI stats (Total Leads, Deals Closed, Opportunities, Revenue) and recent deals/leads.
- `GET /api/v1/crm/leads`
  - **Query**: `?page=1&per_page=20&status=Not Closed&search=Robert`
  - **Response**: Paginated list of leads with code, name, company, owner, status.
- `POST /api/v1/crm/leads`
  - **Body**: `{ "name": "Robert Cosper", "company_name": "Acme Corp", "email": "robert@acme.com", "phone": "+1-555-0100", "source": "Organic Search" }`
- `GET /api/v1/crm/deals`
  - **Query**: `?stage=Qualify To Buy`
- `GET /api/v1/crm/deals/{id}`
  - **Response**: Detailed deal object with contact information, chevrons, and activity timeline.
- `PATCH /api/v1/crm/deals/{id}/stage`
  - **Body**: `{ "stage": "Contact Made", "probability": 40 }`
  - **Response**: Updated deal object and automatically creates an audit entry.
- `POST /api/v1/crm/deals/{id}/activities`
  - **Body**: `{ "type": "meeting", "title": "Product Meeting", "description": "Review requirements with client", "priority": "High" }`

---

### 2.3 HRMS
- `GET /api/v1/hrm/dashboard`
  - **Response**: Workforce count, on leave today, attendance rate, open positions, department distribution, weekly trend.
- `GET /api/v1/hrm/employees`
  - **Query**: `?department=Engineering&status=Active`
- `POST /api/v1/hrm/employees`
  - **Body**: `{ "full_name": "Alex Thompson", "email": "alex@falcon.com", "position": "Senior Developer", "department_id": "...", "salary": 8500 }`
- `POST /api/v1/hrm/attendance/clock`
  - **Body**: `{ "status": "Present" }`
  - **Response**: Clock-in confirmation with timestamp.
- `GET /api/v1/hrm/leave-requests`
  - **Query**: `?status=Pending`
- `POST /api/v1/hrm/leave-requests`
  - **Body**: `{ "leave_type": "Annual", "start_date": "2026-11-01", "end_date": "2026-11-05", "reason": "Vacation" }`
- `POST /api/v1/hrm/leave-requests/{id}/approve`
  - **Response**: Approved status, automatically updates remaining balance.
- `POST /api/v1/hrm/payroll/process`
  - **Body**: `{ "month": "2026-03" }`
  - **Response**: Generates salary slips for all active employees.

---

### 2.4 Finance & Accounting
- `GET /api/v1/finance/chart-of-accounts`
  - **Response**: Tree hierarchy of asset, liability, equity, income, and expense accounts.
- `GET /api/v1/finance/invoices`
  - **Query**: `?status=Pending`
- `POST /api/v1/finance/invoices`
  - **Body**: 
    ```json
    {
      "customer_name": "Alexander Kenn",
      "invoice_date": "2026-09-11",
      "due_date": "2026-10-11",
      "items": [
        { "product_id": "...", "description": "iPhone 15", "quantity": 2, "unit_price": 250.00 }
      ]
    }
    ```
- `POST /api/v1/finance/payments`
  - **Body**:
    ```json
    {
      "invoice_id": "...",
      "amount": 500.00,
      "payment_method": "Bank Transfer",
      "payment_date": "2026-09-11"
    }
    ```
  - **Behavior**: Records payment, marks invoice as `Paid`, and commits balancing GL entries in one atomic transaction.
- `GET /api/v1/finance/reports/trial-balance`
- `GET /api/v1/finance/reports/profit-and-loss?from=2026-01-01&to=2026-12-31`
- `GET /api/v1/finance/reports/balance-sheet?as_of=2026-12-31`

---

### 2.5 Inventory & Purchasing
- `GET /api/v1/inventory/dashboard`
  - **Response**: Total Stock count, Inventory Value, category distribution, warehouse list with utilization %, recent stock table.
- `GET /api/v1/inventory/products`
  - **Query**: `?category=Smartphones&status=In Stock`
- `POST /api/v1/inventory/products`
  - **Body**: `{ "name": "Apple iPhone 15", "sku": "APP-PH-15", "category": "Smartphones", "brand": "Apple", "unit": "Piece", "selling_price": 250, "purchase_price": 230, "quantity": 2 }`
- `POST /api/v1/inventory/adjustments`
  - **Body**: `{ "product_id": "...", "warehouse_id": "...", "delta_qty": 5, "unit_cost": 230, "reason": "Inventory count surplus" }`
  - **Behavior**: Appends to `stock_ledger_entries`, updates product quantity.
- `POST /api/v1/inventory/purchase-orders`
  - **Body**: `{ "supplier_name": "Alpha Distributors", "category": "Raw Materials", "amount": 500.00 }`
