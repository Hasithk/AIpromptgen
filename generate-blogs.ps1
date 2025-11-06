# Quick Blog Backfill Script
# This script generates missed blog posts for your site

param(
    [int]$DaysBack = 7,
    [string]$BaseUrl = "https://aipromptgen.app"
)

# Colors
$Green = "Green"
$Red = "Red"
$Cyan = "Cyan"
$Yellow = "Yellow"

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor $Cyan
Write-Host "  AI Prompt Gen - Blog Post Backfill Tool" -ForegroundColor $Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor $Cyan
Write-Host ""

# Get CRON_SECRET from environment or prompt
$CRON_SECRET = $env:CRON_SECRET
if (-not $CRON_SECRET) {
    Write-Host "CRON_SECRET not found in environment variables." -ForegroundColor $Yellow
    $CRON_SECRET = Read-Host "Enter your CRON_SECRET"
    if (-not $CRON_SECRET) {
        Write-Host "✗ Error: CRON_SECRET is required!" -ForegroundColor $Red
        exit 1
    }
}

Write-Host "Configuration:" -ForegroundColor $Cyan
Write-Host "  - Base URL: $BaseUrl"
Write-Host "  - Days to backfill: $DaysBack"
Write-Host "  - CRON_SECRET: $($CRON_SECRET.Substring(0, [Math]::Min(8, $CRON_SECRET.Length)))..." 
Write-Host ""

# Confirm action
$confirm = Read-Host "Generate $DaysBack blog posts? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor $Yellow
    exit 0
}

Write-Host ""
Write-Host "Generating blog posts..." -ForegroundColor $Cyan

$body = @{ 
    secret = $CRON_SECRET
    daysBack = $DaysBack 
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod `
        -Uri "$BaseUrl/api/blog/generate-missed" `
        -Method Post `
        -Body $body `
        -ContentType "application/json" `
        -TimeoutSec 300

    if ($response.success) {
        Write-Host ""
        Write-Host "✓ Success!" -ForegroundColor $Green
        Write-Host "  $($response.message)" -ForegroundColor $Green
        Write-Host ""
        Write-Host "Generated Articles:" -ForegroundColor $Cyan
        Write-Host "─────────────────────────────────────────────────" -ForegroundColor $Cyan
        
        foreach ($article in $response.articles) {
            $date = [DateTime]::Parse($article.publishedAt).ToString("yyyy-MM-dd HH:mm")
            Write-Host "  ✓ $date" -ForegroundColor $Green
            Write-Host "    $($article.title)" -ForegroundColor White
        }
        
        Write-Host ""
        Write-Host "─────────────────────────────────────────────────" -ForegroundColor $Cyan
        Write-Host "View your blog at: $BaseUrl/blog" -ForegroundColor $Cyan
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "✗ Generation failed!" -ForegroundColor $Red
        Write-Host "  Error: $($response.error)" -ForegroundColor $Red
        Write-Host ""
    }
} catch {
    Write-Host ""
    Write-Host "✗ Request failed!" -ForegroundColor $Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor $Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "  Response: $responseBody" -ForegroundColor $Red
        } catch {}
    }
}

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor $Cyan
Write-Host ""
