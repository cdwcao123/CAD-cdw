import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { analyzeDxfBuffer } from '../server/analyze.js'
import { normalizeRuleSet } from '../server/rule-import.js'
import { parseLibraryFile } from '../server/library-import.js'

const DATA_DIR = process.env.CAD_RULE_TEST_DATA || 'E:/国睿/测试数据'
const COMPLIANT = `${DATA_DIR}/GW-2026-001_支架组件_A2_合规版.dxf`
const RULE_SET = normalizeRuleSet(JSON.parse(readFileSync(new URL('../rules/v1.json', import.meta.url), 'utf8')), { sourceType: 'test', fileName: 'v1.json' })
const LIBRARIES = {
  material: parseLibraryFile(readFileSync(new URL('../libraries/materials-gb.json', import.meta.url)), 'materials.json').library,
  tolerance: parseLibraryFile(readFileSync(new URL('../libraries/tolerances-gb.json', import.meta.url)), 'tolerances.json').library,
}

function toPairs(text) {
  const lines = text.split(/\r?\n/)
  const pairs = []
  for (let index = 0; index + 1 < lines.length; index += 2) {
    const code = Number.parseInt(lines[index].trim(), 10)
    if (!Number.isFinite(code)) continue
    pairs.push([code, lines[index + 1]])
  }
  return pairs
}

function toRecords(pairs) {
  const records = []
  let current = { type: '', pairs: [] }
  for (const [code, value] of pairs) {
    if (code === 0) {
      if (current.type || current.pairs.length) records.push(current)
      current = { type: value.trim(), pairs: [] }
    } else {
      current.pairs.push([code, value])
    }
  }
  if (current.type || current.pairs.length) records.push(current)
  return records
}

function toText(records) {
  const lines = []
  for (const record of records) {
    lines.push('0', record.type)
    for (const [code, value] of record.pairs) lines.push(String(code), String(value))
  }
  lines.push('0', 'EOF')
  return lines.join('\n')
}

function one(record, code, fallback = undefined) {
  const found = record.pairs.find(item => item[0] === code)
  return found ? found[1] : fallback
}

function setOne(record, code, value) {
  const item = record.pairs.find(entry => entry[0] === code)
  if (item) item[1] = String(value)
  else record.pairs.push([code, String(value)])
}

function textRecord(records, value, near = null, tolerance = 1) {
  const found = records.find(record => {
    if (record.type !== 'TEXT') return false
    if (String(one(record, 1, '')).replace(/\s+/g, ' ').trim() !== value) return false
    if (!near) return true
    const x = Number.parseFloat(one(record, 10, 'NaN'))
    const y = Number.parseFloat(one(record, 20, 'NaN'))
    return Math.abs(x - near[0]) <= tolerance && Math.abs(y - near[1]) <= tolerance
  })
  if (!found) throw new Error(`找不到文字「${value}」`)
  return found
}

function setText(records, value, next, near) {
  const record = textRecord(records, value, near)
  setOne(record, 1, next)
}

function setTextHeight(records, value, height, near) {
  const record = textRecord(records, value, near)
  setOne(record, 40, height)
}

function removeRecord(records, predicate) {
  const index = records.findIndex(record => predicate(record))
  if (index < 0) throw new Error('找不到待删除实体')
  records.splice(index, 1)
}

function lineRecord(records, x0, y0, x1, y1, tolerance = 1) {
  const found = records.find(
    record =>
      record.type === 'LINE' &&
      Math.abs(Number(one(record, 10, 'NaN')) - x0) <= tolerance &&
      Math.abs(Number(one(record, 20, 'NaN')) - y0) <= tolerance &&
      Math.abs(Number(one(record, 11, 'NaN')) - x1) <= tolerance &&
      Math.abs(Number(one(record, 21, 'NaN')) - y1) <= tolerance
  )
  if (!found) throw new Error(`找不到线段 ${x0},${y0} -> ${x1},${y1}`)
  return found
}

