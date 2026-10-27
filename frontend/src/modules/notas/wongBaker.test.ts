import test from 'node:test'
import assert from 'node:assert/strict'

import {
  appendWongBakerMarker,
  extractWongBakerScore,
  removeWongBakerMarker,
  WONG_BAKER_FACES,
} from './wongBaker.ts'

test('Wong-Baker scale retains the six standard even-numbered scores and meanings', () => {
  assert.deepEqual(WONG_BAKER_FACES.map(face => face.score), [0, 2, 4, 6, 8, 10])
  assert.deepEqual(WONG_BAKER_FACES.map(face => face.meaning), [
    'No duele',
    'Duele un poco',
    'Duele un poco más',
    'Duele aún más',
    'Duele mucho',
    'El peor dolor',
  ])
})

test('Wong-Baker score round-trips without exposing its marker in the plan text', () => {
  const plan = 'Continuar analgesia según indicación.'
  const storedPlan = appendWongBakerMarker(plan, 8)

  assert.equal(extractWongBakerScore(storedPlan), 8)
  assert.equal(removeWongBakerMarker(storedPlan), plan)
})

test('Wong-Baker marker can be cleared and legacy plan text stays unchanged', () => {
  const storedPlan = appendWongBakerMarker('Plan manual', 4)

  assert.equal(appendWongBakerMarker(storedPlan, null), 'Plan manual')
  assert.equal(extractWongBakerScore('Plan manual'), null)
  assert.equal(removeWongBakerMarker('Plan manual'), 'Plan manual')
})
