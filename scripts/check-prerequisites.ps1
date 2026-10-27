# Dreams ERP - Prerequisites Verification Script
# Validates Node.js, PHP, Composer, Python, and Git on Windows

$ErrorActionPreference = "Continue"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " DREAMS ERP - PREREQUISITES CHECK (WINDOWS)" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

$toolsDir = Join-Path $PSScriptRoot "..\tools\php"
$portablePhp = Join-Path $toolsDir "php.exe"
$portableComposer = Join-Path $toolsDir "composer.bat"

# 1. Node.js
try {
    $nodeVer = & node --version 2>&1
    Write-Host "[OK] Node.js: FOUND ($nodeVer)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Node.js: NOT FOUND. Required for Variant A." -ForegroundColor Red
}

# 2. npm
try {
    $npmVer = & npm --version 2>&1
    Write-Host "[OK] npm: FOUND ($npmVer)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] npm: NOT FOUND." -ForegroundColor Red
}

# 3. PHP
if (Test-Path $portablePhp) {
    $phpVer = & $portablePhp --version | Select-Object -First 1
    Write-Host "[OK] PHP: FOUND (Portable Windows Runtime at $portablePhp)" -ForegroundColor Green
    Write-Host "     Version: $phpVer" -ForegroundColor Gray
} else {
    try {
        $phpVer = & php --version 2>&1 | Select-Object -First 1
        Write-Host "[OK] PHP: FOUND in PATH ($phpVer)" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] PHP: NOT FOUND. Run scripts/setup-variant-b.ps1." -ForegroundColor Red
    }
}

# 4. Composer
if (Test-Path $portableComposer) {
    $compVer = & $portableComposer --version 2>&1 | Select-Object -First 1
    Write-Host "[OK] Composer: FOUND (Portable at $portableComposer)" -ForegroundColor Green
    Write-Host "     Version: $compVer" -ForegroundColor Gray
} else {
    try {
        $compVer = & composer --version 2>&1 | Select-Object -First 1
        Write-Host "[OK] Composer: FOUND in PATH ($compVer)" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] Composer: NOT FOUND." -ForegroundColor Red
    }
}

# 5. Python
try {
    $pyVer = & python --version 2>&1
    Write-Host "[OK] Python: FOUND ($pyVer)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Python: NOT FOUND." -ForegroundColor Red
}

# 6. Git
try {
    $gitVer = & git --version 2>&1
    Write-Host "[OK] Git: FOUND ($gitVer)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Git: NOT FOUND." -ForegroundColor Red
}

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " Prerequisites check completed." -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
