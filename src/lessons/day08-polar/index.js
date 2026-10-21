import * as THREE from 'three/webgpu'
import { uv, time, float, vec3, uniform, smoothstep, mix, atan, cos, pow } from 'three/tsl'

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
camera.position.z = 2
const renderer = new THREE.WebGPURenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
await renderer.init()
document.body.append(renderer.domElement)
const aspect = uniform(new THREE.Vector2(1, 1))
const petals = uniform(8)
const speed = uniform(0)
const sharpness = uniform(1)
const p = uv().sub(0.5).mul(aspect)
// fragment.glsl은 같은 수식의 GLSL 비교본이다.
const r = p.length()
// atan(0, 0)은 정의되지 않으므로 중심에서만 작은 양수 x를 사용한다.
const a = atan(p.y, p.x.equal(0).and(p.y.equal(0)).select(float(0.000001), p.x)).add(time.mul(speed))
// cos를 0~1로 옮긴 뒤 pow를 적용해 음수의 분수 제곱을 피한다.
// sharpness=1이면 0.3 + 0.1 * cos(a * petals)와 같다.
const wave = pow(cos(a.mul(petals)).mul(0.5).add(0.5), sharpness)
const boundary = wave.mul(0.2).add(0.2)
const mask = float(1).sub(smoothstep(boundary.sub(0.015), boundary.add(0.015), r))
const material = new THREE.MeshBasicNodeMaterial()
material.colorNode = mix(vec3(0.01, 0.02, 0.05), vec3(0.2, 0.8, 1), mask)
const geometry = new THREE.PlaneGeometry(2, 2)
scene.add(new THREE.Mesh(geometry, material))

const controls = document.createElement('div')
controls.className = 'controls'
for (const [title, node, min, max, step] of [
  ['꽃잎 수', petals, 4, 12, 4],
  ['회전 속도', speed, -2, 2, 0.1],
  ['끝의 날카로움', sharpness, 1, 6, 0.5],
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
