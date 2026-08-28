# Installs the Dark Studio Hermes desktop theme from this repo.
# Usage:  .\install.ps1               (installs for the default profile)
#         .\install.ps1 -Profile name (installs into a named profile)
#
# Resolution order for the Hermes home:
#   1. $env:HERMES_HOME (if set)
#   2. %LOCALAPPDATA%\hermes  (the documented Windows default)
#   3. %USERPROFILE%\.hermes
# The app's Settings -> Plugins shows the exact folder it loads plugins from —
# that answer wins if it differs.

param(
    [string]$Profile = ''
)

$ErrorActionPreference = 'Stop'

$src = Join-Path $PSScriptRoot 'plugin.js'
if (-not (Test-Path $src)) { throw "plugin.js not found next to install.ps1: $src" }

$hermesHome = $null
if ($env:HERMES_HOME) {
    $hermesHome = $env:HERMES_HOME
} elseif (Test-Path (Join-Path $env:LOCALAPPDATA 'hermes')) {
    $hermesHome = Join-Path $env:LOCALAPPDATA 'hermes'   # Windows default
} else {
    $hermesHome = Join-Path $env:USERPROFILE '.hermes'
}

if ($Profile) {
    $destDir = Join-Path $hermesHome "profiles\$Profile\desktop-plugins\hermes_dark_studio"
} else {
    $destDir = Join-Path $hermesHome 'desktop-plugins\hermes_dark_studio'
}

New-Item -ItemType Directory -Force -Path $destDir | Out-Null
Copy-Item $src (Join-Path $destDir 'plugin.js') -Force
Write-Host "Installed -> $destDir\plugin.js"
Write-Host ''
Write-Host 'Now in the Hermes desktop app:'
Write-Host '  1. Ctrl+K -> Reload desktop plugins   (first install only)'
Write-Host '  2. Ctrl+K -> Theme: apply Dark Studio  (or Appearance -> Dark Studio)'
