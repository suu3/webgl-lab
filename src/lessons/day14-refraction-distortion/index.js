import * as THREE from 'three/webgpu'
import { uv, uniform, texture, length, smoothstep, clamp, vec2, vec3, mix, abs } from 'three/tsl'

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
canvas.setAttribute('aria-label', '원형 유리 렌즈로 이미지를 확대하고 축소하는 굴절 실습')
document.body.append(canvas)

const center = uniform(new THREE.Vector2(0.5, 0.5))
const strength = uniform(-0.28)
const radius = uniform(0.32)
const softness = uniform(0.1)
const rimAmount = uniform(0)
const globalMode = uniform(0)
const aspect = vec2(1.5, 1)
const baseUV = uv()
const p = baseUV.sub(center)
const d = length(p.mul(aspect))
// 제어 범위로 안쪽 경계가 바깥 반지름보다 작도록 보장한다.
const lens = smoothstep(radius.sub(softness), radius, d).oneMinus()
const mask = mix(lens, 1, globalMode)
const warpedUV = clamp(baseUV.add(p.mul(strength).mul(mask)), 0, 1)
const color = texture(imageTexture, warpedUV).rgb
const rim = smoothstep(0.008, 0.025, abs(d.sub(radius.sub(0.02)))).oneMinus()
const material = new THREE.MeshBasicNodeMaterial()
material.colorNode = mix(color, vec3(0.8, 0.95, 1), rim.mul(rimAmount).mul(0.6))
const geometry = new THREE.PlaneGeometry(2, 2)
scene.add(new THREE.Mesh(geometry, material))

const controls = document.createElement('div')
controls.className = 'controls'
for (const [title, node, min, maxValue, step] of [
  ['굴절 강도', strength, -0.5, 0.3, 0.01],
  ['렌즈 반지름', radius, 0.2, 0.45, 0.01],
  ['경계 부드러움', softness, 0.01, 0.18, 0.01],
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
let followPointer = false
addSelect('렌즈 위치', [['center', '중앙 고정'], ['pointer', '마우스 따라가기']], value => {
  followPointer = value === 'pointer'
  resetPointer()
})
addSelect('왜곡 영역', [['lens', '원형 렌즈'], ['global', '이미지 전체']], value => {
  globalMode.value = value === 'global' ? 1 : 0
})
addSelect('테두리', [['off', '없음'], ['on', '하이라이트']], value => {
  rimAmount.value = value === 'on' ? 1 : 0
})
document.body.append(controls)

function resetPointer() {
  center.value.set(0.5, 0.5)
}
function pointer(event) {
  if (!followPointer) return
  const rect = canvas.getBoundingClientRect()
  center.value.set(
    (event.clientX - rect.left) / rect.width,
    1 - (event.clientY - rect.top) / rect.height,
  )
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
renderer.setAnimationLoop(() => renderer.render(scene, camera))
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
