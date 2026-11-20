import { spawn } from 'node:child_process'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import { readZipEntries } from './zip.js'

function psString(value) {
  return `'${String(value).replaceAll("'", "''")}'`
}

export function powershellScript(kind, inputPath) {
  return `
$ErrorActionPreference = 'Stop'
$Kind = ${psString(kind)}
$InputPath = ${psString(inputPath)}
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime]
$null = [Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType=WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType=WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType=WindowsRuntime]
$null = [Windows.Storage.Streams.InMemoryRandomAccessStream, Windows.Storage.Streams, ContentType=WindowsRuntime]
function Await($operation, $type) {
  $method = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.IsGenericMethodDefinition -and $_.GetParameters().Count -eq 1 -and
    $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation\`1'
  } | Select-Object -First 1
  $task = $method.MakeGenericMethod($type).Invoke($null, @($operation))
  $task.GetAwaiter().GetResult()
}
function AwaitAction($operation) {
  $method = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and -not $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and
    $_.GetParameters()[0].ParameterType.FullName -eq 'Windows.Foundation.IAsyncAction'
  } | Select-Object -First 1
  $task = $method.Invoke($null, @($operation))
  $null = $task.GetAwaiter().GetResult()
}
try {
  $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
  if (-not $engine) { throw 'Windows OCR language unavailable' }
  $results = @()
  if ($Kind -eq 'pdf') {
    $file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($InputPath)) ([Windows.Storage.StorageFile])
    $pdf = Await ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
    $total = [int]$pdf.PageCount
    for ($i = 0; $i -lt [Math]::Min($total, 20); $i++) {
      try {
        $page = $pdf.GetPage($i)
        $stream = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
        try {
          $operation = $page.RenderToStreamAsync($stream)
          AwaitAction $operation
          $stream.Seek(0)
          $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
          $bitmap = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
          $recognized = Await ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
          $results += @{ number = $i + 1; text = $recognized.Text }
          $bitmap.Dispose()
        } finally {
          $stream.Dispose()
          $page.Dispose()
        }
      } catch {
        $results += @{ number = $i + 1; error = $_.Exception.Message }
      }
    }
  } else {
    $files = @(Get-ChildItem -LiteralPath $InputPath -File | Sort-Object Name)
    $total = $files.Count
    foreach ($item in ($files | Select-Object -First 20)) {
      try {
        $file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($item.FullName)) ([Windows.Storage.StorageFile])
        $stream = Await ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
        try {
          $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
          $bitmap = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
          $recognized = Await ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
          $results += @{ name = $item.Name; text = $recognized.Text }
          $bitmap.Dispose()
        } finally {
          $stream.Dispose()
        }
      } catch {
        $results += @{ name = $item.Name; error = $_.Exception.Message }
      }
    }
  }
  @{ results = @($results); total = $total; language = $engine.RecognizerLanguage.LanguageTag } | ConvertTo-Json -Depth 5 -Compress
} catch {
  @{ error = $_.Exception.Message } | ConvertTo-Json -Compress
  exit 1
}
`
}

export async function recognizeDocument(bytes, kind) {
  if (process.platform !== 'win32') return { fragments: [], reason: 'Windows OCR 仅在 Windows 上可用。' }
  const dir = await mkdtemp(join(tmpdir(), 'cad-review-ocr-'))
  try {
    let input = join(dir, 'input.pdf')
    const names = []
    if (kind === 'pdf') await writeFile(input, bytes)
    else if (kind === 'docx') {
      input = dir
      const entries = readZipEntries(bytes)
      for (const [name, content] of entries) {
        if (!/^word\/media\/[^/]+\.(png|jpe?g|bmp|tiff?)$/i.test(name)) continue
        const local = `${String(names.length).padStart(4, '0')}.${name.split('.').at(-1).toLowerCase()}`
        names.push(basename(name))
        await writeFile(join(dir, local), content)
      }
      if (!names.length) return { fragments: [], reason: 'DOCX 中没有可识别的 PNG、JPEG、BMP 或 TIFF 图片。' }
    } else throw new Error('unsupported OCR format')
    const result = await new Promise(resolve => {
      const script = powershellScript(kind, input)
      const encoded = Buffer.from(script, 'utf16le').toString('base64')
      const child = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', encoded], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
      const chunks = []
      const errorChunks = []
      let size = 0
      let done = false
      const finish = value => {
        if (done) return
        done = true
        clearTimeout(timer)
        resolve(value)
      }
      const timer = setTimeout(() => {
        child.kill()
        finish(null)
      }, 120000)
      child.on('error', () => finish(null))
      child.stderr.on('data', chunk => errorChunks.push(chunk))
      child.stdout.on('data', chunk => {
        size += chunk.length
        if (size > 4000000) {
          child.kill()
          finish(null)
        } else chunks.push(chunk)
      })
      child.on('close', code => {
        try {
          const value = JSON.parse(Buffer.concat(chunks).toString('utf8'))
          value.exitCode = code
          finish(value)
        } catch {
          finish({ error: `OCR 进程退出码 ${code}：${Buffer.concat(errorChunks).toString('utf8').trim().slice(0, 240)}` })
        }
      })
    })
    if (result?.error) return { fragments: [], reason: `Windows OCR 失败：${String(result.error).slice(0, 240)}` }
    if (!result || !Array.isArray(result.results)) return { fragments: [], reason: 'Windows OCR 不可用或识别失败；请检查 Windows 识别语言和文件。' }
    const fragments = result.results
      .filter(item => typeof item.text === 'string' && item.text.trim())
      .map(item => ({
        location: kind === 'pdf' ? { type: 'pdf-ocr', page: item.number } : { type: 'docx-image-ocr', image: names[Number.parseInt(item.name, 10)] || item.name },
        text: item.text,
        method: 'ocr',
      }))
    const failures = result.results.filter(item => item.error).length
    return { fragments, reason: `Windows OCR（${result.language}）：处理 ${result.results.length}/${result.total} 页或图片，${failures} 个失败；最多处理 20 项，识别可能有误或遗漏，须核对原件。${result.exitCode ? 'OCR 进程退出异常，结果仅供预览。' : ''}` }
  } catch {
    return { fragments: [], reason: 'OCR 输入无法读取或文件超出安全限制。' }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}
