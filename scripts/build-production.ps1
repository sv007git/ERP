# Dreams ERP - Master Production Build Script
$ErrorActionPreference = "Stop"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " BUILDING PRODUCTION ARTIFACTS FOR BOTH VARIANTS" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$phpExe = Join-Path $root "tools\php\php.exe"
if (-not (Test-Path $phpExe)) { $phpExe = "php" }

# 1. Build Variant A (TypeScript + Vite)
Write-Host "`n>>> [1/2] Compiling Variant A Production Assets (Vite)..." -ForegroundColor Yellow
Push-Location (Join-Path $root "variant-a-supabase")
npm run build
Pop-Location
Write-Host "[OK] Variant A compiled to variant-a-supabase/dist" -ForegroundColor Green

# 2. Validate Variant B (PHP Syntax Check)
Write-Host "`n>>> [2/2] Validating Variant B Production PHP Source Code..." -ForegroundColor Yellow
$phpFiles = Get-ChildItem -Path (Join-Path $root "variant-b-php-mysql\src") -Filter "*.php" -Recurse
foreach ($file in $phpFiles) {
    $res = & $phpExe -l $file.FullName
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[FAIL] Syntax error in $($file.Name)" -ForegroundColor Red
        exit 1
    }
}
Write-Host "[OK] All $(($phpFiles | Measure-Object).Count) PHP source files passed syntax linting." -ForegroundColor Green

Write-Host "`n=========================================================" -ForegroundColor Green
Write-Host " PRODUCTION BUILD SUCCEEDED FOR BOTH VARIANTS!" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
