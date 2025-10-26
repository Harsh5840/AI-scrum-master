param(
    [Parameter(Mandatory=$true)]
    [string]$UpstashRedisUrl
)

Write-Host "🔄 Updating Redis configuration to use Upstash..." -ForegroundColor Yellow

$envPath = "backend\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "❌ backend/.env not found!" -ForegroundColor Red
    exit 1
}

# Read current content
$content = Get-Content $envPath -Raw

# Update Redis URL
$oldRedisLine = 'REDIS_URL="redis://localhost:6379"'
$newRedisLine = "REDIS_URL=""$UpstashRedisUrl"""

if ($content -match $oldRedisLine) {
    $content = $content -replace [regex]::Escape($oldRedisLine), $newRedisLine
    $content | Set-Content $envPath -NoNewline
    Write-Host "✅ Redis URL updated to use Upstash!" -ForegroundColor Green
    Write-Host "🔄 Redis configuration updated. Restart your backend server." -ForegroundColor Cyan
} else {
    Write-Host "❌ Could not find Redis URL line in .env file" -ForegroundColor Red
    Write-Host "Current Redis configuration:" -ForegroundColor Yellow
    $content | Select-String "REDIS_URL" | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
}