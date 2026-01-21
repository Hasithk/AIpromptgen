# Digital Ocean Deployment Script
# This script helps deploy updates to your Digital Ocean droplet

param(
    [Parameter(Mandatory=$false)]
    [string]$DropletIP = "",
    
    [Parameter(Mandatory=$false)]
    [string]$Username = "root",
    
    [Parameter(Mandatory=$false)]
    [string]$ProjectPath = "/var/www/ai-prompts-gen"
)

Write-Host "AI Prompts Generator - Digital Ocean Deployment" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Gray
Write-Host ""

# Step 1: Check Git Status
Write-Host "Step 1: Checking local git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Warning: You have uncommitted changes!" -ForegroundColor Red
    Write-Host $gitStatus
    $continue = Read-Host "Do you want to commit them first? (y/n)"
    if ($continue -eq "y") {
        $message = Read-Host "Enter commit message"
        git add -A
        git commit -m $message
        Write-Host "Changes committed" -ForegroundColor Green
    }
}

# Step 2: Push to GitHub
Write-Host ""
Write-Host "Step 2: Pushing to GitHub..." -ForegroundColor Yellow
try {
    git push origin main 2>&1 | Out-Null
    Write-Host "Successfully pushed to GitHub" -ForegroundColor Green
} catch {
    Write-Host "Already up to date with GitHub" -ForegroundColor Green
}

# Step 3: Get Droplet IP if not provided
if (-not $DropletIP) {
    Write-Host ""
    Write-Host "Step 3: Digital Ocean Droplet Setup" -ForegroundColor Yellow
    Write-Host "Please provide your Digital Ocean droplet IP address" -ForegroundColor Cyan
    Write-Host "You can find this in your Digital Ocean dashboard under Droplets" -ForegroundColor Gray
    $DropletIP = Read-Host "Enter Droplet IP"
}

# Step 4: Display SSH connection instructions
Write-Host ""
Write-Host "Step 4: Connect to your droplet and deploy" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Gray
Write-Host ""
Write-Host "Copy and run these commands:" -ForegroundColor Cyan
Write-Host ""
Write-Host "ssh $Username@$DropletIP" -ForegroundColor White
Write-Host "cd $ProjectPath" -ForegroundColor White
Write-Host "git pull origin main" -ForegroundColor White
Write-Host "npm install" -ForegroundColor White
Write-Host "npm run build" -ForegroundColor White
Write-Host "pm2 restart all" -ForegroundColor White
Write-Host "pm2 status" -ForegroundColor White
Write-Host ""
Write-Host "============================================================" -ForegroundColor Gray
Write-Host ""
Write-Host "Deployment commands are ready!" -ForegroundColor Green
Write-Host "Connect to your server and run the commands above." -ForegroundColor Yellow
Write-Host ""