function polyline(records, layer, y0, tolerance = 0.5) {
  const found = records.find(record => {
    if (record.type !== 'LWPOLYLINE' || one(record, 8) !== layer) return false
    const ys = record.pairs.filter(item => item[0] === 20).map(item => Number.parseFloat(item[1]))
    return ys.length && Math.min(...ys) >= y0 - tolerance
  })
  if (!found) throw new Error(`找不到图层 ${layer} 的多段线`)
  return found
}

function analyze(records) {
  return analyzeDxfBuffer(Buffer.from(toText(records), 'utf8'), {
    fileName: 'mutated.dxf',
    useLlm: false,
    ruleSet: RULE_SET,
    libraries: LIBRARIES,
  })
}

const baseRecords = toRecords(toPairs(readFileSync(COMPLIANT, 'utf8')))

test('基线：合规版保持不变时 0 命中', () => {
  const result = analyze(structuredClone(baseRecords))
  assert.equal(result.findings.length, 0)
  assert.equal(result.verdict.label, '符合')
})

const cases = [
  {
    checkpoint: 'D01',
    name: '图框左边距 25→15',
    apply(records) {
      const frame = polyline(records, 'FRAME', 5)
      for (const item of frame.pairs) {
        if (item[0] === 10 && Math.abs(Number(item[1]) - 25) < 0.5) item[1] = '15'
      }
    },
  },
  {
    checkpoint: 'D02',
    name: '版次值清空',
    apply(records) {
      setText(records, '版次 A', '版次', [509, 7.8])
    },
  },
  {
    checkpoint: 'D03',
    name: '张次清空',
    apply(records) {
      setText(records, '共 1 张 第 1 张', '', [587, 7.8])
    },
  },
  {
    checkpoint: 'D04',
    name: '标准化签署清空',
    apply(records) {
      setText(records, '赵敏', '', [428, 31.6])
    },
  },
  {
    checkpoint: 'D05',
    name: '阶段标记清空',
    apply(records) {
      setText(records, 'S', '', [421.5, 16])
    },
  },
  {
    checkpoint: 'D06',
    name: '图样名称字高 5→2.5',
    apply(records) {
      setTextHeight(records, '支架组件', 2.5, [544, 40])
    },
  },
  {
    checkpoint: 'D07',
    name: '比例 1:1→1:2',
    apply(records) {
      setText(records, '比例 1:1', '比例 1:2', [473, 16])
    },
  },
  {
    checkpoint: 'D08',
    name: '材料 45→45#',
    apply(records) {
      setText(records, '45', '45#', [531, 71.4])
    },
  },
  {
    checkpoint: 'D09',
    name: '件号 4 改为 9（漏标 4）',
    apply(records) {
      setText(records, '4', '9', [270, 120])
    },
  },
  {
    checkpoint: 'D10',
    name: '件号 6 改为 3（重复 3）',
    apply(records) {
      setText(records, '6', '3', [270, 136])
    },
  },
  {
    checkpoint: 'D11',
    name: '件号 2 指引线圆点删除',
    apply(records) {
      removeRecord(records, record => {
        if (record.type !== 'CIRCLE') return false
        const cx = Number(one(record, 10, 'NaN'))
        const cy = Number(one(record, 20, 'NaN'))
        const r = Number(one(record, 40, 'NaN'))
        return Math.abs(cx - 75) < 0.6 && Math.abs(cy - 350) < 0.6 && r < 1
      })
    },
  },
  {
    checkpoint: 'D12',
    name: '底板轮廓 OUTLINE→THIN',
    apply(records) {
      const plate = records.find(record => {
        if (record.type !== 'LWPOLYLINE' || one(record, 8) !== 'OUTLINE') return false
        const ys = record.pairs.filter(item => item[0] === 20).map(item => Number.parseFloat(item[1]))
        return ys.length && Math.min(...ys) === 280 && Math.max(...ys) === 300
      })
      if (!plate) throw new Error('找不到底板轮廓')
      setOne(plate, 8, 'THIN')
    },
  },
  {
    checkpoint: 'D13',
    name: '左立柱轴线 CENTER→THIN',
    apply(records) {
      const line = lineRecord(records, 95, 274, 95, 388)
      setOne(line, 8, 'THIN')
    },
  },
  {
    checkpoint: 'D14',
    name: '技术要求正文 3.5→2.5',
    apply(records) {
      setTextHeight(records, '1. 未注圆角 R2～R3，未注倒角 C1。', 2.5, [45, 102])
    },
  },
  {
    checkpoint: 'D15',
    name: '竖直尺寸 100 数字旋转 90→0',
    apply(records) {
      const record = textRecord(records, '100', [265.2, 330])
      setOne(record, 50, 0)
    },
  },
  {
    checkpoint: 'D16',
    name: '中心距 130 两端尺寸界线删除',
    apply(records) {
      removeRecord(records, record => record.type === 'LINE' && Math.abs(Number(one(record, 10, 'NaN')) - 95) < 0.6 && Math.abs(Number(one(record, 20, 'NaN')) - 279) < 0.6)
      removeRecord(records, record => record.type === 'LINE' && Math.abs(Number(one(record, 10, 'NaN')) - 225) < 0.6 && Math.abs(Number(one(record, 20, 'NaN')) - 279) < 0.6)
    },
  },
  {
    checkpoint: 'D17',
    name: '直径 φ40→40',
    apply(records) {
      setText(records, 'φ40', '40', [61, 394.8])
    },
  },
  {
    checkpoint: 'D18',
    name: '配合 H7/k6→h7/K6',
    apply(records) {
      setText(records, 'φ30 H7/k6', 'φ30 h7/K6', [411, 341])
    },
  },
  {
    checkpoint: 'D19',
    name: '同轴度框格去掉一格（少基准格）',
    apply(records) {
      removeRecord(
        records,
        record =>
          record.type === 'LINE' &&
          Math.abs(Number(one(record, 10, 'NaN')) - 425.1) < 0.6 &&
          Number(one(record, 20, 'NaN')) <= 328.5 &&
          Number(one(record, 21, 'NaN')) >= 334.5
      )
    },
  },
  {
    checkpoint: 'D20',
    name: '垂直度框格高度 7→5',
    apply(records) {
      const frame = records.find(record => {
        if (record.type !== 'LWPOLYLINE' || one(record, 8) !== 'DIM') return false
        const ys = record.pairs.filter(item => item[0] === 20).map(item => Number.parseFloat(item[1]))
        return ys.length && Math.min(...ys) >= 363 && Math.max(...ys) >= 370
      })
      if (!frame) throw new Error('找不到垂直度框格')
      for (const item of frame.pairs) {
        if (item[0] === 20 && Math.abs(Number(item[1]) - 371) < 0.5) item[1] = '369'
      }
    },
  },
  {
    checkpoint: 'D21',
    name: '粗糙度 Ra 6.3→6.3',
    apply(records) {
      setText(records, 'Ra 6.3', '6.3', [345.225, 357.225])
    },
  },
  {
    checkpoint: 'D22',
    name: '统一注法「其余 Ra 12.5」→「12.5」',
    apply(records) {
      setText(records, '其余 Ra 12.5', '12.5', [498, 394.5])
    },
  },
]

for (const item of cases) {
  test(`规则链路：${item.checkpoint} ${item.name}`, () => {
    const records = structuredClone(baseRecords)
    item.apply(records)
    const result = analyze(records)
    assert.ok(
      result.findings.some(finding => finding.checkpoint === item.checkpoint),
      `未命中 ${item.checkpoint}，实际命中：${result.findings.map(f => f.checkpoint || f.ruleId).join(',')}`
    )
  })
}
