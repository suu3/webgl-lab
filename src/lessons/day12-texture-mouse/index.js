import * as THREE from 'three/webgpu'
import { uv, time, uniform, texture, length, smoothstep, sin, max, clamp, vec2, mix } from 'three/tsl'

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
camera.position.z = 2
const renderer = new THREE.WebGPURenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
// 로컬 이미지로 외부 이미지 서버 없이 텍스처 샘플링을 실습한다.
const imageTexture = await new THREE.TextureLoader().loadAsync(`${import.meta.env.BASE_URL}textures/sample.svg`)
imageTexture.colorSpace = THREE.SRGBColorSpace
await renderer.init()
const canvas = renderer.domElement
Object.assign(canvas.style, { position: 'fixed', touchAction: 'none' })
canvas.setAttribute('aria-label', '포인터 주변의 이미지가 물결처럼 왜곡되는 텍스처 실습')
document.body.append(canvas)

const mouse = uniform(new THREE.Vector2(-10, -10))
const radius = uniform(0.3)
const amplitude = uniform(0.015)
const frequency = uniform(60)
const speed = uniform(6)
const horizontal = uniform(0)
const motionGain = uniform(1)
const aspect = uniform(new THREE.Vector2(1.5, 1))
const baseUV = uv()
// 화면 비율을 보정해 마우스 주변 영향 범위를 원형으로 유지한다.
const delta = baseUV.sub(mouse).mul(aspect)
const dist = length(delta)
const influence = smoothstep(0, radius, dist).oneMinus()
const wave = sin(dist.mul(frequency).sub(time.mul(speed)))
const direction = mix(delta.div(max(dist, 0.001)).div(aspect), vec2(1, 0), horizontal)
const offset = direction.mul(wave).mul(amplitude).mul(influence).mul(motionGain)
const material = new THREE.MeshBasicNodeMaterial()
material.colorNode = texture(imageTexture, clamp(baseUV.add(offset), 0, 1)).rgb
const geometry = new THREE.PlaneGeometry(2, 2)
scene.add(new THREE.Mesh(geometry, material))

const controls = document.createElement('div')
controls.className = 'controls'
for (const [title, node, min, maxValue, step] of [
  ['물결 범위', radius, 0.1, 0.5, 0.01],
  ['왜곡 강도', amplitude, 0, 0.05, 0.001],
  ['공간 주파수', frequency, 10, 100, 1],
  ['변화 속도', speed, 0, 12, 0.1],
]) {
  const label = document.createElement('label')
  const caption = document.createElement('span')
  caption.textContent = `${title}: ${node.value}`
  const input = document.createElement('input')
  input.type = 'range'
  input.setAttribute('aria-label', title)
  Object.assign(input, { min, max: maxValue, step, value: node.value })
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
  for (const [value, text] of options) select.add(new Option(text, value))
  select.addEventListener('change', () => onChange(select.value))
  label.append(select)
  controls.append(label)
}
let movementMode = false
let velocity = 0
let lastPointerTime
addSelect('왜곡 방향', [['radial', '방사형'], ['horizontal', '수평 (X)']], value => {
  horizontal.value = value === 'horizontal' ? 1 : 0
})
addSelect('반응 방식', [['continuous', '계속 일렁임'], ['movement', '이동 속도 + 감쇠']], value => {
  movementMode = value === 'movement'
  velocity = 0
  motionGain.value = movementMode ? 0 : 1
})
document.body.append(controls)

function resetPointer() {
  mouse.value.set(-10, -10)
  velocity = 0
  lastPointerTime = undefined
}
function pointer(event) {
  const rect = canvas.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = 1 - (event.clientY - rect.top) / rect.height
  const now = performance.now()
  if (lastPointerTime !== undefined) {
    const dt = Math.max((now - lastPointerTime) / 1000, 1 / 120)
    const distance = Math.hypot((x - mouse.value.x) * aspect.value.x, y - mouse.value.y)
    velocity = Math.min(2, distance / dt)
  }
  lastPointerTime = now
  mouse.value.set(x, y)
}
function release(event) {
  if (event.pointerType !== 'mouse') resetPointer()
}
function resize() {
  const top = document.querySelector('nav').getBoundingClientRect().bottom + 12
  const bottom = controls.getBoundingClientRect().top - 12
  const available = Math.max(1, bottom - top)
  const width = Math.max(1, Math.min(innerWidth - 32, available * 1.5))
  const height = width / 1.5
  renderer.setSize(width, height)
  canvas.style.left = `${(innerWidth - width) / 2}px`
  canvas.style.top = `${top + (available - height) / 2}px`
  resetPointer()
}
window.addEventListener('resize', resize)
canvas.addEventListener('pointermove', pointer)
canvas.addEventListener('pointerdown', pointer)
canvas.addEventListener('pointerleave', resetPointer)
canvas.addEventListener('pointercancel', resetPointer)
canvas.addEventListener('pointerup', release)
resize()
let previousTime
renderer.setAnimationLoop(now => {
  const dt = previousTime === undefined ? 0 : Math.min((now - previousTime) / 1000, 0.1)
  previousTime = now
  motionGain.value = movementMode ? velocity : 1
  velocity *= Math.exp(-4 * dt)
  renderer.render(scene, camera)
})
import.meta.hot?.dispose(() => {
  renderer.setAnimationLoop(null)
  window.removeEventListener('resize', resize)
  canvas.removeEventListener('pointermove', pointer)
  canvas.removeEventListener('pointerdown', pointer)
  canvas.removeEventListener('pointerleave', resetPointer)
  canvas.removeEventListener('pointercancel', resetPointer)
  canvas.removeEventListener('pointerup', release)
  geometry.dispose()
  material.dispose()
  imageTexture.dispose()
  renderer.dispose()
  canvas.remove()
  controls.remove()
})
