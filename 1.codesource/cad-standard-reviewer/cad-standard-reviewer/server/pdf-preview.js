import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolvePythonRuntime } from './python-runtime.js'

export function previewPdf(bytes, python = null) {
  return new Promise(resolve => {
    const runtime = resolvePythonRuntime({ command: python, envNames: ['CAD_REVIEW_PYTHON'] })
    if (runtime.error) return resolve({ fragments: [], reason: runtime.error })
    const child = spawn(runtime.command, [...runtime.args, fileURLToPath(new URL('./pdf_extract.py', import.meta.url))], { windowsHide: true, stdio: ['pipe', 'pipe', 'ignore'], env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONDONTWRITEBYTECODE: '1' } })
    let output = '', done = false
    const finish = value => { if (done) return; done = true; clearTimeout(timer); resolve(value) }
    const timer = setTimeout(() => { child.kill(); finish({ fragments: [], reason: 'PDF 解析超时' }) }, 30000)
    child.on('error', () => finish({ fragments: [], reason: `无法启动 Python ${runtime.version}（${runtime.source}）运行 PDF 解析工具` }))
    child.stdout.on('data', chunk => { output += chunk.toString('utf8'); if (output.length > 4000000) { child.kill(); finish({ fragments: [], reason: 'PDF 提取结果超出限制' }) } })
    child.stdin.on('error', () => {})
    child.on('close', code => {
      try {
        const parsed = JSON.parse(output)
        if (code || !Array.isArray(parsed.pages)) throw new Error('invalid')
        const fragments = parsed.pages.filter(page => typeof page.text === 'string' && page.text.trim()).map(page => ({ location: { type: 'pdf-page', page: page.page }, text: page.text }))
        finish({ fragments, reason: `PDF 文本层提取：${fragments.length}/${parsed.pages.length} 页有文字；图像、扫描件、表格结构及阅读顺序可能不完整，须人工核对。` })
      } catch { finish({ fragments: [], reason: 'PDF 解析失败，文件可能损坏、加密或超出限制' }) }
    })
    child.stdin.end(bytes)
  })
}
