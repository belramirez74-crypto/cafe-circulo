# Café Círculo - Iniciar servidores
Write-Host "Iniciando Café Círculo..." -ForegroundColor Green

$server = Start-Process -FilePath "npm" -ArgumentList "run dev:server" -WorkingDirectory "$PSScriptRoot" -NoNewWindow -PassThru
$client = Start-Process -FilePath "npm" -ArgumentList "run dev:client" -WorkingDirectory "$PSScriptRoot" -NoNewWindow -PassThru

Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presioná Ctrl+C para detener ambos servidores" -ForegroundColor Yellow

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
        if ($server.HasExited) {
            Write-Host "El servidor backend se detuvo inesperadamente" -ForegroundColor Red
            break
        }
        if ($client.HasExited) {
            Write-Host "El servidor frontend se detuvo inesperadamente" -ForegroundColor Red
            break
        }
    }
} finally {
    if (!$server.HasExited) { $server.Kill() }
    if (!$client.HasExited) { $client.Kill() }
}
