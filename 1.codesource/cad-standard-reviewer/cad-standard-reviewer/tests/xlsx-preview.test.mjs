import test from 'node:test'
import assert from 'node:assert/strict'
import { crc32 } from 'node:zlib'
import { previewXlsx } from '../server/xlsx-preview.js'

function zip(files) {
  const locals = [], centrals = []
  let offset = 0
  for (const [name, value] of files) {
    const filename = Buffer.from(name)
    const data = Buffer.from(value)
    const local = Buffer.alloc(30)
    const central = Buffer.alloc(46)
    local.writeUInt32LE(0x04034b50)
    local.writeUInt32LE(crc32(data), 14)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(filename.length, 26)
    central.writeUInt32LE(0x02014b50)
    central.writeUInt32LE(crc32(data), 16)
    central.writeUInt32LE(data.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(filename.length, 28)
    central.writeUInt32LE(offset, 42)
    locals.push(local, filename, data)
    centrals.push(central, filename)
    offset += local.length + filename.length + data.length
  }
  const directory = Buffer.concat(centrals)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(directory.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...locals, directory, end])
}

test('XLSX 预览提取共享字符串和工作表行位置', () => {
  const bytes = zip([
    ['xl/workbook.xml', '<workbook><sheets><sheet name="材料表" sheetId="1" r:id="rId1"/></sheets></workbook>'],
    ['xl/sharedStrings.xml', '<sst><si><t>牌号</t></si><si><t>Q235</t></si></sst>'],
    ['xl/worksheets/sheet1.xml', '<worksheet><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c></row><row r="2"><c r="A2" t="s"><v>1</v></c><c r="B2"><v>10</v></c></row></sheetData></worksheet>'],
  ])
  const preview = previewXlsx(bytes)
  assert.deepEqual(preview.fragments.map(item => item.text), ['牌号', 'Q235\t10'])
  assert.deepEqual(preview.fragments[1].location, { type: 'xlsx-sheet', sheet: '材料表', row: 2 })
})
