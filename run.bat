@echo off
title NoteBridge Runner
echo ========================================================
echo   Starting NoteBridge (FastAPI Backend + React Frontend)
echo ========================================================
echo.

REM Start FastAPI Backend
start "NoteBridge Backend (FastAPI)" cmd /k "cd /d %~dp0backend && "%~dp0notebridge-frontend\venv\Scripts\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

REM Start React Frontend
start "NoteBridge Frontend (Vite)" cmd /k "cd /d %~dp0notebridge-frontend && npm run dev"

echo Backend URL:  http://localhost:8000
echo Frontend URL: http://localhost:5173
echo.
echo Both servers have been launched in separate windows!
