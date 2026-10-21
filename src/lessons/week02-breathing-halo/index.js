import * as THREE from 'three'
import vertexShader from './vertex.glsl?raw'
import fragmentShader from './fragment.glsl?raw'
import practiceShader from './fragment.practice.glsl?raw'

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
camera.position.z = 2
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
document.body.append(renderer.domElement)
const uniforms = {
  uTime: { value: 0 },
  uPointer: { value: new THREE.Vector2(-10, -10) },
  uResolution: { value: new THREE.Vector2() },
  uSketch: { value: 3 },
  uRadius: { value: 0.3 },
  uThickness: { value: 0.018 },
  uSoftness: { value: 0.01 },
  uSpeed: { value: 1.5 },
  uColor: { value: new THREE.Color('#33ddff') },
}
const geometry = new THREE.PlaneGeometry(2, 2)
const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms })
scene.add(new THREE.Mesh(geometry, material))
const controls = document.createElement('div')
controls.className = 'controls'
function select(title, options, onChange) {
  const label = document.createElement('label')
  label.textContent = title
  const input = document.createElement('select')
  for (const [value, text] of options) input.add(new Option(text, value))
  input.addEventListener('change', () => onChange(input.value))
  label.append(input)
  controls.append(label)
  return input
}
const sketch = select('스케치', [['1', '01 · Smoothstep'], ['2', '02 · Breathing'], ['3', '03 · Halo']], value => {
  uniforms.uSketch.value = Number(value)
})
sketch.value = '3'
select('코드', [['complete', '완성본'], ['practice', '실습용']], value => {
  material.fragmentShader = value === 'practice' ? practiceShader : fragmentShader
  material.needsUpdate = true
})
for (const [title, key, min, max, step] of [
  ['반지름', 'uRadius', 0.15, 0.4, 0.01],
  ['두께', 'uThickness', 0.004, 0.05, 0.002],
  ['부드러움', 'uSoftness', 0.001, 0.1, 0.001],
  ['속도', 'uSpeed', 0, 4, 0.1],
]) {
  const label = document.createElement('label')
  label.textContent = title
  const input = document.createElement('input')
  input.type = 'range'
  Object.assign(input, { min, max, step, value: uniforms[key].value })
  input.addEventListener('input', () => { uniforms[key].value = Number(input.value) })
  label.append(input)
  controls.append(label)
}
const colorLabel = document.createElement('label')
colorLabel.textContent = '색상'
const colorInput = document.createElement('input')
colorInput.type = 'color'
colorInput.value = '#33ddff'
colorInput.addEventListener('input', () => uniforms.uColor.value.set(colorInput.value))
colorLabel.append(colorInput)
controls.append(colorLabel)
document.body.append(controls)
function resize() {
  renderer.setSize(innerWidth, innerHeight)
  uniforms.uResolution.value.set(innerWidth, innerHeight)
}
function pointer(event) {
  const rect = renderer.domElement.getBoundingClientRect()
  uniforms.uPointer.value.set((event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height)
}
function resetPointer() { uniforms.uPointer.value.set(-10, -10) }
window.addEventListener('resize', resize)
renderer.domElement.addEventListener('pointermove', pointer)
renderer.domElement.addEventListener('pointerleave', resetPointer)
renderer.domElement.addEventListener('pointerup', resetPointer)
resize()
const motion = matchMedia('(prefers-reduced-motion: reduce)')
let previousTime
renderer.setAnimationLoop(time => {
  const delta = previousTime === undefined ? 0 : Math.min((time - previousTime) / 1000, 0.1)
  previousTime = time
  if (!motion.matches && !document.hidden) uniforms.uTime.value += delta
  renderer.render(scene, camera)
})
import.meta.hot?.dispose(() => {
  renderer.setAnimationLoop(null)
  window.removeEventListener('resize', resize)
  renderer.domElement.removeEventListener('pointermove', pointer)
  renderer.domElement.removeEventListener('pointerleave', resetPointer)
  renderer.domElement.removeEventListener('pointerup', resetPointer)
  geometry.dispose()
  material.dispose()
  renderer.dispose()
  renderer.domElement.remove()
  controls.remove()
})
