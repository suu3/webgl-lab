import * as THREE from 'three/webgpu'
import { uv, time, float, vec3, uniform, smoothstep, mix, fract, mod, abs } from 'three/tsl'

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
camera.position.z = 2
const renderer = new THREE.WebGPURenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
await renderer.init()
document.body.append(renderer.domElement)
const aspect = uniform(new THREE.Vector2(1, 1))
const tiles = uniform(4)
const speed = uniform(0.4)
const filled = uniform(0)
const p = uv().sub(0.5).mul(aspect)
// fragment.glsl은 같은 수식의 GLSL 비교본이다.
// 화면 비율을 보정한 좌표를 반복해 각 타일도 정사각형으로 유지한다.
const tileUV = fract(p.add(0.5).mul(tiles)).sub(0.5)
const d = tileUV.length()
const phase = mod(time.mul(speed), float(1))
const radius = float(0.08).add(phase.mul(0.28))
const ring = float(1).sub(smoothstep(0.015, 0.03, abs(d.sub(radius))))
const disk = float(1).sub(smoothstep(radius.sub(0.015), radius.add(0.015), d))
const mask = mix(ring, disk, filled)
const material = new THREE.MeshBasicNodeMaterial()
material.colorNode = mix(vec3(0.01, 0.02, 0.05), vec3(0.2, 0.8, 1), mask)
const geometry = new THREE.PlaneGeometry(2, 2)
scene.add(new THREE.Mesh(geometry, material))

const controls = document.createElement('div')
controls.className = 'controls'
for (const [title, node, min, max, step] of [
  ['타일 수', tiles, 2, 8, 1],
  ['확산 속도', speed, 0, 2, 0.1],
  ['채운 원', filled, 0, 1, 1],
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
