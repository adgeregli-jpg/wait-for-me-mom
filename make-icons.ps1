# Uygulama simgelerini üretir: icons/icon-192.png, icon-512.png, maskable-512.png, apple-touch-icon.png
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root "icons"
New-Item -ItemType Directory -Force $out | Out-Null

function Make-Icon([int]$size, [string]$name, [double]$pad) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = "AntiAlias"
  $rect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
  $c1 = [System.Drawing.Color]::FromArgb(255, 233, 122, 146)
  $c2 = [System.Drawing.Color]::FromArgb(255, 251, 214, 190)
  $br = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $c1, $c2, 45
  $g.FillRectangle($br, $rect)

  # Yumuşak daire
  $s = $size * (1 - 2 * $pad)
  $o = $size * $pad
  $soft = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(60, 255, 255, 255))
  $g.FillEllipse($soft, [float]$o, [float]$o, [float]$s, [float]$s)

  # Kalp
  $w = $s * 0.56; $cx = $size / 2; $cy = $size / 2 + $s * 0.03
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $r = $w / 4
  $p.AddArc([float]($cx - $w / 2), [float]($cy - $w * 0.42), [float]($w / 2), [float]($w / 2), 135, 225)
  $p.AddArc([float]$cx, [float]($cy - $w * 0.42), [float]($w / 2), [float]($w / 2), 180, 225)
  $p.AddLine([float]($cx + $w / 2 * 0.92), [float]($cy - $w * 0.05), [float]$cx, [float]($cy + $w * 0.45))
  $p.CloseFigure()
  $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  $g.FillPath($white, $p)

  # Kalbin üstünde kundaklanmış minik bebek (yan yatmış, uyuyor)
  $bw = $w * 0.56; $bx = $cx - $bw / 2 - $w * 0.02; $by = $cy - $w * 0.13
  $pink = [System.Drawing.Color]::FromArgb(255, 233, 122, 146)
  $pinkLight = [System.Drawing.Color]::FromArgb(255, 246, 178, 192)
  $skin = [System.Drawing.Color]::FromArgb(255, 255, 216, 196)
  # Kundak (gövde)
  $body = New-Object System.Drawing.Drawing2D.GraphicsPath
  $body.AddEllipse([float]($bx + $bw * 0.30), [float]$by, [float]($bw * 0.70), [float]($bw * 0.40))
  $g.FillPath((New-Object System.Drawing.SolidBrush $pinkLight), $body)
  # Kundak bandı
  $bandPen = New-Object System.Drawing.Pen $pink, ([float]($bw * 0.05))
  $g.DrawArc($bandPen, [float]($bx + $bw * 0.48), [float]($by + $bw * 0.02), [float]($bw * 0.22), [float]($bw * 0.36), 300, 120)
  # Baş
  $hr = $bw * 0.20
  $hx = $bx + $bw * 0.12; $hy = $by + $bw * 0.20 - $hr
  $g.FillEllipse((New-Object System.Drawing.SolidBrush $skin), [float]$hx, [float]$hy, [float]($hr * 2), [float]($hr * 2))
  # Bere
  $g.FillPie((New-Object System.Drawing.SolidBrush $pink), [float]($hx - $hr * 0.05), [float]($hy - $hr * 0.05), [float]($hr * 2.1), [float]($hr * 2.1), 200, 140)
  # Kapalı göz (uyuyor) ve yanak
  $eyePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 150, 90, 100)), ([float]($bw * 0.022))
  $eyePen.StartCap = "Round"; $eyePen.EndCap = "Round"
  $g.DrawArc($eyePen, [float]($hx + $hr * 0.95), [float]($hy + $hr * 0.95), [float]($hr * 0.45), [float]($hr * 0.3), 0, 180)
  $cheek = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(150, 246, 150, 165))
  $g.FillEllipse($cheek, [float]($hx + $hr * 1.15), [float]($hy + $hr * 1.3), [float]($hr * 0.4), [float]($hr * 0.28))

  $bmp.Save((Join-Path $out $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

Make-Icon 192 "icon-192.png" 0.08
Make-Icon 512 "icon-512.png" 0.08
Make-Icon 512 "maskable-512.png" 0.2
Make-Icon 180 "apple-touch-icon.png" 0.08
"ok"
