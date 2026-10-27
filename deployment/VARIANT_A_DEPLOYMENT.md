# Variant A Production Deployment Guide
## Modern Web Frontend + Supabase Backend

**Document:** `deployment/VARIANT_A_DEPLOYMENT.md`  
**Stack:** React 19 + TypeScript + Vite + Tailwind CSS + Supabase (PostgreSQL, Auth, RLS, Storage)

---

## 1. Supabase Backend Setup

### 1.1 Project Provisioning
1. Log in to [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. Choose your nearest geographical region and set a strong database password.
3. Save the **Project URL** and **Anon Public API Key** from **Project Settings -> API**.

### 1.2 Running Database Migrations
Apply the sequential migrations located in `variant-a-supabase/supabase/migrations/`:
- `20261027000001_initial_schema.sql` (Creates all tables, foreign keys, and indexes)
- `20261027000002_rls_policies.sql` (Enables Row Level Security and tenant isolation policies)
- `20261027000003_seed_data.sql` (Seeds initial organizations, roles, and catalog items)

**Via Supabase CLI:**
```powershell
supabase login
supabase link --project-ref your-project-id
supabase db push
```
**Via Supabase SQL Editor:**
Copy and paste each `.sql` file in order into the web SQL editor and execute.

### 1.3 Authentication Configuration
1. In **Authentication -> URL Configuration**, set **Site URL** to your production domain: `https://erp.yourdomain.com`.
2. Add your local and preview URLs to **Redirect URLs**: `http://localhost:5173/**`.
3. Disable public signups if only organizational invitations are permitted.

---

## 2. Frontend Hosting Options

### Option A: Vercel / Netlify / Cloudflare Pages (Recommended)
1. Push your repository to GitHub.
2. In the hosting provider, set:
   - **Root Directory**: `variant-a-supabase`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variables:
   - `VITE_SUPABASE_URL`: `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOi...`
   - `VITE_ORGANIZATION_ID`: `00000000-0000-0000-0000-000000000001`
   - `VITE_ORGANIZATION_NAME`: `Falcon LLP`

### Option B: Windows Server (IIS)
1. Build production assets: `npm run build` (outputs to `dist/`).
2. Copy `dist/` contents to `C:\inetpub\wwwroot\dreams-erp`.
3. Install IIS **URL Rewrite** module and add `web.config`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="SPA Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".webp" mimeType="image/webp" />
    </staticContent>
  </system.webServer>
</configuration>
```

---

## 3. Security & Operational Checklist

- [ ] **Zero Service-Role Exposure**: Verify that `SUPABASE_SERVICE_ROLE_KEY` is nowhere present in the client code or `.env`.
- [ ] **Row Level Security**: Execute query test to confirm unauthenticated requests cannot query `leads` or `invoices`.
- [ ] **HTTPS / TLS 1.3**: Enforced across all domains.
- [ ] **Automated Backups**: Enable Supabase Point-in-Time Recovery (PITR) in project settings.
