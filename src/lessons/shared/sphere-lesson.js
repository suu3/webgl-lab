import * as THREE from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Day 30·31의 카메라, 제어 UI와 수명주기만 공유한다.
export async function createSphereLesson({ title, description, material, sliders }) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 30)
  camera.position.set(0, 0, 3.8)
  const renderer = new THREE.WebGPURenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  await renderer.init()
  const canvas = renderer.domElement
  Object.assign(canvas.style, { position: 'fixed', touchAction: 'none' })
  canvas.setAttribute('aria-label', title)
  const geometry = new THREE.SphereGeometry(1, 64, 64)
  const sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere)
  const panel = document.createElement('section')
  panel.className = 'controls sphere-controls'
  panel.setAttribute('aria-label', `${title} 설정`)
  const note = document.createElement('p')
  note.className = 'sphere-note'
  note.textContent = description
  panel.append(note)
  const resetInputs = []
  for (const [name, node, min, max, step] of sliders) {
    const initial = node.value
    const label = document.createElement('label')
    const caption = document.createElement('span')
    const input = document.createElement('input')
    input.type = 'range'
    input.setAttribute('aria-label', name)
    Object.assign(input, { min, max, step, value: initial })
    const update = () => { caption.textContent = `${name}: ${Number(input.value)}` }
    input.addEventListener('input', () => {
      node.value = Number(input.value)
      update()
    })
    resetInputs.push(() => { input.value = initial; node.value = initial; update() })
    update()
    label.append(caption, input)
    panel.append(label)
  }
  const reset = document.createElement('button')
  reset.type = 'button'
  reset.textContent = '초기화'
  panel.append(reset)
  document.body.append(canvas, panel)
  document.body.classList.add('sphere-lesson')
  const orbit = new OrbitControls(camera, canvas)
  orbit.enableDamping = true
  orbit.enablePan = false
  orbit.minDistance = 2.6
  orbit.maxDistance = 6
  orbit.saveState()
  reset.addEventListener('click', () => {
    resetInputs.forEach(restore => restore())
    orbit.reset()
  })
  function resize() {
    const top = document.querySelector('nav').getBoundingClientRect().bottom + 12
    const bottom = panel.getBoundingClientRect().top - 12
    const width = Math.max(1, innerWidth - 32)
    const height = Math.max(1, bottom - top)
    renderer.setSize(width, height)
    canvas.style.left = '16px'
    canvas.style.top = `${top}px`
    camera.aspect = width / height
    // 세로 화면에서도 구체의 좌우가 잘리지 않게 시야각을 확보한다.
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(20)) / Math.min(1, camera.aspect)))
    camera.updateProjectionMatrix()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(panel)
  observer.observe(document.querySelector('nav'))
  window.addEventListener('resize', resize)
  resize()
  renderer.setAnimationLoop(() => {
    orbit.update()
    renderer.render(scene, camera)
    canvas.dataset.ready = 'true'
  })
  return () => {
    renderer.setAnimationLoop(null)
    observer.disconnect()
    window.removeEventListener('resize', resize)
    orbit.dispose()
    geometry.dispose()
    material.dispose()
    renderer.dispose()
    canvas.remove()
    panel.remove()
    document.body.classList.remove('sphere-lesson')
  }
}
