# Dreams ERP - Master Test Runner Script
# Runs all acceptance and unit test suites across Variant A and Variant B

$ErrorActionPreference = "Stop"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " RUNNING ALL DREAMS ERP ACCEPTANCE TEST SUITES" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$phpExe = Join-Path $root "tools\php\php.exe"
if (-not (Test-Path $phpExe)) {
    $phpExe = "php"
}

# 1. Variant B Tests
Write-Host "`n>>> [1/3] Running Variant B PHP Acceptance Tests..." -ForegroundColor Yellow
& $phpExe (Join-Path $root "variant-b-php-mysql\tests\run_tests.php")
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Variant B tests failed!" -ForegroundColor Red
    exit 1
}

# 2. Variant A Tests
Write-Host "`n>>> [2/3] Running Variant A Vitest Unit Tests..." -ForegroundColor Yellow
Push-Location (Join-Path $root "variant-a-supabase")
npm run test
$varAExit = $LASTEXITCODE
Pop-Location

if ($varAExit -ne 0) {
    Write-Host "[FAIL] Variant A tests failed!" -ForegroundColor Red
    exit 1
}

# 3. Cross-Variant Invariant Verification
Write-Host "`n>>> [3/3] Running Cross-Variant Acceptance Verification..." -ForegroundColor Yellow
python (Join-Path $root "shared-tests\verify_acceptance.py")
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Cross-variant verification failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=========================================================" -ForegroundColor Green
Write-Host " ALL TEST SUITES PASSED WITH ZERO FAILURES!" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
