import assert from 'node:assert/strict'
import { extractSurvey, assembleSurvey } from '../core/survey.js'
const dxf = '0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n10\n10\n20\n20\n40\n0.5\n0\nTEXT\n10\n9\n20\n20\n1\nH14\n0\nTEXT\n10\n11\n20\n20\n1\n855.231T\n0\nENDSEC\n0\nEOF\n'
const state = extractSurvey(new TextEncoder().encode(dxf))
assert.equal(state.candidates.length, 1)
const [c] = state.candidates
const name = Object.values(state.entities).find(e => e.text === 'H14')
const elev = Object.values(state.entities).find(e => e.text === '855.231T')
const selection = { candidate_id: c.id, accept: true, name_text_id: name.id, elevation_text_id: elev.id }
assert.deepEqual(assembleSurvey(state, [selection]), [{ point_name: 'H14', x: 10, y: 20, elevation: 855.231, elevation_text: '855.231T', elevation_suffix: 'T', elevation_status: 'measured' }])
assert.deepEqual(assembleSurvey(state, [{ ...selection, elevation_text_id: null }]), [{ point_name: 'H14', x: 10, y: 20, elevation: null, elevation_text: '', elevation_suffix: '', elevation_status: 'missing' }])
assert.throws(() => assembleSurvey(state, [{ ...selection, elevation_text_id: null, elevation: 123 }]), /证据/)
assert.throws(() => assembleSurvey(state, [{ ...selection, elevation_text_id: 'unknown' }]), /候选/)
assert.throws(() => assembleSurvey(state, [selection, selection]), /重复/)
assert.throws(() => assembleSurvey(state, [{ ...selection, name_text_id: null }]), /必须/)
const second = { ...c, id: 'second' }
const twoCandidates = { ...state, candidates: [c, second] }
assert.throws(() => assembleSurvey(twoCandidates, [selection, { ...selection, candidate_id: 'second' }]), /重复使用/)
assert.throws(() => assembleSurvey(state, [{ ...selection, name_text_id: elev.id }]), /格式/)
const numericState = structuredClone(state)
numericState.entities[name.id].text = '001'
assert.equal(assembleSurvey(numericState, [selection])[0].point_name, '001')
assert.throws(() => assembleSurvey(numericState, [{ ...selection, elevation_text_id: name.id }]), /不同文字证据/)
console.log('survey flow: ok')
