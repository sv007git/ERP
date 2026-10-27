# Architectural Decision Records (ADRs)

**Document:** `shared-specifications/DECISIONS.md`  
**System:** Dreams ERP / CRM Dual-Stack Platform  

---

### ADR-001: Dual-Stack Implementation Architecture
- **Context**: The platform requires two independently runnable implementations: a modern web frontend backed by Supabase (Variant A), and an independent PHP + MySQL/MariaDB backend (Variant B).
- **Decision**: Develop shared specification files in `shared-specifications/` to serve as the single source of truth for both stacks. Variant A uses React 19 + TypeScript + Vite + Tailwind CSS with Supabase PostgreSQL and RLS. Variant B uses modern PHP 8.5+ with a modular service monolith architecture.
- **Consequences**: Ensures 100% domain and behavioral parity while allowing each stack to leverage its ecosystem strengths.

---

### ADR-002: Dreams ERP Visual Reference Alignment
- **Context**: The workspace contains detailed reference screenshots (`02_CRM_Dashboard.jpg` through `09_Projects.jpg`) showing a unified, high-density business UI named "Dreams ERP".
- **Decision**: Adopt the exact layout, color tokens (Emerald primary, 4-card KPI row with orange/purple/bronze/pink accents, deal chevrons, rounded white cards), and navigation hierarchy from the reference screenshots.
- **Consequences**: Delivers a cohesive, professional user experience that matches the client's supplied visual expectations.

---

### ADR-003: Multi-Tenancy Isolation Strategy
- **Context**: Both variants must prevent any cross-tenant data leakage.
- **Decision**:
  - In **Variant A**, PostgreSQL Row Level Security (RLS) is applied to all tenant-scoped tables, strictly filtering by `organization_id IN (SELECT organization_id FROM memberships WHERE user_id = auth.uid())`.
  - In **Variant B**, repository-level query scoping is automatically enforced through authenticated session context, appending `WHERE organization_id = :org_id` on all operations.
- **Consequences**: Guarantees tenant isolation at the deepest persistence layer in both implementations.

---

### ADR-004: Double-Entry Financial & Inventory Ledgers
- **Context**: Financial transactions and stock movements must be auditable, tamper-resistant, and mathematically verifiable.
- **Decision**: Implement immutable `gl_entries` for general ledger accounting (requiring $\sum \text{Debit} = \sum \text{Credit}$) and immutable `stock_ledger_entries` for physical inventory adjustments. Posted records cannot be updated; corrections require explicit reversal documents.
- **Consequences**: Eliminates silent data corruption and satisfies standard accounting audit requirements.

---

### ADR-005: Zero-Admin Windows Portable Developer Experience
- **Context**: The Windows host environment lacks administrative privileges for MSI / system-wide package installers (e.g. winget failed with exit code 50 requiring admin elevation for VC++ runtime).
- **Decision**: Provide self-contained portable runtimes in `tools/` with portable PHP 8.5.12, local VC runtime DLLs extracted from compatible applications, `composer.bat` wrapper, and support for SQLite in local development alongside standard MySQL configuration for production.
- **Consequences**: Developers can run, test, and update the application immediately on any Windows machine without requiring elevation or external service dependencies.

---

### ADR-006: Third-Party License Compliance & Clean-Room Isolation
- **Context**: The workspace contains reference repositories under diverse licenses (GPLv3, AGPLv3, and Elastic License 2.0).
- **Decision**: Reference repositories are used exclusively for architectural study and domain workflow analysis. No source code or assets are copied. All code in `variant-a-supabase/` and `variant-b-php-mysql/` is original, clean-room implementation.
- **Consequences**: Complete license compliance and zero legal risk for commercial deployment.
