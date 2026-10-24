import * as THREE from 'three/webgpu'
import { uv, time, float, vec3, uniform, smoothstep, mix, Fn, fract, floor, sin, dot } from 'three/tsl'

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
camera.position.z = 2
const renderer = new THREE.WebGPURenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
await renderer.init()
document.body.append(renderer.domElement)
const aspect = uniform(new THREE.Vector2(1, 1))
const strength = uniform(0.04)
const frequency = uniform(5)
const speed = uniform(0.3)
const p = uv().sub(0.5).mul(aspect)

// 3D Value Noise: 격자점의 값을 부드럽게 보간한다.
// Simplex Noise와는 다른 알고리즘이며 fragment.glsl과 같은 계산이다.
const randomValue = Fn(([point]) => fract(sin(dot(point, vec3(127.1, 311.7, 74.7))).mul(43758.5453)))
const noise3D = Fn(([point]) => {
  const i = floor(point)
  const f = fract(point)
  const w = smoothstep(0, 1, f)
  const z0 = mix(
    mix(randomValue(i), randomValue(i.add(vec3(1, 0, 0))), w.x),
    mix(randomValue(i.add(vec3(0, 1, 0))), randomValue(i.add(vec3(1, 1, 0))), w.x), w.y)
  const z1 = mix(
    mix(randomValue(i.add(vec3(0, 0, 1))), randomValue(i.add(vec3(1, 0, 1))), w.x),
    mix(randomValue(i.add(vec3(0, 1, 1))), randomValue(i.add(vec3(1, 1, 1))), w.x), w.y)
  return mix(z0, z1, w.z).mul(2).sub(1)
})
// x·y는 위치별 변형, z는 시간에 따른 연속적인 변화를 만든다.
const noisePosition = vec3(p.add(0.5).mul(frequency), time.mul(speed))
const n = noise3D(noisePosition)
const radius = float(0.3).add(n.mul(strength))
const mask = float(1).sub(smoothstep(0.008, 0.018, p.length().sub(radius).abs()))
const material = new THREE.MeshBasicNodeMaterial()
material.colorNode = mix(vec3(0.01, 0.02, 0.05), vec3(0.2, 0.8, 1), mask)
const geometry = new THREE.PlaneGeometry(2, 2)
scene.add(new THREE.Mesh(geometry, material))

const controls = document.createElement('div')
controls.className = 'controls'
for (const [title, node, min, max, step] of [
  ['노이즈 강도', strength, 0, 0.1, 0.01],
  ['변화 속도', speed, 0, 2, 0.1],
  ['공간 주파수', frequency, 1, 15, 0.5],
]) {
  const label = document.createElement('label')
  const caption = document.createElement('span')
  caption.textContent = `${title}: ${node.value}`
  const input = document.createElement('input')
  input.type = 'range'
  input.setAttribute('aria-label', title)
  Object.assign(input, { min, max, step, value: node.value })
  input.addEventListener('input', () => {
    node.value = Number(input.value)
    caption.textContent = `${title}: ${node.value}`
  })
  label.append(caption, input)
  controls.append(label)
}
document.body.append(controls)
function resize() {
  const w = innerWidth, h = innerHeight, side = Math.min(w, h)
  aspect.value.set(w / side, h / side)
  renderer.setSize(w, h)
}
window.addEventListener('resize', resize)
resize()
renderer.setAnimationLoop(() => renderer.render(scene, camera))
import.meta.hot?.dispose(() => {
  renderer.setAnimationLoop(null)
  window.removeEventListener('resize', resize)
  geometry.dispose()
  material.dispose()
  renderer.dispose()
  renderer.domElement.remove()
  controls.remove()
})
