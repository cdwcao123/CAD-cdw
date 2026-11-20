import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'

const MINIMUM = [3, 10]
const cache = new Map()

function versionParts(value) {
  return String(value || '').split('.').slice(0, 2).map(Number)
}

export function isSupportedPythonVersion(value) {
  const [major, minor] = versionParts(value)
  return Number.isInteger(major) && Number.isInteger(minor) &&
    (major > MINIMUM[0] || (major === MINIMUM[0] && minor >= MINIMUM[1]))
}

function probe(command, args = []) {
  try {
    const result = spawnSync(command, [...args, '-c', 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")'], {
      encoding: 'utf8',
      windowsHide: true,
      timeout: 2500,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONDONTWRITEBYTECODE: '1' },
    })
    if (result.status !== 0) return null
    const version = String(result.stdout || '').trim()
    return isSupportedPythonVersion(version) ? { command, args, version } : null
  } catch {
    return null
  }
}

function clientPythonCandidates() {
  const roots = [
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'share', 'elvespuck', 'runtime', 'dependencies', 'python-venv'),
    process.env.USERPROFILE && path.join(process.env.USERPROFILE, '.local', 'share', 'elvespuck', 'runtime', 'dependencies', 'python-venv'),
  ].filter(Boolean)
  const candidates = []
  const seen = new Set()
  for (const root of roots) {
    if (seen.has(root) || !existsSync(root)) continue
    seen.add(root)
    let versions = []
    try { versions = readdirSync(root, { withFileTypes: true }).filter(entry => entry.isDirectory() && /^\d+\.\d+$/.test(entry.name)).map(entry => entry.name) }
    catch { continue }
    versions.sort((a, b) => {
      if (a === '3.12') return -1
      if (b === '3.12') return 1
      const left = versionParts(a), right = versionParts(b)
      return right[0] - left[0] || right[1] - left[1]
    })
    for (const version of versions) {
      const executable = path.join(root, version, 'Scripts', process.platform === 'win32' ? 'python.exe' : 'python')
      if (existsSync(executable)) candidates.push({ command: executable, args: [] })
    }
  }
  return candidates
}

export function resolvePythonRuntime(options = {}) {
  const envNames = options.envNames || ['CAD_REVIEW_PYTHON']
  const overrides = envNames.map(name => process.env[name]).filter(Boolean)
  const explicit = options.command ? String(options.command) : null
  const key = JSON.stringify([options.platform || process.platform, overrides, explicit])
  if (cache.has(key)) return cache.get(key)
  const requested = explicit || overrides[0] || null
  if (requested) {
    const runtime = probe(requested, [])
    if (runtime) {
      const value = { ...runtime, source: 'override' }
      cache.set(key, value)
      return value
    }
    const value = { error: `指定的 Python“${requested}”不可用或版本低于 3.10` }
    cache.set(key, value)
    return value
  }
  const clientCandidates = clientPythonCandidates()
  const candidates = [
    ...clientCandidates,
    { command: 'python', args: [] },
    { command: 'python3', args: [] },
    { command: 'py', args: ['-3'] },
  ]
  for (const candidate of candidates) {
    const runtime = probe(candidate.command, candidate.args)
    if (runtime) {
      const value = { ...runtime, source: clientCandidates.some(item => item.command === candidate.command) ? 'agentos' : 'user' }
      cache.set(key, value)
      return value
    }
  }
  const value = { error: '未找到可用的 Python 3.10 或更高版本；不会使用低于 3.10 的环境' }
  cache.set(key, value)
  return value
}

export function resetPythonRuntimeCache() {
  cache.clear()
}
