# Quick deployment test script - Windows PowerShell
# Run locally before deploying to Render

Write-Host "🧪 AQI Project - Local Deployment Test" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "✓ Checking prerequisites..." -ForegroundColor Green

$pythonExists = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonExists) {
    Write-Host "❌ Python not found. Install Python 3.11+" -ForegroundColor Red
    exit 1
}

$nodeExists = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeExists) {
    Write-Host "❌ Node.js not found. Install Node.js 14+" -ForegroundColor Red
    exit 1
}

$dockerExists = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerExists) {
    Write-Host "⚠️  Docker not found. Docker testing will be skipped." -ForegroundColor Yellow
}

Write-Host "✓ Python: $(python --version)" -ForegroundColor DarkGreen
Write-Host "✓ Node.js: $(node --version)" -ForegroundColor DarkGreen
Write-Host ""

# Setup Backend
Write-Host "🔧 Setting up Backend..." -ForegroundColor Cyan
Push-Location backend

if (-not (Test-Path "venv")) {
    Write-Host "  Creating virtual environment..." -ForegroundColor Gray
    python -m venv venv
}

Write-Host "  Activating virtual environment..." -ForegroundColor Gray
& ".\venv\Scripts\Activate.ps1"

Write-Host "  Installing dependencies..." -ForegroundColor Gray
pip install -r requirements.txt -q

Write-Host "✓ Backend setup complete" -ForegroundColor DarkGreen
Write-Host ""

# Setup Frontend
Write-Host "🔧 Setting up Frontend..." -ForegroundColor Cyan
Pop-Location
Push-Location frontend

if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing npm dependencies..." -ForegroundColor Gray
    npm install -q
}

Write-Host "✓ Frontend setup complete" -ForegroundColor DarkGreen
Write-Host ""

# Build Frontend
Write-Host "🔨 Building Frontend..." -ForegroundColor Cyan
npm run build > $null 2>&1

if (Test-Path "build") {
    $buildSize = (Get-ChildItem -Recurse -Path "build" | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "✓ Frontend production build successful" -ForegroundColor DarkGreen
    Write-Host "  Build size: $([Math]::Round($buildSize, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
}

Pop-Location
Write-Host ""

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ Local deployment test complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Push code to GitHub"
Write-Host "2. Create Render account at render.com"
Write-Host "3. Follow DEPLOYMENT_GUIDE.md for cloud deployment"
Write-Host ""
