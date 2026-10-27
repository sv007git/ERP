# Dreams ERP - Variant A Setup Script (Frontend + Supabase)
$ErrorActionPreference = "Stop"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " SETTING UP VARIANT A (SUPABASE + REACT TS)" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

$variantDir = Join-Path $PSScriptRoot "..\variant-a-supabase"
Set-Location $variantDir

# Initialize .env if missing
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "[OK] Created .env from .env.example" -ForegroundColor Green
}

Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Running TypeScript validation..." -ForegroundColor Yellow
npx tsc --noEmit

Write-Host "Running Vitest unit tests..." -ForegroundColor Yellow
npm run test

Write-Host "=========================================================" -ForegroundColor Green
Write-Host " Variant A setup completed successfully!" -ForegroundColor Green
Write-Host " Start development server with: .\scripts\start-variant-a.ps1" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
