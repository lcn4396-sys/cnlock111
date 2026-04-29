# Generate tabBar PNG icons (81x81, < 40KB) for WeChat mini-program
# Usage: .\GenTabIcons.ps1  OR  .\GenTabIcons.ps1 -OutDir "C:\path\to\vote-miniprogram\images"
param([string]$OutDir = "")
Add-Type -AssemblyName System.Drawing
if ($OutDir) { $outDir = $OutDir } else { $outDir = (Join-Path $PSScriptRoot "..\images") }
$outDir = $outDir.TrimEnd('\','/')
$null = New-Item -ItemType Directory -Force -Path $outDir
Write-Host "Output: $outDir"
$size = 81
$gray = [System.Drawing.Color]::FromArgb(255, 153, 153, 153)
$green = [System.Drawing.Color]::FromArgb(255, 7, 193, 96)

function Save-Icon {
    param([string]$path, [System.Drawing.Color]$color, [scriptblock]$draw)
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $pen = New-Object System.Drawing.Pen($color, 3)
    & $draw $g $pen
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    $kb = [math]::Round((Get-Item $path).Length / 1024, 1)
    if ((Get-Item $path).Length -gt 40KB) { Write-Warning "$path is $kb KB (max 40KB)" }
    else { Write-Host "OK $path $kb KB" }
}

# Home icon: simple house
Save-Icon (Join-Path $outDir "tab-home.png") $gray {
    param($g, $pen)
    $g.DrawPolygon($pen, @(
        [System.Drawing.Point]::new(40, 18),
        [System.Drawing.Point]::new(18, 42),
        [System.Drawing.Point]::new(18, 68),
        [System.Drawing.Point]::new(62, 68),
        [System.Drawing.Point]::new(62, 42)
    ))
    $g.DrawRectangle($pen, 34, 50, 14, 18)
}
Save-Icon (Join-Path $outDir "tab-home-active.png") $green {
    param($g, $pen)
    $g.DrawPolygon($pen, @(
        [System.Drawing.Point]::new(40, 18),
        [System.Drawing.Point]::new(18, 42),
        [System.Drawing.Point]::new(18, 68),
        [System.Drawing.Point]::new(62, 68),
        [System.Drawing.Point]::new(62, 42)
    ))
    $g.DrawRectangle($pen, 34, 50, 14, 18)
}

# Vote icon: three lines + check
Save-Icon (Join-Path $outDir "tab-vote.png") $gray {
    param($g, $pen)
    $g.DrawRectangle($pen, 20, 22, 36, 10)
    $g.DrawRectangle($pen, 20, 40, 36, 10)
    $g.DrawRectangle($pen, 20, 58, 36, 10)
    $g.DrawLine($pen, 46, 30, 54, 38)
    $g.DrawLine($pen, 54, 38, 62, 28)
}
Save-Icon (Join-Path $outDir "tab-vote-active.png") $green {
    param($g, $pen)
    $g.DrawRectangle($pen, 20, 22, 36, 10)
    $g.DrawRectangle($pen, 20, 40, 36, 10)
    $g.DrawRectangle($pen, 20, 58, 36, 10)
    $g.DrawLine($pen, 46, 30, 54, 38)
    $g.DrawLine($pen, 54, 38, 62, 28)
}

# My icon: circle (head) + arc (body)
Save-Icon (Join-Path $outDir "tab-my.png") $gray {
    param($g, $pen)
    $g.DrawEllipse($pen, 26, 16, 26, 26)
    $g.DrawArc($pen, 20, 36, 40, 40, 0, 180)
}
Save-Icon (Join-Path $outDir "tab-my-active.png") $green {
    param($g, $pen)
    $g.DrawEllipse($pen, 26, 16, 26, 26)
    $g.DrawArc($pen, 20, 36, 40, 40, 0, 180)
}

Write-Host "Done. Icons in $outDir"
