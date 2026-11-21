import * as THREE from 'three/webgpu'
import { uv, uniform, vec3, clamp, length, smoothstep, mix, convertToTexture } from 'three/tsl'
import { bloom } from 'three/addons/tsl/display/BloomNode.js'
import { createParticleSystem } from './particle-system.js'
import { createFeedback } from './feedback.js'

export async function createPostLesson({ chromatic = false } = {}) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 30)
  camera.position.z = 5.5
  const renderer = new THREE.WebGPURenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  await renderer.init()
  const simulation = await createParticleSystem(renderer, { gpu: renderer.backend.isWebGPUBackend === true, count: 1000 })
  scene.add(simulation.particles)
  const feedback = createFeedback(renderer, scene, camera, { hdr: true })
  const strength = uniform(chromatic ? 0.5 : 0.8)
  const radius = uniform(0.5)
  const threshold = uniform(0.7)
  const shift = uniform(0.025)
  const influence = uniform(0)
  const useEdge = uniform(1)
  const animation = simulation.speed
  const luminosity = uniform(1)
  // 잔상이 든 최종 RenderTarget을 입력으로 사용한다. scene을 다시 pass()로 그리지 않는다.
  const sceneColor = feedback.output
  const bloomFirst = bloom(sceneColor, strength, radius, threshold)
  const post = new THREE.RenderPipeline(renderer)
  const intermediates = []
  let bloomLast
  let normalOrder
  let reverseOrder
  function rgb(input) {
    const baseUV = uv()
    const centered = baseUV.sub(0.5)
    const edge = smoothstep(0.1, 0.65, length(centered))
    const amount = shift.add(influence).mul(mix(1, edge, useEdge))
    const offset = centered.mul(amount)
    return vec3(input.sample(clamp(baseUV.add(offset), 0, 1)).r, input.sample(baseUV).g, input.sample(clamp(baseUV.sub(offset), 0, 1)).b)
  }
  if (chromatic) {
    const bloomed = convertToTexture(sceneColor.add(bloomFirst))
    const shifted = convertToTexture(rgb(sceneColor))
    intermediates.push(bloomed, shifted)
    bloomLast = bloom(shifted, strength, radius, threshold)
    normalOrder = rgb(bloomed)
    reverseOrder = shifted.add(bloomLast)
    post.outputNode = normalOrder
  } else {
    post.outputNode = sceneColor.add(bloomFirst)
  }
  const canvas = renderer.domElement
  canvas.style.position = 'fixed'
  canvas.style.touchAction = 'none'
  canvas.setAttribute('aria-label', chromatic ? '입자 장면 전체의 RGB 색수차와 Bloom 후처리' : '푸른 입자 궤적의 HDR Bloom 후처리')
  const panel = document.createElement('section')
  panel.className = 'controls refraction-controls'
  panel.setAttribute('aria-label', chromatic ? 'Day 26 설정' : 'Day 25 설정')
  const note = document.createElement('p')
  note.className = 'refraction-note'
  note.textContent = chromatic
    ? 'Scene → Bloom → RGB Shift · 포인터를 빠르게 움직이면 색수차가 증가하고 멈추면 0.5초 안에 대부분 감쇠합니다. 중심은 선명하게 유지됩니다. 적용 순서와 가장자리 마스크를 비교하세요.'
    : 'Feedback → Bloom · 강도 0 / 0.5 / 1.5를 비교하세요. Day 24의 실제 Ping-Pong 잔상 텍스처에 HDR Bloom을 적용합니다. 임계값으로 밝은 누적 영역을 선택합니다.'
  note.textContent += renderer.backend.isWebGPUBackend ? ' GPU Compute 입자 사용.' : ' 현재 WebGL에서는 CPU 입자 + GPU 잔상 합성을 사용합니다.'
  panel.append(note)
  const restores = []
  const sliders = [
    ['Bloom 강도', strength, 0, 2, 0.1],
    ['Bloom 반경', radius, 0, 1, 0.05],
    ['밝기 임계값', threshold, 0, 3, 0.1],
    ['입자 밝기', luminosity, 0.2, 3, 0.1],
    ['이동 속도', animation, 0, 1, 0.05],
    ['잔상 유지율', feedback.retention, 0, 0.99, 0.01],
    ...(chromatic ? [['색수차 강도', shift, 0, 0.08, 0.001]] : []),
  ]
  for (const [name, node, min, max, step] of sliders) {
    const initial = node.value
    const label = document.createElement('label')
    const caption = document.createElement('span')
    const input = document.createElement('input')
    input.type = 'range'
    input.setAttribute('aria-label', name)
    Object.assign(input, { min, max, step, value: initial })
    const update = () => { node.value = Number(input.value); caption.textContent = `${name}: ${node.value}` }
    input.addEventListener('input', update)
    restores.push(() => { input.value = initial; update() })
    update()
    label.append(caption, input)
    panel.append(label)
  }
  function select(name, options, change) {
    const label = document.createElement('label')
    const input = document.createElement('select')
    input.setAttribute('aria-label', name)
    for (const [value, title] of options) input.add(new Option(title, value))
    input.addEventListener('change', () => change(input.value))
    restores.push(() => { input.selectedIndex = 0; change(input.value) })
    label.append(name, input)
    panel.append(label)
  }
  let pointerEnabled = true
  if (chromatic) {
    select('후처리 순서', [['normal', 'Bloom → 색수차'], ['reverse', '색수차 → Bloom']], value => {
      post.outputNode = value === 'normal' ? normalOrder : reverseOrder
      post.needsUpdate = true
    })
    select('가장자리 마스크', [['on', '사용'], ['off', '없음']], value => { useEdge.value = value === 'on' ? 1 : 0 })
    select('포인터 반응', [['on', '사용'], ['off', '없음']], value => { pointerEnabled = value === 'on'; resetPointer() })
  }
  const reset = document.createElement('button')
  reset.type = 'button'
  reset.textContent = '초기화'
  reset.addEventListener('click', () => { restores.forEach(fn => fn()); resetPointer(); simulation.reset(); feedback.reset() })
  const clear = document.createElement('button')
  clear.type = 'button'; clear.textContent = '잔상 지우기'
  clear.addEventListener('click', () => feedback.reset())
  panel.append(clear)
  panel.append(reset)
  document.body.classList.add('refraction-lesson')
  document.body.append(canvas, panel)
  let lastPointer = null
  function resetPointer() { lastPointer = null; influence.value = 0 }
  function pointer(event) {
    if (!pointerEnabled || !chromatic) return
    const bounds = canvas.getBoundingClientRect()
    const point = { x: (event.clientX - bounds.left) / bounds.width, y: (event.clientY - bounds.top) / bounds.height, time: event.timeStamp }
    if (lastPointer) {
      const dt = Math.max((point.time - lastPointer.time) / 1000, 0.008)
      influence.value = Math.min(Math.hypot(point.x - lastPointer.x, point.y - lastPointer.y) / dt * 0.008, 0.04)
    }
    lastPointer = point
  }
  function release(event) { if (event.pointerType !== 'mouse') resetPointer() }
  canvas.addEventListener('pointermove', pointer)
  canvas.addEventListener('pointerdown', pointer)
  canvas.addEventListener('pointerleave', resetPointer)
  canvas.addEventListener('pointercancel', resetPointer)
  canvas.addEventListener('pointerup', release)
  function resize() {
    const top = document.querySelector('nav').getBoundingClientRect().bottom + 12
    const bottom = panel.getBoundingClientRect().top - 12
    const w = Math.max(1, innerWidth - 32)
    const h = Math.max(1, bottom - top)
    renderer.setSize(w, h)
    const size = renderer.getDrawingBufferSize(new THREE.Vector2())
    feedback.resize(size.x, size.y)
    canvas.style.left = '16px'
    canvas.style.top = `${top}px`
    camera.aspect = w / h
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(20)) / Math.min(1, camera.aspect)))
    camera.updateProjectionMatrix()
    resetPointer()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(panel)
  observer.observe(document.querySelector('nav'))
  window.addEventListener('resize', resize)
  resize()
  let previous = performance.now()
  renderer.setAnimationLoop(() => {
    const now = performance.now()
    const delta = Math.max(0, (now - previous) / 1000)
    previous = now
    influence.value *= Math.exp(-6 * delta)
    canvas.dataset.pointerInfluence = influence.value.toFixed(5)
    simulation.brightness.value = luminosity.value
    simulation.update(Math.min(delta, 0.05))
    feedback.render(Math.min(delta, 0.05))
    post.render()
    canvas.dataset.ready = 'true'
  })
  return () => {
    renderer.setAnimationLoop(null)
    observer.disconnect()
    window.removeEventListener('resize', resize)
    canvas.removeEventListener('pointermove', pointer)
    canvas.removeEventListener('pointerdown', pointer)
    canvas.removeEventListener('pointerleave', resetPointer)
    canvas.removeEventListener('pointercancel', resetPointer)
    canvas.removeEventListener('pointerup', release)
    post.dispose()
    bloomFirst.dispose()
    bloomLast?.dispose()
    intermediates.forEach(node => node.dispose())
    feedback.dispose()
    simulation.dispose()
    renderer.dispose()
    canvas.remove()
    panel.remove()
    document.body.classList.remove('refraction-lesson')
  }
}
