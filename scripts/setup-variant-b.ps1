# Dreams ERP - Variant B Setup Script (PHP + MySQL/MariaDB/SQLite)
$ErrorActionPreference = "Stop"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " SETTING UP VARIANT B (PHP + MYSQL / SQLITE)" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

$variantDir = Join-Path $PSScriptRoot "..\variant-b-php-mysql"
$phpExe = Join-Path $PSScriptRoot "..\tools\php\php.exe"

if (-not (Test-Path $phpExe)) {
    $phpExe = "php"
}

Set-Location $variantDir

# Initialize .env if missing
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "[OK] Created .env from .env.example" -ForegroundColor Green
}

Write-Host "Running database migrations..." -ForegroundColor Yellow
& $phpExe "database/migrate.php"

Write-Host "Seeding development database..." -ForegroundColor Yellow
& $phpExe "database/seed.php"

Write-Host "Executing automated acceptance test suite..." -ForegroundColor Yellow
& $phpExe "tests/run_tests.php"

Write-Host "=========================================================" -ForegroundColor Green
Write-Host " Variant B setup completed successfully!" -ForegroundColor Green
Write-Host " Start application server with: .\scripts\start-variant-b.ps1" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
