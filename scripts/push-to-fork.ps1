param(
  [string]$ForkUrl
)

if (-not $ForkUrl) {
  Write-Host "Usage: .\push-to-fork.ps1 <fork-url>"
  exit 1
}

Set-Location -Path (Split-Path -Path $PSScriptRoot -Parent)
git remote set-url origin $ForkUrl
git push origin HEAD
