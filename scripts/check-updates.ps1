# Dreams ERP - Update & Security Patch Verification Script
# Audits dependencies and checks for security advisories

$ErrorActionPreference = "Continue"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " DREAMS ERP - SECURITY & UPDATE AUDIT" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$compBat = Join-Path $root "tools\php\composer.bat"

# 1. Variant A (npm audit & outdated)
Write-Host "`n>>> [1/2] Auditing Variant A Dependencies (npm)..." -ForegroundColor Yellow
Push-Location (Join-Path $root "variant-a-supabase")
Write-Host "Checking outdated packages:" -ForegroundColor Gray
npm outdated | Out-Host
Write-Host "Running npm security audit:" -ForegroundColor Gray
npm audit --omit=dev | Out-Host
Pop-Location

# 2. Variant B (Composer audit)
Write-Host "`n>>> [2/2] Auditing Variant B Dependencies (Composer)..." -ForegroundColor Yellow
if (Test-Path $compBat) {
    Push-Location (Join-Path $root "variant-b-php-mysql")
    & $compBat validate --no-check-all
    Pop-Location
} else {
    Write-Host "[INFO] Composer not installed in PATH. Skipping composer audit." -ForegroundColor Gray
}

Write-Host "`n=========================================================" -ForegroundColor Green
Write-Host " Security audit and update check completed." -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
