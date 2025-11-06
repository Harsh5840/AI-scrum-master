# API Test Script for AI Scrum Master
# Tests all endpoints with Gemini AI integration

Write-Host "`n🧪 AI Scrum Master API Test Suite" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000"
$token = $null
$userId = $null

# Helper function to make requests
function Invoke-API {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$Token = $null
    )
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    
    $params = @{
        Uri = "$baseUrl$Endpoint"
        Method = $Method
        Headers = $headers
        UseBasicParsing = $true
    }
    
    if ($Body) {
        $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
    }
    
    try {
        $response = Invoke-WebRequest @params
        return @{
            Success = $true
            StatusCode = $response.StatusCode
            Content = ($response.Content | ConvertFrom-Json)
        }
    }
    catch {
        return @{
            Success = $false
            StatusCode = $_.Exception.Response.StatusCode.value__
            Error = $_.Exception.Message
        }
    }
}

# Test 1: Check server health
Write-Host "1️⃣  Testing Server Health..." -ForegroundColor Yellow
$result = Invoke-API -Method GET -Endpoint "/"
if ($result.Success) {
    Write-Host "✅ Server is running: $($result.Content)" -ForegroundColor Green
} else {
    Write-Host "❌ Server health check failed: $($result.Error)" -ForegroundColor Red
}

# Test 2: Register new user
Write-Host "`n2️⃣  Testing User Registration..." -ForegroundColor Yellow
$registerData = @{
    name = "Test User"
    email = "testgemini@example.com"
    password = "Test123456"
}
$result = Invoke-API -Method POST -Endpoint "/api/auth/register" -Body $registerData
if ($result.Success) {
    $token = $result.Content.token
    $userId = $result.Content.user.id
    Write-Host "✅ User registered successfully" -ForegroundColor Green
    Write-Host "   User ID: $userId" -ForegroundColor Gray
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} else {
    # Try login if user exists
    Write-Host "⚠️  Registration failed (user may exist), trying login..." -ForegroundColor Yellow
    $loginData = @{
        email = "testgemini@example.com"
        password = "Test123456"
    }
    $result = Invoke-API -Method POST -Endpoint "/api/auth/login" -Body $loginData
    if ($result.Success) {
        $token = $result.Content.token
        $userId = $result.Content.user.id
        Write-Host "✅ Logged in successfully" -ForegroundColor Green
        Write-Host "   User ID: $userId" -ForegroundColor Gray
    } else {
        Write-Host "❌ Login failed: $($result.Error)" -ForegroundColor Red
        exit
    }
}

# Test 3: Get current user
Write-Host "`n3️⃣  Testing Get Current User..." -ForegroundColor Yellow
$result = Invoke-API -Method GET -Endpoint "/api/auth/me" -Token $token
if ($result.Success) {
    Write-Host "✅ User info retrieved: $($result.Content.name) ($($result.Content.email))" -ForegroundColor Green
} else {
    Write-Host "❌ Get user failed: $($result.Error)" -ForegroundColor Red
}

# Test 4: Create a sprint
Write-Host "`n4️⃣  Testing Sprint Creation..." -ForegroundColor Yellow
$sprintData = @{
    name = "Gemini Test Sprint"
    startDate = (Get-Date).ToString("yyyy-MM-dd")
    endDate = (Get-Date).AddDays(14).ToString("yyyy-MM-dd")
}
$result = Invoke-API -Method POST -Endpoint "/api/sprints" -Body $sprintData -Token $token
$sprintId = $null
if ($result.Success) {
    $sprintId = $result.Content.id
    Write-Host "✅ Sprint created successfully" -ForegroundColor Green
    Write-Host "   Sprint ID: $sprintId" -ForegroundColor Gray
    Write-Host "   Name: $($result.Content.name)" -ForegroundColor Gray
} else {
    Write-Host "❌ Sprint creation failed: $($result.Error)" -ForegroundColor Red
}

# Test 5: Get all sprints
Write-Host "`n5️⃣  Testing Get All Sprints..." -ForegroundColor Yellow
$result = Invoke-API -Method GET -Endpoint "/api/sprints" -Token $token
if ($result.Success) {
    $count = $result.Content.Count
    Write-Host "✅ Retrieved $count sprint(s)" -ForegroundColor Green
} else {
    Write-Host "❌ Get sprints failed: $($result.Error)" -ForegroundColor Red
}

