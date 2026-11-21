import { test } from 'node:test'
import assert from 'node:assert/strict'
import { curl, scalarField, wrap, advanceCPU } from './particle-math.js'

test('curl is perpendicular to the scalar field gradient', () => {
  const x = 0.31, y = -0.47, e = 0.01
  const dx = (scalarField(x + e, y) - scalarField(x - e, y)) / (2 * e)
  const dy = (scalarField(x, y + e) - scalarField(x, y - e)) / (2 * e)
  const f = curl(x, y)
  assert.ok(Math.abs(dx * f.x + dy * f.y) < 1e-10)
  assert.ok(Math.hypot(f.x, f.y) > 0.01)
})
test('wrap handles both boundaries and preserves overshoot', () => {
  assert.ok(Math.abs(wrap(1.1) + 0.9) < 1e-10)
  assert.ok(Math.abs(wrap(-1.1) - 0.9) < 1e-10)
  assert.ok(Math.abs(wrap(5.1) + 0.9) < 1e-10)
})
test('advection uses current position and elapsed time; pause keeps state', () => {
  const p = new Float32Array([0.3, -0.2, 0])
  advanceCPU(p, 0, 0.25)
  assert.deepEqual([...p], [Math.fround(0.3), Math.fround(-0.2), 0])
  const start = [...p]
  advanceCPU(p, 0.02, 0.25)
  assert.ok(Math.abs(Math.hypot(p[0] - start[0], p[1] - start[1]) - 0.005) < 1e-6)
})
