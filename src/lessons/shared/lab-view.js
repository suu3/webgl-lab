import * as THREE from 'three/webgpu'

// Day 15~24의 정면 실습 화면. 기존 레슨은 각자의 렌더링을 유지한다.
export async function createLabView(title, description, aspect = 1) {
  const renderer = new THREE.WebGPURenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  await renderer.init()
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
  camera.position.z = 2
  const canvas = renderer.domElement
  canvas.style.position = 'fixed'
  canvas.setAttribute('aria-label', title)
  const panel = document.createElement('section')
  panel.className = 'controls refraction-controls'
  panel.setAttribute('aria-label', `${title} 설정`)
  const note = document.createElement('p')
  note.className = 'refraction-note'
  note.textContent = description
  panel.append(note)
  document.body.classList.add('refraction-lesson')
  document.body.append(canvas, panel)
  const resets = [], resizeCallbacks = []
  function slider(name, node, min, max, step) {
    const initial = node.value
    const label = document.createElement('label')
    const caption = document.createElement('span')
    const input = document.createElement('input')
    input.type = 'range'
    input.setAttribute('aria-label', name)
    Object.assign(input, { min, max, step, value: initial })
    const update = () => { node.value = Number(input.value); caption.textContent = `${name}: ${node.value}` }
    input.addEventListener('input', update)
    resets.push(() => { input.value = initial; update() })
    update(); label.append(caption, input); panel.append(label)
  }
  function select(name, options, change) {
    const label = document.createElement('label')
    const input = document.createElement('select')
    input.setAttribute('aria-label', name)
    for (const [value, text] of options) input.add(new Option(text, value))
    input.addEventListener('change', () => change(input.value))
    resets.push(() => { input.selectedIndex = 0; change(input.value) })
    label.append(name, input); panel.append(label)
  }
  function button(name, action) {
    const button = document.createElement('button')
    button.type = 'button'; button.textContent = name
    button.addEventListener('click', action); panel.append(button)
  }
  function resize() {
    const top = document.querySelector('nav').getBoundingClientRect().bottom + 12
    const bottom = panel.getBoundingClientRect().top - 12
    const w = Math.max(1, Math.min(innerWidth - 32, Math.max(1, bottom - top) * aspect))
    const h = w / aspect
    renderer.setSize(w, h)
    canvas.style.left = `${(innerWidth - w) / 2}px`
    canvas.style.top = `${top + (Math.max(1, bottom - top) - h) / 2}px`
    const size = renderer.getDrawingBufferSize(new THREE.Vector2())
    resizeCallbacks.forEach(fn => fn(size.x, size.y))
  }
  const observer = new ResizeObserver(resize)
  observer.observe(panel); observer.observe(document.querySelector('nav'))
  window.addEventListener('resize', resize)
  resize()
  let previous = performance.now()
  function start(frame) {
    renderer.setAnimationLoop(() => {
      const now = performance.now()
      const dt = Math.min(Math.max((now - previous) / 1000, 0), 0.05)
      previous = now
      frame(dt)
      canvas.dataset.ready = 'true'
    })
  }
  return {
    renderer, scene, camera, canvas, panel, note, slider, select, button, resets, resizeCallbacks, resize, start,
    dispose() {
      renderer.setAnimationLoop(null); observer.disconnect()
      window.removeEventListener('resize', resize)
      renderer.dispose(); canvas.remove(); panel.remove()
      document.body.classList.remove('refraction-lesson')
    },
  }
}
