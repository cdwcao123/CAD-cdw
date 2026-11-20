param(
  [Parameter(Mandatory = $true)][string]$InputPath,
  [Parameter(Mandatory = $true)][string]$OutputPath,
  [int]$MaxWidth = 960,
  [int]$MaxHeight = 720,
  [int]$MaxBytes = 80000,
  [Nullable[int]]$CropX = $null,
  [Nullable[int]]$CropY = $null,
  [Nullable[int]]$CropWidth = $null,
  [Nullable[int]]$CropHeight = $null
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

if ([System.IO.Path]::GetExtension($OutputPath) -notmatch '^\.jpe?g$') {
  throw 'OutputPath must end in .jpg or .jpeg.'
}

# These are hard ceilings, not recommendations. The host may re-encode images
# before packaging them into an SSE event, so changing these limits can revive
# the event-size failure even when the source file itself is small.
$MaxWidth = [Math]::Min($MaxWidth, 960)
$MaxHeight = [Math]::Min($MaxHeight, 720)
$MaxBytes = [Math]::Min($MaxBytes, 80000)

$source = [System.Drawing.Image]::FromFile((Resolve-Path -LiteralPath $InputPath))
$sourceWidth = $source.Width
$sourceHeight = $source.Height
$hasCrop = $CropX -ne $null -or $CropY -ne $null -or $CropWidth -ne $null -or $CropHeight -ne $null
if ($hasCrop) {
  if ($CropX -eq $null -or $CropY -eq $null -or $CropWidth -eq $null -or $CropHeight -eq $null) {
    throw 'CropX, CropY, CropWidth and CropHeight must be supplied together.'
  }
  if ($CropX -lt 0 -or $CropY -lt 0 -or $CropWidth -le 0 -or $CropHeight -le 0 -or
      ($CropX + $CropWidth) -gt $sourceWidth -or ($CropY + $CropHeight) -gt $sourceHeight) {
    throw 'Crop rectangle must be positive and inside the source image.'
  }
  $originX = [int]$CropX
  $originY = [int]$CropY
  $cropWidth = [int]$CropWidth
  $cropHeight = [int]$CropHeight
} else {
  $originX = 0
  $originY = 0
  $cropWidth = $sourceWidth
  $cropHeight = $sourceHeight
}
$scale = [Math]::Min(1.0, [Math]::Min($MaxWidth / $cropWidth, $MaxHeight / $cropHeight))
$width = [Math]::Max(1, [int]($cropWidth * $scale))
$height = [Math]::Max(1, [int]($cropHeight * $scale))
$bitmap = New-Object System.Drawing.Bitmap $width, $height
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.Clear([System.Drawing.Color]::White)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$sourceRectangle = New-Object System.Drawing.Rectangle $originX, $originY, $cropWidth, $cropHeight
$targetRectangle = New-Object System.Drawing.Rectangle 0, 0, $width, $height
$graphics.DrawImage($source, $targetRectangle, $sourceRectangle, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.Dispose()
$source.Dispose()

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' } |
  Select-Object -First 1
$bytes = $null
foreach ($quality in 85, 75, 65, 55, 45, 35) {
  $encoder = [System.Drawing.Imaging.Encoder]::Quality
  $parameters = New-Object System.Drawing.Imaging.EncoderParameters 1
  $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter $encoder, $quality
  $stream = New-Object System.IO.MemoryStream
  $bitmap.Save($stream, $jpegCodec, $parameters)
  $candidate = $stream.ToArray()
  $stream.Dispose()
  $parameters.Dispose()
  if ($candidate.Length -le $MaxBytes) {
    $bytes = $candidate
    break
  }
}
$bitmap.Dispose()
if ($null -eq $bytes) {
  throw "Could not produce a preview below $MaxBytes bytes. Do not read the full image."
}
$target = [System.IO.Path]::GetFullPath($OutputPath)
[System.IO.File]::WriteAllBytes($target, $bytes)
$hasher = [System.Security.Cryptography.SHA256]::Create()
$hashStream = [System.IO.File]::OpenRead([System.IO.Path]::GetFullPath($InputPath))
try {
  $sourceSha256 = [System.BitConverter]::ToString($hasher.ComputeHash($hashStream)).Replace('-', '').ToLowerInvariant()
} finally {
  $hashStream.Dispose()
  $hasher.Dispose()
}
$estimatedEventBytes = [int]([Math]::Ceiling($bytes.Length * 4 / 3) + 32768)
$safeDimensions = $width -le 960 -and $height -le 720
$safeToRead = $bytes.Length -le 80000 -and $safeDimensions -and $estimatedEventBytes -lt 245760
[pscustomobject]@{
  input = [System.IO.Path]::GetFullPath($InputPath)
  source_sha256 = $sourceSha256
  output = $target
  source_width = $sourceWidth
  source_height = $sourceHeight
  source_region = @{
    x = $originX
    y = $originY
    width = $cropWidth
    height = $cropHeight
  }
  bytes = $bytes.Length
  width = $width
  height = $height
  estimated_event_bytes = $estimatedEventBytes
  safe_to_read = $safeToRead
} | ConvertTo-Json -Compress
