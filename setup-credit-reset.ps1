# Monthly Credit Reset - Migration and Testing Script
# This script helps you set up and test the monthly credit reset system

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('migrate', 'test-list', 'test-reset', 'generate-secret', 'all')]
    [string]$Action = 'all'
)

Write-Host "=== Monthly Credit Reset Setup ===" -ForegroundColor Cyan
Write-Host ""

function Generate-Secret {
    Write-Host "Generating secure CRON_SECRET..." -ForegroundColor Yellow
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create()
    $rng.GetBytes($bytes)
    $secret = [Convert]::ToBase64String($bytes)
    
    Write-Host "Generated Secret:" -ForegroundColor Green
    Write-Host $secret
    Write-Host ""
    Write-Host "Add this to your .env.local file:" -ForegroundColor Yellow
    Write-Host "CRON_SECRET=$secret"
    Write-Host ""
}

function Run-Migration {
    Write-Host "Running Prisma migration..." -ForegroundColor Yellow
    
    # Generate Prisma client
    Write-Host "1. Generating Prisma client..." -ForegroundColor Cyan
    npx prisma generate
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Prisma client generated successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to generate Prisma client" -ForegroundColor Red
        return
    }
    
    # Create migration
    Write-Host ""
    Write-Host "2. Creating migration..." -ForegroundColor Cyan
    npx prisma migrate dev --name add_monthly_reset_tracking
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Migration applied successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Migration failed" -ForegroundColor Red
        return
    }
    
    Write-Host ""
    Write-Host "Migration completed!" -ForegroundColor Green
}

function Test-ListUsers {
    Write-Host "Testing user list endpoint..." -ForegroundColor Yellow
    Write-Host ""
    
    $url = "http://localhost:3000/api/admin/users/list"
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing
        $data = $response.Content | ConvertFrom-Json
        
        if ($data.success) {
            Write-Host "✓ User list retrieved successfully" -ForegroundColor Green
            Write-Host ""
            Write-Host "Summary:" -ForegroundColor Cyan
            Write-Host "Total Users: $($data.data.summary.totalUsers)" -ForegroundColor White
            Write-Host "Total Credits Remaining: $($data.data.summary.totalCreditsRemaining)" -ForegroundColor White
            Write-Host "Total Credits Used: $($data.data.summary.totalCreditsUsed)" -ForegroundColor White
            Write-Host ""
            
            Write-Host "Users by Plan:" -ForegroundColor Cyan
            $data.data.summary.usersByPlan.PSObject.Properties | ForEach-Object {
                Write-Host "  $($_.Name): $($_.Value)" -ForegroundColor White
            }
            
            if ($data.data.users.Count -gt 0) {
                Write-Host ""
                Write-Host "First 5 users:" -ForegroundColor Cyan
                $data.data.users | Select-Object -First 5 | ForEach-Object {
                    Write-Host "  - $($_.email) | Credits: $($_.credits) | Plan: $($_.plan)" -ForegroundColor White
                }
            }
        } else {
            Write-Host "✗ Failed to retrieve user list" -ForegroundColor Red
            Write-Host "Error: $($data.error)" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Request failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Make sure your development server is running (npm run dev)" -ForegroundColor Yellow
    }
}

function Test-ResetCredits {
    Write-Host "Testing credit reset endpoint..." -ForegroundColor Yellow
    Write-Host ""
    
    $url = "http://localhost:3000/api/admin/credits/reset"
    
    # First check who needs reset
    Write-Host "1. Checking users needing reset..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing
        $data = $response.Content | ConvertFrom-Json
        
        if ($data.success) {
            Write-Host "✓ Found $($data.data.usersNeedingReset) users needing reset" -ForegroundColor Green
            Write-Host ""
        }
    } catch {
        Write-Host "✗ Check failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Ask for confirmation
    Write-Host "2. Testing manual reset..." -ForegroundColor Cyan
    $confirm = Read-Host "Do you want to test resetting credits? (y/n)"
    
    if ($confirm -eq 'y') {
        try {
            $body = @{ resetAll = $false } | ConvertTo-Json
            $response = Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
            $data = $response.Content | ConvertFrom-Json
            
            if ($data.success) {
                Write-Host "✓ Reset successful!" -ForegroundColor Green
                Write-Host "Users reset: $($data.data.usersReset)" -ForegroundColor White
            } else {
                Write-Host "✗ Reset failed" -ForegroundColor Red
                Write-Host "Error: $($data.error)" -ForegroundColor Red
            }
        } catch {
            Write-Host "✗ Request failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

function Show-Menu {
    Write-Host "What would you like to do?" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Generate CRON_SECRET" -ForegroundColor White
    Write-Host "2. Run database migration" -ForegroundColor White
    Write-Host "3. Test user list endpoint" -ForegroundColor White
    Write-Host "4. Test credit reset endpoint" -ForegroundColor White
    Write-Host "5. Run all setup steps" -ForegroundColor White
    Write-Host "Q. Quit" -ForegroundColor White
    Write-Host ""
}

# Main execution
if ($Action -eq 'migrate') {
    Run-Migration
}
elseif ($Action -eq 'test-list') {
    Test-ListUsers
}
elseif ($Action -eq 'test-reset') {
    Test-ResetCredits
}
elseif ($Action -eq 'generate-secret') {
    Generate-Secret
}
elseif ($Action -eq 'all') {
    # Interactive mode
    do {
        Show-Menu
        $choice = Read-Host "Enter your choice"
        
        switch ($choice) {
            '1' { Generate-Secret }
            '2' { Run-Migration }
            '3' { Test-ListUsers }
            '4' { Test-ResetCredits }
            '5' {
                Generate-Secret
                Write-Host ""
                Write-Host "Press Enter to continue with migration..." -ForegroundColor Yellow
                Read-Host
                Run-Migration
                Write-Host ""
                Write-Host "Press Enter to test endpoints..." -ForegroundColor Yellow
                Read-Host
                Test-ListUsers
                Write-Host ""
                Test-ResetCredits
            }
            'q' { 
                Write-Host "Goodbye!" -ForegroundColor Cyan
                break
            }
            default {
                Write-Host "Invalid choice. Please try again." -ForegroundColor Red
            }
        }
        
        if ($choice -ne 'q') {
            Write-Host ""
            Write-Host "Press Enter to continue..." -ForegroundColor Gray
            Read-Host
            Clear-Host
        }
    } while ($choice -ne 'q')
}

Write-Host ""
Write-Host "Setup script completed!" -ForegroundColor Green
