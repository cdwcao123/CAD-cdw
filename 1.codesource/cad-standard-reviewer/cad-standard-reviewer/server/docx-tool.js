import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { readZipEntries } from './zip.js'
import { resolvePythonRuntime } from './python-runtime.js'

export function extractDocxWithTool(bytes, python = null) {
  try { readZipEntries(bytes) } catch { return Promise.resolve(null) }
  return new Promise(resolve => {
    const runtime = resolvePythonRuntime({ command: python, envNames: ['CAD_REVIEW_DOCX_PYTHON'] })
    if (runtime.error) return resolve(null)
    const child = spawn(runtime.command, [...runtime.args, fileURLToPath(new URL('./docx_extract.py', import.meta.url))], { windowsHide: true, stdio: ['pipe', 'pipe', 'ignore'], env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONDONTWRITEBYTECODE: '1' } })
    let output = '', done = false
    const finish = value => { if (done) return; done = true; clearTimeout(timer); resolve(value) }
    const timer = setTimeout(() => { child.kill(); finish(null) }, 30000)
    child.on('error', () => finish(null))
    child.stdin.on('error', () => {})
    child.stdout.on('data', chunk => { output += chunk.toString('utf8'); if (output.length > 4000000) { child.kill(); finish(null) } })
    child.on('close', code => {
      try {
        const result = JSON.parse(output)
        if (code || !Array.isArray(result.fragments)) throw new Error('invalid')
        finish({ fragments: result.fragments, reason: 'OOXML 解析器提取正文、嵌套表格、页眉页脚及批注；复杂修订、公式、精确页码和图形关系可能不完整，须人工核对。', parser: `Python ${runtime.version} stdlib` })
      } catch { finish(null) }
    })
    child.stdin.end(bytes)
  })
}