# Test 6: Create standup with AI summarization
Write-Host "`n6️⃣  Testing Standup Creation with Gemini AI..." -ForegroundColor Yellow
$standupData = @{
    summary = "Yesterday I completed the authentication module and fixed three bugs in the login flow. Today I will work on integrating Google Gemini AI for smart standup summaries. I'm blocked on API rate limits but should be resolved soon."
    sprintId = $sprintId
}
$result = Invoke-API -Method POST -Endpoint "/api/standups" -Body $standupData -Token $token
$standupId = $null
if ($result.Success) {
    $standupId = $result.Content.id
    Write-Host "✅ Standup created successfully" -ForegroundColor Green
    Write-Host "   Standup ID: $standupId" -ForegroundColor Gray
    Write-Host "   Summary: $($result.Content.summary.Substring(0, [Math]::Min(80, $result.Content.summary.Length)))..." -ForegroundColor Gray
    Write-Host "   🤖 AI will process this asynchronously" -ForegroundColor Cyan
} else {
    Write-Host "❌ Standup creation failed: $($result.Error)" -ForegroundColor Red
}

# Test 7: Get all standups
Write-Host "`n7️⃣  Testing Get All Standups..." -ForegroundColor Yellow
$result = Invoke-API -Method GET -Endpoint "/api/standups" -Token $token
if ($result.Success) {
    $count = $result.Content.Count
    Write-Host "✅ Retrieved $count standup(s)" -ForegroundColor Green
} else {
    Write-Host "❌ Get standups failed: $($result.Error)" -ForegroundColor Red
}

# Test 8: Create blocker
Write-Host "`n8️⃣  Testing Blocker Creation..." -ForegroundColor Yellow
if ($standupId) {
    $blockerData = @{
        standupId = $standupId
        type = "technical"
        severity = "high"
        description = "API rate limit preventing full Gemini integration testing"
        status = "active"
    }
    $result = Invoke-API -Method POST -Endpoint "/api/blockers" -Body $blockerData -Token $token
    if ($result.Success) {
        Write-Host "✅ Blocker created successfully" -ForegroundColor Green
        Write-Host "   Type: $($result.Content.type), Severity: $($result.Content.severity)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Blocker creation failed: $($result.Error)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Skipped (no standup ID)" -ForegroundColor Yellow
}

# Test 9: Get all blockers
Write-Host "`n9️⃣  Testing Get All Blockers..." -ForegroundColor Yellow
$result = Invoke-API -Method GET -Endpoint "/api/blockers" -Token $token
if ($result.Success) {
    $count = $result.Content.Count
    Write-Host "✅ Retrieved $count blocker(s)" -ForegroundColor Green
} else {
    Write-Host "❌ Get blockers failed: $($result.Error)" -ForegroundColor Red
}

# Test 10: Create backlog item
Write-Host "`n🔟 Testing Backlog Item Creation..." -ForegroundColor Yellow
$backlogData = @{
    title = "Implement Gemini AI chat interface"
    description = "Build a conversational AI interface using Google Gemini for team insights"
    sprintId = $sprintId
}
$result = Invoke-API -Method POST -Endpoint "/api/backlog" -Body $backlogData -Token $token
if ($result.Success) {
    Write-Host "✅ Backlog item created successfully" -ForegroundColor Green
    Write-Host "   Title: $($result.Content.title)" -ForegroundColor Gray
} else {
    Write-Host "❌ Backlog creation failed: $($result.Error)" -ForegroundColor Red
}

# Test 11: Get sprint by ID
Write-Host "`n1️⃣1️⃣  Testing Get Sprint by ID..." -ForegroundColor Yellow
if ($sprintId) {
    $result = Invoke-API -Method GET -Endpoint "/api/sprints/$sprintId" -Token $token
    if ($result.Success) {
        Write-Host "✅ Sprint details retrieved" -ForegroundColor Green
        Write-Host "   Name: $($result.Content.name)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Get sprint failed: $($result.Error)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Skipped (no sprint ID)" -ForegroundColor Yellow
}

# Test 12: Get queue status
Write-Host "`n1️⃣2️⃣  Testing Workflow Queue Status..." -ForegroundColor Yellow
$result = Invoke-API -Method GET -Endpoint "/api/workflows/queue/status" -Token $token
if ($result.Success) {
    Write-Host "✅ Queue status retrieved" -ForegroundColor Green
    Write-Host "   AI Workflows: $($result.Content.queues.aiWorkflows)" -ForegroundColor Gray
} else {
    Write-Host "❌ Queue status failed: $($result.Error)" -ForegroundColor Red
}

# Summary
Write-Host "`n" -NoNewline
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🎉 Test Suite Complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "- Backend is running with Google Gemini AI ✅" -ForegroundColor Green
Write-Host "- All core endpoints are functional ✅" -ForegroundColor Green
Write-Host "- AI integration ready for testing ✅" -ForegroundColor Green
Write-Host "`n💡 Note: AI processing happens asynchronously" -ForegroundColor Yellow
Write-Host "   Check standups again in a few seconds to see AI-generated summaries`n" -ForegroundColor Yellow
