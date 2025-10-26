param(
    [switch]$Fix
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AI Scrum Master Environment Validator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendEnvPath = "backend\.env"
$frontendEnvPath = "frontend\frontend\.env.local"

Write-Host "Checking backend environment..." -ForegroundColor Yellow
if (Test-Path $backendEnvPath) {
    Write-Host "✅ backend/.env found" -ForegroundColor Green
    Write-Host ""

    Write-Host "🔍 Checking required environment variables:" -ForegroundColor Yellow

    $envContent = Get-Content $backendEnvPath -Raw

    # Check OpenAI API Key
    if ($envContent -match "OPENAI_API_KEY=""([^""]*)""") {
        $openaiKey = $matches[1]
        if ($openaiKey -like "*your*" -or $openaiKey -eq "") {
            Write-Host "❌ OPENAI_API_KEY: Still using placeholder value" -ForegroundColor Red
            if ($Fix) {
                $newKey = Read-Host "Enter your OpenAI API key"
                if ($newKey) {
                    $envContent = $envContent -replace 'OPENAI_API_KEY="[^"]*"', "OPENAI_API_KEY=""$newKey"""
                    Write-Host "✅ OPENAI_API_KEY updated" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "✅ OPENAI_API_KEY: Configured" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ OPENAI_API_KEY: Not found" -ForegroundColor Red
    }

    # Check Pinecone API Key
    if ($envContent -match "PINECONE_API_KEY=""([^""]*)""") {
        $pineconeKey = $matches[1]
        if ($pineconeKey -like "*your*" -or $pineconeKey -eq "") {
            Write-Host "❌ PINECONE_API_KEY: Still using placeholder value" -ForegroundColor Red
            if ($Fix) {
                $newKey = Read-Host "Enter your Pinecone API key"
                if ($newKey) {
                    $envContent = $envContent -replace 'PINECONE_API_KEY="[^"]*"', "PINECONE_API_KEY=""$newKey"""
                    Write-Host "✅ PINECONE_API_KEY updated" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "✅ PINECONE_API_KEY: Configured" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ PINECONE_API_KEY: Not found" -ForegroundColor Red
    }

    # Check Database URL
    if ($envContent -match "DATABASE_URL=""([^""]*)""") {
        Write-Host "✅ DATABASE_URL: Configured" -ForegroundColor Green
    } else {
        Write-Host "❌ DATABASE_URL: Not found" -ForegroundColor Red
    }

    # Check JWT Secrets
    if ($envContent -match "JWT_SECRET=""([^""]*)""") {
        Write-Host "✅ JWT_SECRET: Configured" -ForegroundColor Green
    } else {
        Write-Host "❌ JWT_SECRET: Not found" -ForegroundColor Red
    }

    if ($Fix) {
        $envContent | Set-Content $backendEnvPath -NoNewline
        Write-Host "Environment file updated!" -ForegroundColor Green
    }

} else {
    Write-Host "❌ backend/.env not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Checking frontend environment..." -ForegroundColor Yellow
if (Test-Path $frontendEnvPath) {
    Write-Host "✅ frontend/frontend/.env.local found" -ForegroundColor Green

    $frontendContent = Get-Content $frontendEnvPath -Raw
    if ($frontendContent -match "NEXT_PUBLIC_API_URL=(.+)") {
        Write-Host "✅ NEXT_PUBLIC_API_URL: Configured" -ForegroundColor Green
    } else {
        Write-Host "❌ NEXT_PUBLIC_API_URL: Not found" -ForegroundColor Red
    }
} else {
    Write-Host "❌ frontend/frontend/.env.local not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Get your OpenAI API key from: https://platform.openai.com/api-keys" -ForegroundColor White
Write-Host "2. Get your Pinecone API key from: https://www.pinecone.io/" -ForegroundColor White
Write-Host "3. Update the placeholder values in backend/.env" -ForegroundColor White
Write-Host "4. Run: make install (or docker-compose up -d)" -ForegroundColor White
Write-Host "5. Or run this script with -Fix to update interactively" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan