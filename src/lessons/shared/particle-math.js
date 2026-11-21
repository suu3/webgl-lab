export function scalarField(x, y) {
  return Math.sin(x * 2.1 + Math.cos(y * 1.7)) * Math.cos(y * 1.9 - Math.sin(x * 1.3))
}
export function curl(x, y, e = 0.01) {
  const dx = (scalarField(x + e, y) - scalarField(x - e, y)) / (2 * e)
  const dy = (scalarField(x, y + e) - scalarField(x, y - e)) / (2 * e)
  return { x: dy, y: -dx }
}
export function wrap(value) { return ((value + 1) % 2 + 2) % 2 - 1 }
export function advanceCPU(positions, delta, speed, respawn = false, random = Math.random) {
  for (let i = 0; i < positions.length; i += 3) {
    const f = curl(positions[i], positions[i + 1])
    const len = Math.hypot(f.x, f.y)
    if (len < 0.0001) continue
    let x = positions[i] + f.x / len * speed * delta
    let y = positions[i + 1] + f.y / len * speed * delta
    if (respawn && (Math.abs(x) > 1 || Math.abs(y) > 1)) {
      x = random() * 2 - 1; y = random() * 2 - 1
    }
    positions[i] = wrap(x)
    positions[i + 1] = wrap(y)
  }
}
