# Test DeepSeek Integration
# Run this after restarting the dev server

$ProgressPreference = 'SilentlyContinue'

Write-Host ""
Write-Host "=== Testing DeepSeek Integration ===" -ForegroundColor Cyan

# Test payload
$body = @{
    subject = "A majestic dragon flying over ancient mountains"
    platform = "midjourney"
    styles = @("Fantasy", "Epic", "Cinematic")
    mood = "Dramatic"
    lighting = "Golden Hour"
    creativity = 85
    includeNegative = $true
} | ConvertTo-Json -Compress

Write-Host ""
Write-Host "Sending request to prompt generator..." -ForegroundColor Yellow

try {
    $resp = Invoke-RestMethod -Uri "http://localhost:3000/api/prompts/generate" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -TimeoutSec 30
    
    if ($resp.success) {
        Write-Host ""
        Write-Host "SUCCESS! DeepSeek integration working!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Generated Prompt:" -ForegroundColor Cyan
        Write-Host $resp.data.prompt -ForegroundColor White
        Write-Host ""
        Write-Host "Prompt Length: $($resp.data.prompt.Length) characters" -ForegroundColor Yellow
        Write-Host "Credits Used: $($resp.data.creditsUsed)" -ForegroundColor Yellow
        
        if ($resp.data.note) {
            Write-Host ""
            Write-Host "Note: $($resp.data.note)" -ForegroundColor Yellow
        }
    } else {
        Write-Host ""
        Write-Host "Request failed" -ForegroundColor Red
        Write-Host "Error: $($resp.error)" -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "Request failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        if ($errorObj.error) {
            Write-Host ""
            Write-Host "API Error: $($errorObj.error)" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
