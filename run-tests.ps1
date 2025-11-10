# Run all tests
Write-Host "🧪 Running all tests..." -ForegroundColor Cyan

# Change to backend directory
Set-Location backend

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Run tests
Write-Host "`n🚀 Running unit and integration tests..." -ForegroundColor Green
npm test

# Run tests with coverage
Write-Host "`n📊 Generating coverage report..." -ForegroundColor Green
npm run test:coverage

Write-Host "`n✅ Tests completed!" -ForegroundColor Green
Write-Host "📄 Coverage report available in: backend/coverage/index.html" -ForegroundColor Cyan

# Return to root directory
Set-Location ..
