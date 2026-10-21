import * as THREE from 'three/webgpu'
import { uv, time, float, vec3, uniform, smoothstep, mix, sin, cos, abs, max } from 'three/tsl'

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
camera.position.z = 2
const renderer = new THREE.WebGPURenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
await renderer.init()
document.body.append(renderer.domElement)
const aspect = uniform(new THREE.Vector2(1, 1))
const speed = uniform(2)
const speed2 = uniform(2)
const p = uv().sub(0.5).mul(aspect)
// fragment.glsl은 같은 수식의 GLSL 비교본이다.
const d = p.length()
const r1 = float(0.22).add(sin(time.mul(speed)).mul(0.04))
const r2 = float(0.36).add(cos(time.mul(speed2)).mul(0.04))
const ring1 = float(1).sub(smoothstep(0.008, 0.016, abs(d.sub(r1))))
const ring2 = float(1).sub(smoothstep(0.008, 0.016, abs(d.sub(r2))))
const mask = max(ring1, ring2)
const material = new THREE.MeshBasicNodeMaterial()
material.colorNode = mix(vec3(0.01, 0.02, 0.05), vec3(0.2, 0.8, 1), mask)
const geometry = new THREE.PlaneGeometry(2, 2)
scene.add(new THREE.Mesh(geometry, material))

const controls = document.createElement('div')
controls.className = 'controls'
for (const [title, node, min, max, step] of [
  ['속도 · sin', speed, 0, 5, 0.1],
  ['속도 · cos', speed2, 0, 5, 0.1],
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
