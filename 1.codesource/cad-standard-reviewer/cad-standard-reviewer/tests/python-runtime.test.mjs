import test from 'node:test'
import assert from 'node:assert/strict'
import { isSupportedPythonVersion, resolvePythonRuntime } from '../server/python-runtime.js'

test('Python 运行时最低版本为 3.10', () => {
  assert.equal(isSupportedPythonVersion('3.9'), false)
  assert.equal(isSupportedPythonVersion('3.10'), true)
  assert.equal(isSupportedPythonVersion('3.11'), true)
  assert.equal(isSupportedPythonVersion('3.14'), true)
  assert.equal(isSupportedPythonVersion('invalid'), false)
})

test('自动运行时选择可用的 Python 3.10 以上版本', t => {
  const runtime = resolvePythonRuntime({ envNames: ['CAD_REVIEW_TEST_UNSET_PYTHON'] })
  if (runtime.error) return t.skip(runtime.error)
  assert.equal(isSupportedPythonVersion(runtime.version), true)
  assert.ok(['agentos', 'user'].includes(runtime.source))
})
