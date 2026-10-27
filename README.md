# Dreams ERP - Dual-Stack Enterprise Business Platform

A production-grade, dual-stack ERP and CRM platform built and maintained on Windows. Faithfully implements the **Dreams ERP** design system (`02_CRM_Dashboard.jpg` through `09_Projects.jpg`) with two independently runnable architectures:

- **Variant A (`variant-a-supabase/`)**: Modern TypeScript / React 19 web frontend with Supabase backend (PostgreSQL 15+, Supabase Auth, Row Level Security, and Storage).
- **Variant B (`variant-b-php-mysql/`)**: Modular PHP 8.5+ monolith with MySQL / MariaDB / SQLite, service-layer architecture, deterministic migrations, and double-entry general ledger.

---

## 1. Project Directory Structure

```
ERP/
├── references/                      # Existing reference materials & UI assets
│   ├── 02_CRM_Dashboard.jpg         # CRM & Sales Dashboard reference
│   ├── 03_HRM_Dashboard.jpg         # HRMS Workforce & Attendance reference
│   ├── 04_Inventory_Dashboard.jpg   # Inventory, Products & Stock reference
│   ├── 05_Procurement_Dashboard.jpg # Purchasing & PO reference
│   ├── 07_Sales_Dashboard.jpg       # Invoicing & Revenue reference
│   ├── 08_Deals_Activities.jpg      # Chevron Pipeline & Activity Timeline
│   └── 09_Projects.jpg              # Project Cards & Progress reference
│
├── shared-specifications/           # Single source of truth specifications
│   ├── REFERENCE_ANALYSIS.md        # Deep dive into the 6 open-source repos
│   ├── PRODUCT_REQUIREMENTS.md      # Functional & non-functional requirements
│   ├── ARCHITECTURE.md              # System architecture & invariants
│   ├── DATABASE_DICTIONARY.md       # Tables, columns, constraints & indexes
│   ├── ROLE_PERMISSION_MATRIX.md    # RBAC & granular permissions
│   ├── API_CONTRACTS.md             # Standard RESTful API endpoints
│   ├── DESIGN_SYSTEM.md             # Dreams ERP tokens, styles & layouts
│   ├── FEATURE_PARITY.md            # Parity mapping & acceptance criteria
│   └── DECISIONS.md                 # Architectural Decision Records (ADRs)
│
├── variant-a-supabase/              # Variant A: React + Supabase Implementation
│   ├── src/                         # TypeScript React application
│   │   ├── components/              # Layout, Header, Sidebar, DealPipeline
│   │   ├── pages/                   # CRM, Deals, HRM, Inventory, Finance
│   │   ├── lib/supabase.ts          # Supabase client + local fallback store
│   │   └── types/database.ts        # TypeScript entity types
│   ├── supabase/migrations/         # Sequential PostgreSQL migrations & RLS
│   ├── .github/workflows/ci.yml     # Automated lint, build & test CI
│   ├── package.json
│   └── vite.config.ts
│
├── variant-b-php-mysql/             # Variant B: PHP + MySQL/SQLite Implementation
│   ├── config/                      # Database & application configs
│   ├── database/                    # SQL migrations & realistic seeders
│   ├── public/                      # Front controller (index.php) & assets
│   ├── src/                         # PSR-4 Core, Controllers & Services
│   │   ├── Services/                # Accounting, Inventory, HRM, CRM
│   │   └── Controllers/             # REST API & Web Controllers
│   ├── tests/                       # Automated PHP acceptance tests
│   └── composer.json
│
├── shared-tests/                    # Cross-variant acceptance test runner
│   ├── ACCEPTANCE_TEST_SUITE.md
│   └── verify_acceptance.py         # Automated cross-stack invariant verifier
│
├── scripts/                         # Windows PowerShell developer scripts
│   ├── check-prerequisites.ps1      # Validates Node, PHP, Python, Git
│   ├── setup-variant-a.ps1          # Installs npm deps & runs tests
│   ├── setup-variant-b.ps1          # Migrates, seeds & tests PHP
│   ├── start-variant-a.ps1          # Launches Vite dev server (Port 5173)
│   ├── start-variant-b.ps1          # Launches PHP web server (Port 8000)
│   ├── run-tests.ps1                # Runs all test suites across both stacks
│   ├── build-production.ps1         # Compiles production assets
│   └── check-updates.ps1            # Audits dependencies & vulnerabilities
│
├── deployment/                      # Production deployment documentation
│   ├── VARIANT_A_DEPLOYMENT.md      # Vercel / Cloudflare / Supabase deployment
│   ├── VARIANT_B_DEPLOYMENT.md      # Linux Nginx / Windows IIS deployment
│   └── SECURITY_AND_PATCHING.md     # Rapid security patching workflow
│
├── tools/                           # Portable zero-admin Windows runtimes
│   └── php/                         # Portable PHP 8.5.12 + Composer 2.10.3
│
└── README.md                        # Master project guide
```

