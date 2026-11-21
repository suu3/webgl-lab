import * as THREE from 'three/webgpu'
import { createLabView } from './lab-view.js'
import { createParticleSystem } from './particle-system.js'
import { createFeedback } from './feedback.js'

export async function createParticleLesson(day) {
  const title = day === 22 ? 'Day 22 · Particle Advection' : day === 23 ? 'Day 23 · GPU Particle Simulation' : 'Day 24 · Particle Trails & Feedback'
  const description = day === 22
    ? 'CPU: p += normalize(curl(p)) × speed × Δt · 200개 위치를 CPU에서 갱신하고 GPU에 업로드합니다. 삼각함수 스칼라 필드의 회전 기울기이며 유체 시뮬레이션은 아닙니다.'
    : day === 23
      ? 'GPU Buffer → Compute → GPU Buffer → Render · 1,000개 위치를 GPU에서 갱신합니다. 속도 (0.2, 0.1), 양방향 경계 순환. Curl 모드도 비교하세요.'
      : 'Cₜ = retention × Cₜ₋₁ + Pₜ · 읽기·쓰기 RenderTarget을 매 프레임 교환합니다. 유지율은 60FPS 기준이며 경과 시간으로 보정합니다. Additive / Max / RGB별 감쇠를 비교하세요.'
  const view = await createLabView(title, description)
  const gpu = view.renderer.backend.isWebGPUBackend === true
  if (day === 23 && !gpu) {
    view.note.textContent = 'Day 23은 WebGPU Compute가 필요합니다. 이 브라우저는 WebGL 백엔드를 사용하고 있습니다. WebGPU를 지원하는 브라우저에서 열어 주세요. CPU로 비교하려면 Day 22를 선택하세요.'
    view.note.setAttribute('role', 'status')
    view.canvas.dataset.unsupported = 'true'
    return () => view.dispose()
  }
  const simulation = await createParticleSystem(view.renderer, { gpu: day !== 22 && gpu, count: day === 22 ? 200 : 1000, constant: day === 23 })
  view.scene.add(simulation.particles)
  view.canvas.dataset.simulation = day !== 22 && gpu ? 'gpu' : 'cpu'
  if (day === 24 && !gpu) view.note.textContent += ' 현재 WebGL에서는 CPU 입자 + 동일한 GPU Ping-Pong 합성을 사용합니다.'
  const feedback = day === 24 ? createFeedback(view.renderer, view.scene, view.camera) : null
  const post = feedback ? new THREE.RenderPipeline(view.renderer, feedback.output) : null
  const resets = view.resets
  view.slider(day === 23 ? '속도 배율' : '이동 속도', simulation.speed, 0, day === 23 ? 3 : 0.8, 0.05)
  view.slider('입자 크기', simulation.size, 1, 8, 1)
  view.slider('입자 밝기', simulation.brightness, 0.1, 2, 0.1)
  if (day === 22) view.select('경계 처리', [['wrap', '반대편 순환'], ['respawn', '랜덤 재생성']], value => { simulation.respawn = value === 'respawn' })
  if (day === 23) {
    view.slider('X 속도', { get value() { return simulation.velocity.value.x }, set value(v) { simulation.velocity.value.x = v } }, -1, 1, 0.1)
    view.slider('Y 속도', { get value() { return simulation.velocity.value.y }, set value(v) { simulation.velocity.value.y = v } }, -1, 1, 0.1)
    view.select('이동 방식', [['constant', '일정한 속도'], ['curl', 'Curl Field']], value => { simulation.field.value = value === 'curl' ? 1 : 0 })
  }
  if (feedback) {
    view.slider('잔상 유지율', feedback.retention, 0, 0.99, 0.01)
    view.select('합성 방식', [['add', 'Additive'], ['max', 'Max']], value => { feedback.blendMax.value = value === 'max' ? 1 : 0 })
    view.select('감쇠 색상', [['same', '동일한 RGB'], ['rgb', 'RGB 0.94 / 0.97 / 0.99']], value => { feedback.rgbDecay.value = value === 'rgb' ? 1 : 0 })
    view.button('잔상 지우기', () => feedback.reset())
    view.resizeCallbacks.push((w, h) => feedback.resize(w, h))
  }
  let paused = false
  view.select('재생', [['play', '재생'], ['pause', '일시정지']], value => { paused = value === 'pause'; simulation.paused = paused })
  view.button('초기화', () => { resets.forEach(fn => fn()); simulation.reset(); feedback?.reset() })
  view.resize()
  view.start(dt => {
    simulation.update(dt)
    if (feedback) {
      if (!paused) feedback.render(dt)
      post.render()
    } else view.renderer.render(view.scene, view.camera)
  })
  return () => { simulation.dispose(); post?.dispose(); feedback?.dispose(); view.dispose() }
}
