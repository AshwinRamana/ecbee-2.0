# 🧪 Ecbee API Diagnostic Script (Fixed Version)
$ErrorActionPreference = "Stop"

$API_BASE = 'https://fczfbqdkj1.execute-api.ap-south-1.amazonaws.com/default/EcbeeApi/api'
$HEALTH_URL = $API_BASE + '/health'
$CONFIG_URL = $API_BASE + '/config?hostname=client4.ecbee.net'

Write-Host '📡 Step 1: Testing Basic Reachability...' -ForegroundColor Cyan
try {
    $result = Invoke-WebRequest -Uri $HEALTH_URL -Method Get -UseBasicParsing
    Write-Host '✅ Success! Status Code: ' -NoNewline -ForegroundColor Green
    Write-Host $result.StatusCode
    Write-Host 'Body: ' -NoNewline
    Write-Host $result.Content
} catch {
    Write-Host '❌ Health Check Failed!' -ForegroundColor Red
    Write-Host 'Error details: ' -NoNewline
    Write-Host $_.Exception.Message
}

Write-Host "`n🔍 Step 2: Testing Multi-tenant Config Fetch..." -ForegroundColor Cyan
try {
    $result = Invoke-WebRequest -Uri $CONFIG_URL -Method Get -UseBasicParsing
    Write-Host '✅ Success! Config Received.' -ForegroundColor Green
    Write-Host 'Body: ' -NoNewline
    Write-Host $result.Content
} catch {
    Write-Host '❌ Config Fetch Failed!' -ForegroundColor Yellow
    Write-Host 'Possible reasons: Database connection error in Lambda OR Route not found (404).'
    Write-Host 'Error details: ' -NoNewline
    Write-Host $_.Exception.Message
}

Write-Host "`n📝 Final Checklist:" -ForegroundColor White
Write-Host '1. Did you set MONGO_URI in the Lambda Console (Environment Variables)?'
Write-Host '2. Did you set the Handler to "lambda.handler"?'
Write-Host ('3. Is the API URL in environment.prod.ts matching: ' + $API_BASE)
