import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
if (!['inspect', 'draw', 'draw-points'].includes(args[0]) ||
    (args[0] === 'inspect' ? args.length !== 2 : args[0] === 'draw' ? ![3, 4].includes(args.length) : args.length !== 4)) {
  throw new Error('Usage: node dxf.mjs inspect input.dxf | draw lane-network.json new-output.dxf [reviewed-lanes.json] | draw-points lane-network.json new-output.dxf points.json')
}
const runtimeRoots = [
  process.env.RUNTIME_HOME,
  process.env.ELVESPUCK_INSTALLED_RUNTIME_HOME,
  process.env.ELVESPUCK_BUNDLED_RUNTIME_HOME,
  process.env.AGENTOS_HOME,
  process.env.ELVESPUCK_HOME,
].filter(Boolean)
const autoRuntimeRoots = []
if (process.platform === 'win32') {
  const doctorPathFile = path.join(process.env.ProgramData || 'C:\\ProgramData', 'ElvesPuck', 'bin', 'elvespuck_doctor.path')
  try {
    const installRoot = fs.readFileSync(doctorPathFile, 'utf8').trim()
    if (installRoot) {
      autoRuntimeRoots.push(
        path.join(installRoot, 'resources', 'runtimes'),
        path.join(path.dirname(installRoot), 'elvespuck-runtimes'),
        path.join(os.homedir(), 'elvespuck-runtimes'),
      )
      const bootstrapRoot = path.join(installRoot, 'resources', 'bootstrap-helper')
      if (fs.existsSync(bootstrapRoot)) {
        for (const entry of fs.readdirSync(bootstrapRoot, { withFileTypes: true })) {
          if (entry.isDirectory()) autoRuntimeRoots.push(path.join(bootstrapRoot, entry.name))
        }
      }
    }
  } catch {}
}
const orderedRuntimeRoots = [...autoRuntimeRoots, ...runtimeRoots]
const runtimeCandidates = process.platform === 'win32'
  ? orderedRuntimeRoots.flatMap(root => [
    [path.join(root, 'python', 'python.exe')],
    [path.join(root, 'python.exe')],
    [path.join(root, 'venv', 'Scripts', 'python.exe')],
  ])
  : orderedRuntimeRoots.flatMap(root => [
    [path.join(root, 'python', 'bin', 'python3')],
    [path.join(root, 'bin', 'python3')],
    [path.join(root, 'venv', 'bin', 'python')],
  ])
const candidates = process.env.MINE_DXF_PYTHON
  ? [[process.env.MINE_DXF_PYTHON]]
  : [
    ...runtimeCandidates,
    ...(process.platform === 'win32'
      ? [['py', '-3.14'], ['py', '-3.13'], ['py', '-3.12'], ['py', '-3.11'], ['py', '-3.10'], ['py', '-3'], ['python'], ['python3']]
      : [['python3.14'], ['python3.13'], ['python3.12'], ['python3.11'], ['python3.10'], ['python3'], ['python']]),
  ]
const probe = `import json,sys; print(json.dumps({"version":[sys.version_info[0],sys.version_info[1]],"executable":sys.executable}))`
const detected = candidates.map(([cmd, ...prefix]) => {
  const result = spawnSync(cmd, [...prefix, '-c', probe], { encoding: 'utf8', windowsHide: true })
  if (result.status !== 0) return null
  try {
    const value = JSON.parse(result.stdout.trim())
    return value.version[0] > 3 || value.version[0] === 3 && value.version[1] >= 10 ? { cmd, prefix, ...value } : null
  } catch {
    return null
  }
}).find(Boolean)
if (!detected) throw new Error('Python >=3.10 not found. Set MINE_DXF_PYTHON to a Python 3.10+ executable.')
const { cmd: command, prefix } = detected
const result = spawnSync(command, [...prefix, path.join(here, 'run-dxf.py'), ...args], {
  stdio: 'inherit',
  windowsHide: true,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
})
if (result.error) throw result.error
process.exitCode = result.status ?? 1
