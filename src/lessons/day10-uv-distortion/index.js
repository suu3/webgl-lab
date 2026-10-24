import * as THREE from 'three/webgpu'
import { uv, time, vec2, vec3, uniform, smoothstep, mix, Fn, fract, floor, sin, dot } from 'three/tsl'

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
camera.position.z = 2
const renderer = new THREE.WebGPURenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
await renderer.init()
document.body.append(renderer.domElement)
const strength = uniform(0.06)
const frequency = uniform(4)
const speed = uniform(0.3)
const direction = uniform(new THREE.Vector2(1, 1))
const noiseAmount = uniform(1)
const waveAmount = uniform(0)
// Day 9과 같은 3D Value Noise. snoise는 현재 three/tsl의 export가 아니다.
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
const baseUV = uv()
const p = baseUV.mul(frequency)
const t = time.mul(speed)
const nx = noise3D(vec3(p, t))
const ny = noise3D(vec3(p.add(vec2(17.4, 9.2)), t))
const wave = sin(baseUV.y.mul(20).add(t)).mul(0.03)
const offset = vec2(nx, ny).mul(strength).mul(noiseAmount)
  .add(vec2(wave.mul(waveAmount), 0)).mul(direction)
const distortedUV = baseUV.add(offset)
// 수직 줄무늬는 X좌표만 참조하므로 Y만 왜곡하면 변화가 없다.
const stripes = sin(distortedUV.x.mul(40))
const mask = smoothstep(-0.1, 0.1, stripes)
const material = new THREE.MeshBasicNodeMaterial()
material.colorNode = mix(vec3(0.02, 0.03, 0.08), vec3(0.2, 0.8, 1), mask)
const geometry = new THREE.PlaneGeometry(2, 2)
scene.add(new THREE.Mesh(geometry, material))

const controls = document.createElement('div')
controls.className = 'controls'
for (const [title, node, min, max, step] of [
  ['왜곡 강도', strength, 0, 0.15, 0.01],
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
function addSelect(title, options, onChange) {
  const label = document.createElement('label')
  label.append(title)
  const select = document.createElement('select')
  select.setAttribute('aria-label', title)
  for (const [value, text] of options) {
    const option = document.createElement('option')
    option.value = value
    option.textContent = text
    select.append(option)
  }
  select.addEventListener('change', () => onChange(select.value))
  label.append(select)
  controls.append(label)
}
addSelect('왜곡 방향', [['xy', 'X + Y'], ['x', 'X만'], ['y', 'Y만 (변화 없음)']], value => {
  direction.value.set(value === 'y' ? 0 : 1, value === 'x' ? 0 : 1)
})
addSelect('왜곡 방식', [['noise', '노이즈'], ['wave', '물결'], ['combined', '노이즈 + 물결']], value => {
  noiseAmount.value = value === 'wave' ? 0 : 1
  waveAmount.value = value === 'noise' ? 0 : 1
})
document.body.append(controls)
function resize() {
  const w = innerWidth, h = innerHeight
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
