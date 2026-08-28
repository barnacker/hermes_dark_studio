# Installs the Dark Studio Hermes desktop theme from this repo.
# Usage:  .\install.ps1            (installs for the default profile)
#         .\install.ps1 -Profile name   (installs into a named profile)

param(
    [string]$Profile = ''
)

$ErrorActionPreference = 'Stop'

$src = Join-Path $PSScriptRoot 'plugin.js'
if (-not (Test-Path $src)) { throw "plugin.js not found next to install.ps1: $src" }

if ($Profile) {
    $destDir = Join-Path $env:USERPROFILE ".hermes\profiles\$Profile\desktop-plugins\dark-studio"
} else {
    $destDir = Join-Path $env:USERPROFILE '.hermes\desktop-plugins\dark-studio'
}

New-Item -ItemType Directory -Force -Path $destDir | Out-Null
Copy-Item $src (Join-Path $destDir 'plugin.js') -Force
Write-Host "Installed -> $destDir\plugin.js"
Write-Host ''
Write-Host 'Now in the Hermes desktop app:'
Write-Host '  1. Ctrl+K -> Reload desktop plugins   (first install only)'
Write-Host '  2. Ctrl+K -> Theme: apply Dark Studio  (or Appearance -> Dark Studio)'
