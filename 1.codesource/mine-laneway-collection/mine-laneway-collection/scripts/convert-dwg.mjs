import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import createModule from '../runtime/libredwg-web.mjs'

const [input, output] = process.argv.slice(2)
if (!input || !output || !/\.dwg$/i.test(input) || !/\.dxf$/i.test(output)) throw new Error('Usage: node convert-dwg.mjs input.dwg new-output.dxf')
const mod = await createModule({ locateFile: () => fileURLToPath(new URL('../runtime/libredwg-web.wasm', import.meta.url)), print: () => {}, printErr: () => {} })
try {
  mod.FS.writeFile('/input.dwg', fs.readFileSync(input))
  const decoded = mod.dwg_read_file('/input.dwg')
  if (!decoded.data || (decoded.error & 0x3f80)) {
    if (decoded.data) mod.dwg_free(decoded.data)
    throw new Error(`DWG read failed: ${decoded.error}`)
  }
  const count = mod.dwg_get_num_entities(decoded.data)
  mod.dwg_free(decoded.data)
  const code = mod.dwg_write_dxf('/input.dwg', '/output.dxf')
  if (code !== 0 || !mod.FS.analyzePath('/output.dxf').exists) throw new Error(`DXF conversion failed: ${code}`)
  fs.writeFileSync(output, mod.FS.readFile('/output.dxf'), { flag: 'wx' })
  console.log(JSON.stringify({ source_entities: count, read_warning: decoded.error, output }))
} finally {
  for (const name of ['/input.dwg', '/output.dxf']) if (mod.FS.analyzePath(name).exists) mod.FS.unlink(name)
}
