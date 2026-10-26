import * as THREE from 'three/webgpu'
import { positionLocal, time, sin, vec3, uniform, Fn, fract, floor, smoothstep, mix, dot } from 'three/tsl'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x020810)
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100)
camera.position.set(0, 2.8, 4.5)
camera.lookAt(0, 0, 0)
const renderer = new THREE.WebGPURenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
await renderer.init()
document.body.append(renderer.domElement)

const amplitude = uniform(0.18)
const frequency = uniform(8)
const speed = uniform(2)
const directionY = uniform(0)
const waveAmount = uniform(1)
const noiseAmount = uniform(0)
// three/tsl에는 snoise export가 없으므로 Day 9·10의 3D Value Noise를 사용한다.
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
const phase = positionLocal.x.mul(frequency)
  .add(positionLocal.y.mul(frequency).mul(directionY))
  .sub(time.mul(speed))
const wave = sin(phase)
const noise = noise3D(vec3(positionLocal.xy.mul(2), time.mul(speed).mul(0.15)))
const height = wave.mul(waveAmount).add(noise.mul(noiseAmount)).mul(amplitude)
const material = new THREE.MeshBasicNodeMaterial({
  color: 0x33bbff,
  wireframe: true,
  side: THREE.DoubleSide,
})
// fragment의 UV 대신 실제 로컬 정점을 변형한다. CPU의 position 배열은 그대로다.
material.positionNode = positionLocal.add(vec3(0, 0, height))
const geometry = new THREE.PlaneGeometry(3, 3, 80, 80)
const mesh = new THREE.Mesh(geometry, material)
// GPU 변형은 CPU의 bounding sphere에 반영되지 않으므로 최대 변위를 포함한다.
geometry.computeBoundingSphere()
geometry.boundingSphere.radius += 0.6
scene.add(mesh)

const controls = document.createElement('div')
controls.className = 'controls'
for (const [title, node, min, max, step] of [
  ['진폭', amplitude, 0, 0.3, 0.01],
  ['공간 주파수', frequency, 1, 16, 0.5],
  ['변화 속도', speed, 0, 4, 0.1],
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
addSelect('파동 방향', [['x', 'X 방향'], ['diagonal', '대각선 (X + Y)']], value => {
  directionY.value = value === 'diagonal' ? 5 / 8 : 0
})
addSelect('변형 방식', [['wave', '파도'], ['noise', 'Value Noise'], ['combined', '파도 + Noise']], value => {
  waveAmount.value = value === 'noise' ? 0 : 1
  noiseAmount.value = value === 'wave' ? 0 : 1
})
addSelect('표면 표시', [['wireframe', '격자'], ['surface', '면']], value => {
  material.wireframe = value === 'wireframe'
  material.needsUpdate = true
})
document.body.append(controls)
function resize() {
  const w = innerWidth, h = innerHeight
  // 줄바꿈된 메뉴와 컨트롤 사이에 표면을 배치해 작은 화면에서도 가리지 않는다.
  const top = document.querySelector('nav').getBoundingClientRect().bottom + 12
  const bottom = h - controls.getBoundingClientRect().top + 12
  const viewportHeight = Math.max(1, h - top - bottom)
  camera.aspect = w / viewportHeight
  camera.updateProjectionMatrix()
  // 좁은 화면에서도 3×3 표면 전체를 볼 수 있도록 수평 화각을 보정한다.
  const distance = 5.3 * Math.max(1, 1 / camera.aspect)
  camera.position.set(0, 2.8, 4.5).normalize().multiplyScalar(distance)
  renderer.setSize(w, h)
  renderer.setViewport(0, top, w, viewportHeight)
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
