$ErrorActionPreference = 'Stop'
$assetRoot = Join-Path $PSScriptRoot '../public/images'
New-Item -ItemType Directory -Path $assetRoot -Force | Out-Null
$assets = @(
  @{ Name = 'students.jpg'; Url = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85' },
  @{ Name = 'coding.jpg'; Url = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=680&q=80' },
  @{ Name = 'design.jpg'; Url = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=680&q=80' },
  @{ Name = 'marketing.jpg'; Url = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=680&q=80' },
  @{ Name = 'english.jpg'; Url = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=680&q=80' }
)
foreach ($asset in $assets) {
  $destination = Join-Path $assetRoot $asset.Name
  if ((Test-Path -LiteralPath $destination) -and (Get-Item -LiteralPath $destination).Length -gt 1024) { continue }
  Invoke-WebRequest -UseBasicParsing -Uri $asset.Url -OutFile $destination -TimeoutSec 25
  Write-Output $asset.Name
}
