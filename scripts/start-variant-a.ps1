# Dreams ERP - Start Variant A Development Server (Vite / React)
$ErrorActionPreference = "Stop"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " STARTING VARIANT A (VITE DEV SERVER ON PORT 5173)" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

$variantDir = Join-Path $PSScriptRoot "..\variant-a-supabase"
Set-Location $variantDir

Write-Host "Opening Dreams ERP in default browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"

npm run dev
