@echo off
title Café Círculo
echo ========================================
echo       CAFÉ CÍRCULO - Iniciando...
echo ========================================
echo.

start "Cafe Circulo - Server" cmd /c "cd /d %~dp0 && npm run dev:server"
start "Cafe Circulo - Client" cmd /c "cd /d %~dp0 && npm run dev:client"

echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Las ventanas estan abiertas. Cerralas para detener los servidores.
echo.
pause
