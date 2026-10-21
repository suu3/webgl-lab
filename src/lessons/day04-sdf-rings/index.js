import * as THREE from 'three/webgpu'
import { uv, vec2, vec3, float, uniform, abs, smoothstep, mix } from 'three/tsl'

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
camera.position.z = 2
const renderer = new THREE.WebGPURenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
await renderer.init()
document.body.append(renderer.domElement)

const aspect = uniform(new THREE.Vector2(1, 1))
const thickness = uniform(0.008)
const softness = uniform(0.006)
const glowStrength = uniform(0.35)
const offset = uniform(0)
const p = uv().sub(0.5).mul(aspect)
// fragment.glsl에 동일한 계산을 GLSL로 제공한다.
function layer(background, point, radius, width, color) {
  const ringDistance = abs(point.length().sub(radius))
  const ring = float(1).sub(smoothstep(width, width.add(softness), ringDistance))
  const glow = float(1).sub(smoothstep(0, 0.08, ringDistance))
  return mix(background.add(color.mul(glow).mul(glowStrength)), color, ring)
}
let color = vec3(0.01, 0.02, 0.05)
color = layer(color, p, 0.12, thickness.mul(0.5), vec3(1))
color = layer(color, p.sub(vec2(offset, 0)), 0.25, thickness, vec3(0.1, 0.8, 1))
color = layer(color, p.sub(vec2(offset.negate(), offset.mul(0.5))), 0.38, thickness.mul(1.5), vec3(0.1, 0.3, 1))
const material = new THREE.MeshBasicNodeMaterial()
material.colorNode = color
const geometry = new THREE.PlaneGeometry(2, 2)
scene.add(new THREE.Mesh(geometry, material))
const controls = document.createElement('div')
controls.className = 'controls'
for (const [title, node, min, max, step] of [
  ['두께', thickness, 0.002, 0.02, 0.001],
  ['부드러움', softness, 0.001, 0.03, 0.001],
  ['발광', glowStrength, 0, 1, 0.05],
  ['중심 이동', offset, 0, 0.05, 0.001],
]) {
  const label = document.createElement('label')
  label.textContent = title
  const input = document.createElement('input')
  input.type = 'range'
  Object.assign(input, { min, max, step, value: node.value })
  input.addEventListener('input', () => { node.value = Number(input.value); render() })
  label.append(input)
  controls.append(label)
}
document.body.append(controls)
function render() { renderer.render(scene, camera) }
function resize() {
  const w = innerWidth, h = innerHeight, side = Math.min(w, h)
  aspect.value.set(w / side, h / side)
  renderer.setSize(w, h)
  render()
}
window.addEventListener('resize', resize)
resize()
import.meta.hot?.dispose(() => {
  window.removeEventListener('resize', resize)
  geometry.dispose()
  material.dispose()
  renderer.dispose()
  renderer.domElement.remove()
  controls.remove()
})
