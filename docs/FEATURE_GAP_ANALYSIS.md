# ERP Platform — Comprehensive Feature Gap Analysis

## 1. Scope & Methodology
This feature gap analysis evaluates the baseline state of the ERP application against the authoritative open-source reference implementations (IDURAR, IceHrm, HRMS, EspoCRM, ERPNext, Frappe CRM) and the visual specifications (`02` through `09_Projects.jpg` and `08_Deals_Activities.jpg`).

For each functional domain, this document defines:
- **Reference Source**: The codebase or visual artifact informing the architecture.
- **Baseline State**: The previous implementation status.
- **Required Implementation**: The exact functional capability required to reach production readiness.
- **Target Technology Variant**: How the requirement is implemented across Variant A (Supabase/React) and Variant B (PHP/MySQL).
- **Verification Criteria**: Automated or observable tests confirming implementation.

---

## 2. Module-by-Module Feature Gap Matrix

### 2.1 CRM & Lead Management
| Feature | Reference Source | Baseline State | Required Implementation | Target Variant | Verification Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Leads & Assignment** | IDURAR 4.1.1, EspoCRM | Implemented (Modal & Table) | Lead capture with source attribution (`Organic`, `Campaign`, `Referral`), status transitions (`Contacted`, `Closed`, `Lost`). | Both A & B | Lead creation persists; status updates reflect on CRM dashboard. |
| **Contacts & Accounts** | EspoCRM 10.0.11 | Partial | Contact directory with phone, email, organization association, active/inactive toggling. | Both A & B | Recent contacts table displays real records with working search/filter. |
| **Deals Pipeline** | IDURAR, Frappe CRM | Implemented (Kanban & Chevron) | Configurable pipeline stages (`Qualify To Buy`, `Contact Made`, `Presentation`, `Proposal Made`, `Appointment`, `Won`, `Lost`). | Both A & B | Stage transition updates win probability, deal value, and pipeline distribution charts. |
| **Lead-to-Deal Conversion** | IDURAR 4.1.1 | Missing | One-click workflow converting a qualified lead into a deal and customer record. | Both A & B | Executing convert generates deal record linked to contact ID. |

### 2.2 Detailed Deal Workstation (`08_Deals_Activities.jpg`)
| Feature | Reference Source | Baseline State | Required Implementation | Target Variant | Verification Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Deal Metadata Header** | `08_Deals_Activities.jpg` | Partial | Circular avatar badge (`CR`), deal name, company, address, visibility tag (`Private`), and status dropdown (`Won ∨`). | Variant A & B | Correct header attributes rendered with instant status switching. |
| **Deal Information Panel** | `08_Deals_Activities.jpg` | Missing Details | Date Created, Win Probability %, Deal Value, Due Date, Follow Up Date, Source (`Paid Campaign`). | Variant A & B | Left-hand metadata card populated from persisted record. |
| **Deal Owner & Collaborators** | `08_Deals_Activities.jpg` | Static | Owner list with avatars, name, and `+ Add New` collaborator action. | Variant A & B | Collaborators assigned and rendered with distinct avatar badges. |
| **Tags & Priority Control** | `08_Deals_Activities.jpg` | Missing | Badges (`Collab`, `VIP`) and interactive Priority dropdown (`High`, `Medium`, `Low`). | Variant A & B | Priority changes persist and trigger audit logging. |
| **Associated Projects & Contacts** | `08_Deals_Activities.jpg` | Missing | Chips linking deal to projects (`Dreams Food`, `Craftesty`) and associated contact persons. | Variant A & B | Project links rendered and navigatable. |
| **Interactive Chevron Pipeline Bar** | `08_Deals_Activities.jpg` | Partial | 5-stage colored chevron bar (`Qualify To Buy` -> `Contact Made` -> `Presentation` -> `Proposal Made` -> `Appointment`). | Variant A & B | Clicking any chevron updates deal stage in database. |
| **Tabbed Collaboration Workstation** | `08_Deals_Activities.jpg` | Incomplete | 5 distinct operational tabs: `Activities`, `Notes`, `Calls`, `Files`, `Email`. | Variant A & B | Tab switching displays dedicated panel without full page reload. |
| **Date-Grouped Activity Timeline** | `08_Deals_Activities.jpg` | Static | Chronological timeline grouped by date (`Today`, `28 Sep 2025`, `27 Sep 2025`) with expandable items. | Variant A & B | Real activity records sorted and grouped; expandable cards with inline controls (`Reminder *`, `Task Priority *`, `Assigned to *`). |
| **Activity Creation Modal** | IDURAR, EspoCRM | Basic | Modal to log meetings, messages, calls, or notes linked directly to the deal record. | Variant A & B | Submitting adds new timeline item under current date group. |

