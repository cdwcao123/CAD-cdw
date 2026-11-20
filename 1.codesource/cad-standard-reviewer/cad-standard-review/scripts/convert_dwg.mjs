#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const [input, output, runtime, wasm] = process.argv.slice(2);
if (!input || !output || !runtime || !wasm || process.argv.length !== 6 ||
    path.extname(input).toLowerCase() !== '.dwg' || path.extname(output).toLowerCase() !== '.dxf') {
  console.error('Usage: node convert_dwg.mjs input.dwg new-output.dxf runtime.mjs runtime.wasm');
  process.exit(2);
}
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
try {
  const bytes = fs.readFileSync(input);
  const runtimePath = fs.realpathSync(runtime);
  const wasmPath = fs.realpathSync(wasm);
  const warnings = [];
  const { default: create } = await import(pathToFileURL(runtimePath).href);
  const mod = await create({ locateFile: () => wasmPath, print: s => warnings.push(String(s)), printErr: s => warnings.push(String(s)) });
  mod.FS.writeFile('/input.dwg', bytes);
  const status = mod.dwg_write_dxf('/input.dwg', '/output.dxf');
  if (status !== 0) throw new Error(`DWG conversion failed with status ${status}: ${warnings.join('; ')}`);
  const result = mod.FS.readFile('/output.dxf');
  if (!result.length) throw new Error('DWG converter returned an empty DXF');
  fs.writeFileSync(output, result, { flag: 'wx' });
  console.log(JSON.stringify({ input: fs.realpathSync(input), input_sha256: hash(bytes), output: path.resolve(output), output_sha256: hash(result), runtime: runtimePath, runtime_sha256: hash(fs.readFileSync(runtimePath)), wasm: wasmPath, wasm_sha256: hash(fs.readFileSync(wasmPath)), node: process.version, status, warnings, limitations: ['Conversion fidelity is not verified; compare layers, text, layouts and entities against the original DWG.', 'Blocks, external references, proxy and proprietary entities may be lost or changed.'] }, null, 2));
} catch (error) {
  console.error(`Conversion failed: ${error.message}`);
  process.exitCode = 1;
}