---

## 2. Quick Start on Windows (PowerShell)

### Step 1: Check Prerequisites
Validate available developer tools on your machine:
```powershell
.\scripts\check-prerequisites.ps1
```
*Note: The project bundles a portable zero-admin Windows PHP runtime in `tools\php`, so PHP and Composer work instantly with zero configuration.*

### Step 2: Set Up Both Applications
```powershell
# Set up Variant A (React / TypeScript / Supabase client)
.\scripts\setup-variant-a.ps1

# Set up Variant B (PHP / Migrations / Seeders)
.\scripts\setup-variant-b.ps1
```

### Step 3: Run All Automated Acceptance Tests
```powershell
.\scripts\run-tests.ps1
```
Executes:
1. Variant B PHP Acceptance Suite (11 tests: Sales-to-Cash, Procure-to-Stock, Leave Approval, Pipeline Chevrons).
2. Variant A Vitest Unit Suite (6 tests: Deals, Leads, Stock adjustments, Payments).
3. Cross-Variant Invariant Verifier (General Ledger Balance $\sum \text{Debit} == \sum \text{Credit}$, Stock Ledger trace).

### Step 4: Start Development Servers
In separate PowerShell terminals:
```powershell
# Start Variant A (Opens http://localhost:5173)
.\scripts\start-variant-a.ps1

# Start Variant B (Opens http://localhost:8000)
.\scripts\start-variant-b.ps1
```

### Step 5: Compile Production Artifacts
```powershell
.\scripts\build-production.ps1
```

---

## 3. Feature Parity Matrix

| Business Module | Functional Capabilities | Variant A (Supabase) | Variant B (PHP) | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Platform Foundation** | Multi-tenant org scoping, authentication, user profiles, audit logs | ✅ (RLS) | ✅ (Session/DB) | Complete |
| **CRM & Pipeline** | Chevron stages, probability calculation, deal values, activity stream | ✅ | ✅ | Complete |
| **HRMS** | Employee directory, attendance clock-in, leave approval & balance deduction | ✅ | ✅ | Complete |
| **Finance & Accounting**| Chart of accounts, double-entry GL ledger, invoice settlement, payment GL | ✅ | ✅ | Complete |
| **Inventory & Stock** | Products catalog, warehouse utilization, immutable stock ledger movements | ✅ | ✅ | Complete |
| **Dreams ERP UI** | 4-card KPI row, collapsible sidebar, status pills, responsive design | ✅ | ✅ | Complete |

---

## 4. Open-Source Reference Repositories Inspected

1. **crm-1.89.2** (Frappe CRM - AGPLv3): Inspected for deal pipeline chevrons, activity streams, and lead sources.
2. **erpnext-16.52.1** (ERPNext - GPLv3): Inspected for double-entry GL ledger posting, immutable stock ledger, and CoA hierarchy.
3. **espocrm-10.0.11** (EspoCRM - AGPLv3): Inspected for PHP service-layer architecture and granular record-level RBAC.
4. **hrms-16.52.0** (Frappe HRMS - GPLv3): Inspected for leave application state machines and attendance tracking.
5. **icehrm-36.0.1** (IceHrm - Elastic License 2.0): Inspected strictly for HR domain workflows with zero code copied (clean-room isolation).
6. **idurar-erp-crm-4.1.1** (Idurar - AGPLv3): Inspected for invoice status transitions and decimal monetary precision.

*See `shared-specifications/REFERENCE_ANALYSIS.md` for the full technical analysis and compliance report.*

---

## 5. Security & Invariant Guarantee

1. **Double-Entry Financial Invariant**:
   Posted transactions in both variants guarantee $\sum \text{Debit} = \sum \text{Credit}$. Unbalanced transactions are rejected.
2. **Multi-Tenant Isolation**:
   - Variant A enforces isolation at the PostgreSQL database engine level using Row Level Security (`user_belongs_to_org(organization_id)`).
   - Variant B automatically scopes all repository queries by the active authenticated `organization_id`.
3. **Secret Isolation**:
   - Client code in Variant A never contains the Supabase Service Role key.
   - Production settings in Variant B disable debug mode and enforce secure cookies.