### 2.3 Sales & Revenue Operations (`07_Sales_Dashboard.jpg`)
| Feature | Reference Source | Baseline State | Required Implementation | Target Variant | Verification Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sales Dashboard** | `07_Sales_Dashboard.jpg` | Missing | Revenue trends chart, Sales by region map, Open Invoices count, Open Orders count, New Customers count. | Variant A & B | Live metrics calculated from invoice and order tables. |
| **Sales Orders** | ERPNext 16.52.1 | Missing UI | Sales order lifecycle (`Draft` -> `Confirmed` -> `Dispatched` -> `Billed`). | Both A & B | Sales order creation updates order backlog metrics. |
| **Invoicing & PDF Preview** | IDURAR, ERPNext | Implemented (Modal & Table) | Customer invoice creation with line items, tax calculation, subtotal, and printable/downloadable preview. | Both A & B | New invoice generates valid number, saves line items, and updates accounts receivable. |
| **Payment Recording** | ERPNext 16.52.1 | Implemented | Cash/bank payment allocation against invoice balance. | Both A & B | Invoices transition to `Paid`; accounts receivable balances decrease. |
| **Credit Notes & Quotes** | ERPNext 16.52.1 | Missing UI | Sales quotation generation and credit note issuance for returns. | Both A & B | Credit notes post adjusting credit entries to AR. |

### 2.4 Inventory & Stock Operations (`04_Inventory_Dashboard.jpg`)
| Feature | Reference Source | Baseline State | Required Implementation | Target Variant | Verification Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Inventory Dashboard** | `04_Inventory_Dashboard.jpg` | Implemented | Total stock counter, inventory valuation, category distribution, stock level line chart, and warehouse meters. | Variant A & B | Metrics derived dynamically from `products` and `warehouses`. |
| **Stock Receipts & Dispatches** | ERPNext 16.52.1 | Implemented (Quick Actions) | Atomically receive incoming stock (+10) and dispatch outgoing goods (-5). | Both A & B | Creates immutable row in `stock_ledger_entries`; updates `products.quantity`. |
| **Reorder & Low-Stock Alerts** | ERPNext 16.52.1 | Partial | Automated warning banner when stock level falls below reorder point ($quantity \le reorder\_level$). | Both A & B | Products below reorder threshold trigger yellow low-stock badge. |
| **Warehouse Location Tracking** | ERPNext 16.52.1 | Partial | Capacity tracking per warehouse (`Smart Stock Hub`, `Flow Grid Storage`, `Prime Storage Solutions`). | Both A & B | Warehouse cards display real percentage utilization. |

### 2.5 Procurement & Purchasing (`05_Procurement_Dashboard.jpg`)
| Feature | Reference Source | Baseline State | Required Implementation | Target Variant | Verification Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Procurement Dashboard** | `05_Procurement_Dashboard.jpg` | Missing | Total spend metric, purchase orders count, on-time delivery rate, monthly spend trend chart, top suppliers list. | Variant A & B | Dashboard displays aggregated metrics from purchase orders. |
| **Purchase Order Workflow** | ERPNext 16.52.1 | Data Model Only | PO generation (`Draft` -> `Submitted` -> `Approved` -> `Delivered`). | Both A & B | Creating PO records supplier commitment and updates total spend. |
| **Goods Receipt & Matching** | ERPNext 16.52.1 | Data Model Only | 3-way matching between PO, Goods Receipt, and Supplier Bill. | Both A & B | Receiving goods automatically triggers inventory stock increase. |

### 2.6 Finance & General Ledger
| Feature | Reference Source | Baseline State | Required Implementation | Target Variant | Verification Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Double-Entry Invariant** | ERPNext 16.52.1 | Implemented | Enforce that for every transaction: $\sum \text{Debit} = \sum \text{Credit}$. | Both A & B | Unit tests assert zero variance between debit and credit sums. |
| **General Ledger Inspection** | ERPNext 16.52.1 | Implemented | Filterable ledger table displaying posting date, account code, debit, credit, and running balance. | Both A & B | User can view ledger entries scoped by account. |
| **Financial Statements** | ERPNext 16.52.1 | Partial | Generate dynamic Trial Balance, Profit & Loss, and Balance Sheet. | Both A & B | Financial reports balance without rounding discrepancies. |

