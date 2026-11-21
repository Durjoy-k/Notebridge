Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting NoteBridge (FastAPI Backend + React Frontend)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$scriptDir = $PSScriptRoot

# Start FastAPI Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\backend'; & '$scriptDir\notebridge-frontend\venv\Scripts\python.exe' -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

# Start React Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\notebridge-frontend'; npm run dev"

Write-Host ""
Write-Host "🚀 FastAPI Backend running at: http://localhost:8000" -ForegroundColor Green
Write-Host "🚀 React Frontend running at:  http://localhost:5173" -ForegroundColor Green
Write-Host ""
