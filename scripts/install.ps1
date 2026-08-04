# Better Ctrl+F — instalador em um comando
#
# Uso (PowerShell):
#   irm https://raw.githubusercontent.com/ElberBrgs/better-ctrl-f/main/scripts/install.ps1 | iex
#
# O que faz: baixa o zip da release mais recente, extrai numa pasta fixa
# (%LOCALAPPDATA%\BetterCtrlF) e abre a página de extensões do Edge pronta
# para o "Carregar descompactada".

$ErrorActionPreference = "Stop"

$repo     = "ElberBrgs/better-ctrl-f"
$destino  = Join-Path $env:LOCALAPPDATA "BetterCtrlF"

Write-Host "==> Buscando a release mais recente de $repo..." -ForegroundColor Cyan
$release = Invoke-RestMethod "https://api.github.com/repos/$repo/releases/latest"
$asset   = $release.assets | Where-Object { $_.name -like "*.zip" } | Select-Object -First 1
if (-not $asset) { throw "Nenhum .zip encontrado na release $($release.tag_name)." }

$zip = Join-Path $env:TEMP $asset.name
Write-Host "==> Baixando $($asset.name) ($($release.tag_name))..."
Invoke-WebRequest $asset.browser_download_url -OutFile $zip

Write-Host "==> Extraindo para $destino"
if (Test-Path $destino) { Remove-Item $destino -Recurse -Force }
Expand-Archive $zip -DestinationPath $destino -Force
Remove-Item $zip

Write-Host ""
Write-Host "Instalado em: $destino" -ForegroundColor Green
Write-Host ""
Write-Host "Ultimos passos (na janela do Edge que vai abrir):" -ForegroundColor Yellow
Write-Host "  1. Ative o 'Modo do desenvolvedor' (canto inferior esquerdo)"
Write-Host "  2. Clique em 'Carregar descompactada'"
Write-Host "  3. Cole este caminho na janela de selecao de pasta:"
Write-Host ""
Write-Host "     $destino" -ForegroundColor Cyan
Write-Host ""

Start-Process "msedge.exe" "edge://extensions"
