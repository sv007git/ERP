# Dreams ERP - Start Variant B Application Server (PHP Built-in Server on Port 8000)
$ErrorActionPreference = "Stop"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " STARTING VARIANT B (PHP WEB SERVER ON PORT 8000)" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

$variantDir = Join-Path $PSScriptRoot "..\variant-b-php-mysql"
$phpExe = Join-Path $PSScriptRoot "..\tools\php\php.exe"

if (-not (Test-Path $phpExe)) {
    $phpExe = "php"
}

Set-Location $variantDir

Write-Host "Opening Dreams ERP in default browser..." -ForegroundColor Yellow
Start-Process "http://localhost:8000"

Write-Host "Serving from $variantDir\public at http://localhost:8000..." -ForegroundColor Green
& $phpExe -S 127.0.0.1:8000 -t public
