import { Fn, fract, sin, dot, vec3, floor, smoothstep, mix, float } from 'three/tsl'

// Day 9와 같은 signed 3D Value Noise. 이 릴리스에는 snoise export가 없다.
const random = Fn(([p]) => fract(sin(dot(p, vec3(127.1, 311.7, 74.7))).mul(43758.5453)))
export const noise3D = Fn(([p]) => {
  const i = floor(p), f = fract(p), w = smoothstep(0, 1, f)
  const a = mix(mix(random(i), random(i.add(vec3(1, 0, 0))), w.x), mix(random(i.add(vec3(0, 1, 0))), random(i.add(vec3(1, 1, 0))), w.x), w.y)
  const b = mix(mix(random(i.add(vec3(0, 0, 1))), random(i.add(vec3(1, 0, 1))), w.x), mix(random(i.add(vec3(0, 1, 1))), random(i.add(vec3(1, 1, 1))), w.x), w.y)
  return mix(a, b, w.z).mul(2).sub(1)
})
export function fbm(p, t, octaves = 4, turbulence = float(0)) {
  let sum = float(0), weight = 0
  for (let i = 0; i < octaves; i++) {
    const n = noise3D(vec3(p.mul(2 ** i), t))
    const amplitude = 0.5 ** (i + 1)
    sum = sum.add(mix(n, n.abs(), turbulence).mul(amplitude))
    weight += amplitude
  }
  return { sum, weight }
}
