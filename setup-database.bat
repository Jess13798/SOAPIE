@echo off
cd /d "%~dp0"

call npm run db:setup
set "EXIT_CODE=%ERRORLEVEL%"

echo.
pause
exit /b %EXIT_CODE%
