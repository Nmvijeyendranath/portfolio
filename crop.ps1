Add-Type -AssemblyName System.Drawing
$imgPath = (Resolve-Path "app/assets/portrait.jpg").Path
$outPath = (Resolve-Path "app/assets").Path + "\portrait_square.jpg"

$src = [System.Drawing.Bitmap]::FromFile($imgPath)
$w = $src.Width
$h = $src.Height

# Face is around 63% horizontal, centered vertically
$cropSize = $h
$centerX = [int]($w * 0.63)
$startX = [int]($centerX - ($cropSize / 2))
if ($startX + $cropSize -gt $w) {
    $startX = $w - $cropSize
}
if ($startX -lt 0) {
    $startX = 0
}

$cropRect = New-Object System.Drawing.Rectangle($startX, 0, $cropSize, $cropSize)
$cropped = $src.Clone($cropRect, $src.PixelFormat)
$cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$src.Dispose()
$cropped.Dispose()
Write-Host "Success! Cropped from $w x $h to $cropSize x $cropSize, startX=$startX"
