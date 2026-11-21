import * as THREE from 'three/webgpu'
import { uv, uniform, texture, vec2, length, max, abs, cos, smoothstep, clamp } from 'three/tsl'
import { createLabView } from '../shared/lab-view.js'

const view = await createLabView('Day 16 · Ripple Propagation', '이미지를 클릭·터치하면 r = speed × age인 파동이 퍼집니다. 기본은 새 클릭이 이전 파동을 취소합니다. 두 파동 모드는 최근 두 클릭을 합성합니다. 파동은 수명 이후 사라지고 원본으로 돌아옵니다.', 1.5)
const image = await new THREE.TextureLoader().loadAsync(`${import.meta.env.BASE_URL}textures/sample.svg`)
image.colorSpace = THREE.SRGBColorSpace
const speed = uniform(0.45), width = uniform(0.1), frequency = uniform(70), lifetime = uniform(1.5), amplitude = uniform(0.025)
const clicks = [uniform(new THREE.Vector2(0.5, 0.5)), uniform(new THREE.Vector2(0.5, 0.5))]
const ages = [uniform(-1), uniform(-1)]
const baseUV = uv(), aspect = vec2(1.5, 1)
function ripple(click, elapsed) {
  const delta = baseUV.sub(click).mul(aspect)
  const d = length(delta), age = max(elapsed, 0)
  const q = d.sub(age.mul(speed))
  const ring = smoothstep(0, width, abs(q)).oneMinus()
  const wave = cos(q.mul(frequency))
  const fade = smoothstep(lifetime.mul(2 / 3), lifetime, age).oneMinus()
  const active = smoothstep(0, 0.01, elapsed)
  return delta.div(max(d, 0.001)).div(aspect).mul(wave).mul(ring).mul(fade).mul(active).mul(amplitude)
}
const offset = ripple(clicks[0], ages[0]).add(ripple(clicks[1], ages[1]))
// 두 파동이 겹쳐도 총 변위는 .05 이하로 제한한다.
const limited = offset.mul(max(length(offset).div(0.05), 1).reciprocal())
const material = new THREE.MeshBasicNodeMaterial()
material.colorNode = texture(image, clamp(baseUV.add(limited), 0, 1)).rgb
const geometry = new THREE.PlaneGeometry(2, 2)
view.scene.add(new THREE.Mesh(geometry, material))
for (const args of [['파동 강도', amplitude, 0, 0.05, 0.001], ['전파 속도', speed, 0.2, 0.8, 0.05], ['파동 폭', width, 0.03, 0.2, 0.01], ['진동 주파수', frequency, 20, 100, 1], ['파동 수명', lifetime, 0.3, 3, 0.1]]) view.slider(...args)
let two = false, next = 0, paused = false
function clear() { ages.forEach(age => { age.value = -1 }); next = 0 }
function trigger(x, y) {
  const slot = two ? next : 0
  if (!two) ages[1].value = -1
  clicks[slot].value.set(x, y)
  ages[slot].value = 0
  next = (slot + 1) % 2
}
function pointer(event) {
  if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return
  event.preventDefault()
  const rect = view.canvas.getBoundingClientRect()
  trigger(clampNumber((event.clientX - rect.left) / rect.width), clampNumber(1 - (event.clientY - rect.top) / rect.height))
}
function clampNumber(value) { return Math.max(0, Math.min(1, value)) }
view.canvas.style.touchAction = 'none'
view.canvas.addEventListener('pointerdown', pointer)
view.select('파동 개수', [['one', '하나 · 새 클릭으로 교체'], ['two', '최근 두 파동']], v => { two = v === 'two'; clear() })
view.select('재생', [['play', '재생'], ['pause', '일시정지']], v => { paused = v === 'pause' })
view.button('중앙에서 파동', () => trigger(0.5, 0.5))
view.button('파동 지우기', clear)
view.button('초기화', () => { view.resets.forEach(fn => fn()); clear() })
view.resizeCallbacks.push(clear)
let previous = performance.now()
view.start(() => {
  const now = performance.now(), dt = Math.max(0, (now - previous) / 1000)
  previous = now
  if (!paused) ages.forEach(age => { if (age.value >= 0) age.value += dt })
  view.canvas.dataset.rippleAge = ages[0].value.toFixed(3)
  view.renderer.render(view.scene, view.camera)
})
import.meta.hot?.dispose(() => {
  view.canvas.removeEventListener('pointerdown', pointer)
  geometry.dispose(); material.dispose(); image.dispose(); view.dispose()
})
