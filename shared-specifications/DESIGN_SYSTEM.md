# Dreams ERP Design System Specification

**Document:** `shared-specifications/DESIGN_SYSTEM.md`  
**Visual Foundation:** Sourced directly from workspace UI references (`02_CRM_Dashboard.jpg` through `09_Projects.jpg`)  
**Design Philosophy:** Clean, high-density, accessible, desktop-first enterprise ERP/CRM interface.

---

## 1. Color Palette & Semantic Tokens

### 1.1 Base & Surface Colors
- **Canvas / Background**: `#f8fafc` (Tailwind `slate-50`)
- **Card / Surface**: `#ffffff` (Pure White) with subtle border `#f1f5f9` (`slate-100`) and shadow `0 1px 3px 0 rgb(0 0 0 / 0.05)`
- **Header TopNav**: `#ffffff` with bottom border `#e2e8f0` (`slate-200`)
- **Left Sidebar Navigation**: `#0f172a` (`slate-900`) in dark mode, or `#ffffff` with active menu item `#f1f5f9`
- **Text Primary**: `#0f172a` (`slate-900`)
- **Text Secondary / Muted**: `#64748b` (`slate-500`)
- **Text Inverted**: `#ffffff`

### 1.2 Accent & KPI Colors
As evidenced in `02_CRM_Dashboard.jpg` and `04_Inventory_Dashboard.jpg`:
- **Primary Brand / Emerald**: `#10b981` (`emerald-500`), hover `#059669` (`emerald-600`)
- **Leads / Warning Orange**: `#f97316` (`orange-500`)
- **Deals Closed / Deep Purple**: `#8b5cf6` (`purple-500`)
- **Opportunities / Bronze Gold**: `#d97706` (`amber-600`)
- **Revenue / Magenta Pink**: `#ec4899` (`pink-500`)
- **Inventory / Cyan Blue**: `#0ea5e9` (`sky-500`)

### 1.3 Semantic Status Badges
Soft tinted backgrounds with solid border and dark readable text:
- **Won / Active / Delivered / Paid / In Stock**:
  - Class: `bg-emerald-50 text-emerald-700 border border-emerald-200`
- **Pending / In Transit / Qualify**:
  - Class: `bg-amber-50 text-amber-700 border border-amber-200`
- **Lost / Expired / Inactive / Out of Stock / Failed**:
  - Class: `bg-rose-50 text-rose-700 border border-rose-200`
- **Info / Contacted / Presentation**:
  - Class: `bg-sky-50 text-sky-700 border border-sky-200`

---

## 2. Typography & Spacing

- **Font Family**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Scale**:
  - Page Title: `text-xl font-bold text-slate-900`
  - Section Title: `text-base font-semibold text-slate-800`
  - Stat KPI Value: `text-2xl font-bold tracking-tight text-slate-900`
  - Table Header: `text-xs font-semibold uppercase tracking-wider text-slate-500`
  - Table Body Cell: `text-sm text-slate-700`
  - Micro / Meta Text: `text-xs text-slate-400`

---

## 3. Core Component Patterns

### 3.1 Top Navigation Bar
- **Height**: 64px (`h-16`)
- **Left**: Collapsible sidebar toggle button + Organization switcher pill:
  - Example: `Falcon LLP` with dropdown chevron.
- **Center**: Global Search input with keyboard badge:
  - `Search ⌘K` or `Search Ctrl+K`
- **Right**:
  - Dark/Light mode toggle (Sun / Moon icon)
  - Notifications bell with unread badge dot
  - User profile avatar with full name ("Jamie Anderson") and role dropdown.

### 3.2 Sidebar Navigation
- **Width**: 260px (`w-64`)
- **Brand Header**: Spiral Dreams ERP logo + "Dreams ERP"
- **Group Headings**: Uppercase, small, muted (`text-xs font-bold text-slate-400 px-4 py-2 uppercase tracking-wider`)
  - **Main**: CRM Dashboard, HRM Dashboard, Inventory Dashboard, Sales Dashboard, Procurement Dashboard
  - **Inventory**: Products, Categories, Brands, Units, Suppliers, Warehouses, Stock Movement
  - **Sales**: Customers, Sales Orders, Invoices, Quotations, Payments
  - **HRM**: Employees, Departments, Attendance, Leave Requests, Payroll Slips
  - **Finance**: Chart of Accounts, Journal Entries, Expenses, Reports

### 3.3 Four-Card KPI Row
Used across all dashboards (`02_CRM_Dashboard.jpg`, `04_Inventory_Dashboard.jpg`, `05_Procurement_Dashboard.jpg`):
- White rounded container (`rounded-xl bg-white p-5 border border-slate-100 shadow-sm`)
- Top: Label (e.g., `Total Leads`) + Circular tinted icon badge on the right.
- Middle: Large monetary or count value (e.g. `$125,000` or `1,284`).
- Bottom: Trend badge (e.g., `↗ +12.4%` in green or `↘ -4.35%` in red) + subtext ("from last week").

### 3.4 Deal Pipeline Chevrons (`08_Deals_Activities.jpg`)
Horizontal interlocking chevron bar representing stages:
1. `Qualify To Buy` (Orange `#f97316`)
2. `Contact Made` (Magenta `#d946ef`)
3. `Presentation` (Brick Red `#e11d48`)
4. `Proposal Made` (Sky Blue `#0284c7`)
5. `Appointment / Won` (Slate / Emerald)

### 3.5 Tabbed Activity Timeline (`08_Deals_Activities.jpg`)
- Tabs: `Activities`, `Notes`, `Calls`, `Files`, `Email`
- Feed grouped by date badge (`Today`, `28 Sep 2025`, `27 Sep 2025`)
- Vertical dotted timeline line with rounded circular action icon badges.
