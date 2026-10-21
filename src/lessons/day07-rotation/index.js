import * as THREE from 'three/webgpu'
import { uv, time, float, vec3, uniform, smoothstep, mix, rotateUV, vec2, abs, max } from 'three/tsl'

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
camera.position.z = 2
const renderer = new THREE.WebGPURenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
await renderer.init()
document.body.append(renderer.domElement)
const aspect = uniform(new THREE.Vector2(1, 1))
const speed = uniform(0.7)
const height = uniform(1)
const p = uv().sub(0.5).mul(aspect)
// fragment.glsl은 같은 수식의 GLSL 비교본이다.
const rotated = rotateUV(p, time.mul(speed), vec2(0))
// 세로 반지름을 나누면 직사각형도 같은 경계 함수로 표현할 수 있다.
const edge = max(abs(rotated.x), abs(rotated.y).div(height))
const mask = float(1).sub(smoothstep(0.15, 0.17, edge))
const material = new THREE.MeshBasicNodeMaterial()
material.colorNode = mix(vec3(0.01, 0.02, 0.05), vec3(0.2, 0.8, 1), mask)
const geometry = new THREE.PlaneGeometry(2, 2)
scene.add(new THREE.Mesh(geometry, material))

const controls = document.createElement('div')
controls.className = 'controls'
for (const [title, node, min, max, step] of [
  ['회전 속도', speed, -2, 2, 0.1],
  ['세로 비율', height, 0.4, 2, 0.1],
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
