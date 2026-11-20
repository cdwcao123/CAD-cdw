// 最小 ZIP 读取器：用于解析 DOCX（OOXML）规则文档，不依赖第三方库。
import { inflateRawSync, crc32 } from 'node:zlib'

export class ZipReadError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ZipReadError'
    this.code = 'ZIP_READ_FAILED'
  }
}

export function readZipEntries(buffer) {
  const data = Buffer.from(buffer)
  const fail = () => { throw new ZipReadError('ZIP 结构无效或超出安全限制') }
  if (data.length < 22) fail()
  let end = -1
  for (let i = data.length - 22; i >= Math.max(0, data.length - 65557); i--) {
    if (data.readUInt32LE(i) === 0x06054b50 && i + 22 + data.readUInt16LE(i + 20) === data.length) { end = i; break }
  }
  if (end < 0 || data.readUInt16LE(end + 4) || data.readUInt16LE(end + 6)) fail()
  const count = data.readUInt16LE(end + 10), size = data.readUInt32LE(end + 12), start = data.readUInt32LE(end + 16)
  if (count !== data.readUInt16LE(end + 8) || count > 2048 || start + size !== end) fail()
  const entries = new Map(), ranges = []
  let offset = start, total = 0
  for (let i = 0; i < count; i++) {
    if (offset + 46 > end || data.readUInt32LE(offset) !== 0x02014b50) fail()
    const flags = data.readUInt16LE(offset + 8), method = data.readUInt16LE(offset + 10)
    const compressedSize = data.readUInt32LE(offset + 20), outputSize = data.readUInt32LE(offset + 24)
    const nameLength = data.readUInt16LE(offset + 28), extra = data.readUInt16LE(offset + 30), comment = data.readUInt16LE(offset + 32)
    const local = data.readUInt32LE(offset + 42), next = offset + 46 + nameLength + extra + comment
    if (next > end || !nameLength || flags & 0x41 || ![0, 8].includes(method) || outputSize > 16 * 1024 * 1024 || (total += outputSize) > 64 * 1024 * 1024) fail()
    const nameBytes = data.subarray(offset + 46, offset + 46 + nameLength)
    let name
    try { name = new TextDecoder(flags & 0x800 ? 'utf-8' : 'latin1', { fatal: true }).decode(nameBytes) } catch { fail() }
    if (entries.has(name) || name.includes('\\') || name.startsWith('/') || name.split('/').includes('..') || name.includes('\0')) fail()
    if (local + 30 > start || data.readUInt32LE(local) !== 0x04034b50 || data.readUInt16LE(local + 6) !== flags || data.readUInt16LE(local + 8) !== method) fail()
    const localNameLength = data.readUInt16LE(local + 26), localExtra = data.readUInt16LE(local + 28)
    const dataStart = local + 30 + localNameLength + localExtra, dataEnd = dataStart + compressedSize
    if (dataEnd > start || !data.subarray(local + 30, local + 30 + localNameLength).equals(nameBytes) || ranges.some(([a, b]) => local < b && dataEnd > a)) fail()
    ranges.push([local, dataEnd])
    let content
    try {
      content = method === 0 ? Buffer.from(data.subarray(dataStart, dataEnd)) : inflateRawSync(data.subarray(dataStart, dataEnd), { maxOutputLength: Math.max(1, outputSize) })
    } catch { fail() }
    if (content.length !== outputSize || crc32(content) !== data.readUInt32LE(offset + 16)) fail()
    if (!(flags & 8) && (data.readUInt32LE(local + 14) !== data.readUInt32LE(offset + 16) || data.readUInt32LE(local + 18) !== compressedSize || data.readUInt32LE(local + 22) !== outputSize)) fail()
    entries.set(name, content)
    offset = next
  }
  if (offset !== end) fail()
  return entries
}
