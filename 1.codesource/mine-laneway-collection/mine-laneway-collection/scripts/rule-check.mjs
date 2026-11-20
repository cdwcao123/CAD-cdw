import fs from 'node:fs'
import { validateRuleFile } from '../core/rule-validation.js'

const file = process.argv[2]
if (!file) throw new Error('Usage: node rule-check.mjs rules.json')
const rules = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
const report = validateRuleFile(rules)
console.log(JSON.stringify({ file, ...report }, null, 2))
if (!report.valid) process.exitCode = 1
