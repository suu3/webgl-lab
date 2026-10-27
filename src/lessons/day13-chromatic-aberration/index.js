import * as THREE from 'three/webgpu'
import { uv, uniform, texture, length, smoothstep, max, clamp, vec2, vec3, mix } from 'three/tsl'

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
canvas.setAttribute('aria-label', 'RGB 채널을 분리하는 색수차 실습')
document.body.append(canvas)

const mouse = uniform(new THREE.Vector2(-10, -10))
const amplitude = uniform(0.012)
const edgeStart = uniform(0.1)
const edgeEnd = uniform(0.65)
const radius = uniform(0.25)
const horizontal = uniform(0)
const pointerMode = uniform(0)
const baseUV = uv()
const center = mix(vec2(0.5), mouse, pointerMode)
const p = baseUV.sub(center)
const dist = length(p)
const direction = mix(p.div(max(dist, 0.001)), vec2(1, 0), horizontal)
const edgeMask = smoothstep(edgeStart, edgeEnd, dist)
const pointerMask = smoothstep(0, radius, dist).oneMinus()
const strength = mix(edgeMask, pointerMask, pointerMode).mul(amplitude)
const offset = direction.mul(strength)
const uvR = clamp(baseUV.add(offset), 0, 1)
const uvB = clamp(baseUV.sub(offset), 0, 1)
const material = new THREE.MeshBasicNodeMaterial()
// 같은 텍스처를 세 번 읽고 각 샘플의 R, G, B만 조합한다.
material.colorNode = vec3(
  texture(imageTexture, uvR).r,
  texture(imageTexture, baseUV).g,
  texture(imageTexture, uvB).b,
)
const geometry = new THREE.PlaneGeometry(2, 2)
scene.add(new THREE.Mesh(geometry, material))

const controls = document.createElement('div')
controls.className = 'controls'
for (const [title, node, min, maxValue, step] of [
  ['색수차 강도', amplitude, 0, 0.04, 0.001],
  ['시작 거리', edgeStart, 0, 0.3, 0.01],
  ['최대 거리', edgeEnd, 0.35, 0.8, 0.01],
  ['포인터 범위', radius, 0.1, 0.5, 0.01],
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
addSelect('분리 방향', [['radial', '방사형'], ['horizontal', '수평 (X)']], value => {
  horizontal.value = value === 'horizontal' ? 1 : 0
})
addSelect('적용 영역', [['edge', '이미지 가장자리'], ['pointer', '마우스 주변']], value => {
  pointerMode.value = value === 'pointer' ? 1 : 0
  resetPointer()
})
document.body.append(controls)

function resetPointer() {
  mouse.value.set(-10, -10)
}
function pointer(event) {
  const rect = canvas.getBoundingClientRect()
  mouse.value.set(
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