### 2.7 Human Resources & Payroll (`03_HRM_Dashboard.jpg`)
| Feature | Reference Source | Baseline State | Required Implementation | Target Variant | Verification Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HRM Dashboard** | `03_HRM_Dashboard.jpg` | Implemented | Workforce count, on leave today, attendance rate, open positions, employee distribution donut, and payroll summary. | Variant A & B | Aggregates live employee, attendance, and leave records. |
| **Attendance & Clock In/Out** | IceHrm 36.0.1 | Implemented | Single-click employee clock-in and clock-out with geolocation/timestamp logging. | Both A & B | New attendance entry registered; workforce attendance rate recalculated. |
| **Leave Management & Approval** | IceHrm 36.0.1 | Implemented | Leave request submission and managerial approval with atomic balance deduction. | Both A & B | Approving a 3-day leave atomically decrements employee leave balance by 3.0. |
| **Payroll Processing** | HRMS 16.52.0 | Partial | "Run Payroll" action calculating gross pay, deductions, and generating printable payslips. | Both A & B | Process monthly pay action creates financial salary expenses. |

### 2.8 Projects & Task Management (`09_Projects.jpg`)
| Feature | Reference Source | Baseline State | Required Implementation | Target Variant | Verification Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Projects Overview** | `09_Projects.jpg` | Missing | Card grid displaying project code (`#PRO0020`), title, description, progress bar, team avatars, and deadline. | Variant A & B | Project cards render with progress percentages and deadline badges. |
| **Task Management** | ERPNext, IDURAR | Missing UI | Milestones, task assignment, status toggles (`In Progress`, `Completed`). | Both A & B | Tasks update project overall completion percentage. |
| **Project Creation Modal** | `09_Projects.jpg` | Missing | `+ Add New` project modal capturing client, title, budget, deadline, and assigned members. | Both A & B | Creating project persists to database and appends to grid. |

### 2.9 Customer Support & Helpdesk (`06_Support_Dashboard.jpg`)
| Feature | Reference Source | Baseline State | Required Implementation | Target Variant | Verification Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Support Dashboard** | `06_Support_Dashboard.jpg` | Missing | Ticket volume chart, SLA breaches donut, open tickets count, average response time, satisfaction rate. | Variant A & B | Aggregates open/resolved support tickets. |
| **Ticket Lifecycle Management** | EspoCRM 10.0.11 | Missing UI | All Tickets table (`#TKT0020`), customer avatar, subject, priority (`Low`, `Medium`, `High`), status (`Open`, `Pending`, `Resolved`, `Closed`). | Both A & B | Ticket status transition updates SLA compliance metrics. |
| **Create Ticket Modal** | `06_Support_Dashboard.jpg` | Missing | `+ Add Tickets` modal capturing customer, issue description, priority, and assigned technician. | Both A & B | New ticket creation appears in table and increments open tickets count. |

### 2.10 Navigation, Global Controls & Administration
| Feature | Reference Source | Baseline State | Required Implementation | Target Variant | Verification Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Full Modular Left Sidebar** | Reference Images | Simplified | Hierarchical collapsible navigation covering Main, CRM, Sales, Inventory, Procurement, Finance, HR, Projects, Support, Administration. | Variant A & B | Clicking any sidebar link routes directly to the operational module. |
| **Global Search (`⌘K`)** | Reference Images | Visual Only | Interactive global search popup filtering across leads, deals, products, employees, and invoices. | Variant A | Pressing `⌘K` or clicking search opens filterable search palette. |
| **Dark / Light Theme Toggle** | Reference Images | Visual Only | Fully functional theme switcher toggling dark and light CSS color schemes across all pages. | Variant A | Toggling icon switches root class to `dark` or `light` with persistent state. |
| **Notifications Dropdown** | Reference Images | Visual Only | Header bell icon opening dropdown of recent alerts, leave requests, and stock warnings. | Variant A | Clicking bell displays alert list with unread count badge. |
| **Multi-Tenant Org Switcher** | Architecture Spec | Static | Dropdown to switch tenant context (`Falcon LLP`, etc.) with strict tenant data isolation. | Both A & B | All queries filter by current `organization_id`. |
