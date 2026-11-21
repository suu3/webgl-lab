import * as THREE from 'three/webgpu'
import { uv, uniform, vec2, vec3, length, smoothstep, sin, texture, clamp, mix, abs, dot, max } from 'three/tsl'

export async function createRefractionLesson({ edge = false } = {}) {
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
  camera.position.z = 2
  const renderer = new THREE.WebGPURenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  const background = await new THREE.TextureLoader().loadAsync(`${import.meta.env.BASE_URL}textures/sample.svg`)
  background.colorSpace = THREE.SRGBColorSpace
  await renderer.init()
  const clock = uniform(0)
  const strength = uniform(0.012)
  const speed = uniform(3)
  const frequency = uniform(35)
  const radius = uniform(edge ? 0.3 : 0.38)
  const softness = uniform(0.13)
  const width = uniform(0.025)
  const pulse = uniform(0.008)
  const highlight = uniform(0.75)
  const asymmetric = uniform(0)
  const mode = uniform(0)
  const flow = uniform(new THREE.Vector2(1, 0))
  const axis = uniform(new THREE.Vector2(0, 1))
  const p = uv()
  // 로컬 이미지 비율(3:2)을 반영해 마스크가 화면에서도 원형으로 보인다.
  const centered = p.sub(0.5).mul(vec2(1.5, 1))
  const distance = length(centered)
  const d = distance.sub(radius.add(edge ? sin(clock.mul(1.5)).mul(pulse) : 0))
  const mask = edge
    ? smoothstep(-0.005, 0.005, d).oneMinus()
    : smoothstep(radius.sub(softness), radius, distance).oneMinus()
  const wave = sin(dot(p, axis).mul(frequency).sub(clock.mul(speed)))
  const displacement = flow.mul(wave).mul(strength)
  const distortedUV = clamp(p.add(displacement.mul(mask)), 0, 1)
  const refracted = texture(background, distortedUV).rgb
  const material = new THREE.MeshBasicNodeMaterial()
  if (edge) {
    const rim = smoothstep(0, width, abs(d)).oneMinus()
    // 분모 하한으로 중심의 normalize(0)을 피한다.
    const direction = centered.div(max(distance, 0.0001))
    const light = clamp(dot(direction, vec2(-Math.SQRT1_2, Math.SQRT1_2)), 0, 1)
    const litRim = rim.mul(mix(1, light, asymmetric))
    const finalColor = mix(refracted, vec3(0.65, 0.92, 1), litRim.mul(highlight))
    material.colorNode = mix(finalColor, vec3(rim), mode)
  } else {
    material.colorNode = refracted
  }
  const geometry = new THREE.PlaneGeometry(2, 2)
  scene.add(new THREE.Mesh(geometry, material))
  const canvas = renderer.domElement
  canvas.style.position = 'fixed'
  canvas.setAttribute('aria-label', edge ? '맥동하는 액체 렌즈와 SDF 경계 하이라이트' : '원형 마스크 내부의 열기와 액체 굴절')
  const panel = document.createElement('section')
  panel.className = 'controls refraction-controls'
  panel.setAttribute('aria-label', edge ? 'Day 28 설정' : 'Day 27 설정')
  const note = document.createElement('p')
  note.className = 'refraction-note'
  note.textContent = edge
    ? 'rim = 1 − smoothstep(0, width, |SDF|) · 굴절과 경계 빛을 따로 조절하세요. 맥동 0·흐름 속도 0은 정지합니다. SDF 기반 연출이며 실제 Fresnel 반사는 아닙니다.'
    : 'UV′ = UV + displacement × mask · 강도 0 / 0.012 / 0.04를 비교하세요. 원 밖은 원본 배경입니다. 흐름 속도 0은 정지합니다. 물리적 굴절 대신 이미지 UV를 이동하는 근사입니다.'
  panel.append(note)
  const resets = []
  const sliders = [
    ['왜곡 강도', strength, 0, 0.04, 0.001],
    ['흐름 속도', speed, 0, 6, 0.1],
    ['파동 주파수', frequency, 1, 70, 1],
    ['영역 반지름', radius, 0.2, 0.45, 0.01],
    ...(edge ? [
      ['테두리 두께', width, 0.008, 0.05, 0.001],
      ['하이라이트', highlight, 0, 1, 0.05],
      ['맥동 진폭', pulse, 0, 0.02, 0.001],
    ] : [['경계 부드러움', softness, 0.01, 0.18, 0.01]]),
  ]
  for (const [name, node, min, maxValue, step] of sliders) {
    const initial = node.value
    const label = document.createElement('label')
    const caption = document.createElement('span')
    const input = document.createElement('input')
    input.type = 'range'
    input.setAttribute('aria-label', name)
    Object.assign(input, { min, max: maxValue, step, value: initial })
    const update = () => { node.value = Number(input.value); caption.textContent = `${name}: ${node.value}` }
    input.addEventListener('input', update)
    resets.push(() => { input.value = initial; update() })
    update()
    label.append(caption, input)
    panel.append(label)
  }
  function select(name, options, change) {
    const label = document.createElement('label')
    const input = document.createElement('select')
    input.setAttribute('aria-label', name)
    for (const [value, text] of options) input.add(new Option(text, value))
    input.addEventListener('change', () => change(input.value))
    resets.push(() => { input.selectedIndex = 0; change(input.value) })
    label.append(name, input)
    panel.append(label)
  }
  select('흐름 방향', [['x', '수평 (X)'], ['y', '수직 (Y)'], ['xy', '대각선 (XY)']], value => {
    flow.value.set(value === 'y' ? 0 : 1, value === 'x' ? 0 : 1)
    if (value === 'xy') flow.value.normalize()
    axis.value.set(value === 'y' ? 1 : 0, value === 'y' ? 0 : 1)
  })
  if (edge) {
    select('조명', [['all', '균일'], ['upper-left', '왼쪽 위']], value => { asymmetric.value = value === 'all' ? 0 : 1 })
    select('표시', [['final', '굴절 + 하이라이트'], ['rim', '경계 마스크']], value => { mode.value = value === 'rim' ? 1 : 0 })
  }
  const reset = document.createElement('button')
  reset.type = 'button'
  reset.textContent = '초기화'
  reset.addEventListener('click', () => { resets.forEach(fn => fn()); clock.value = 0 })
  panel.append(reset)
  document.body.classList.add('refraction-lesson')
  document.body.append(canvas, panel)
  function resize() {
    const top = document.querySelector('nav').getBoundingClientRect().bottom + 12
    const bottom = panel.getBoundingClientRect().top - 12
    const available = Math.max(1, bottom - top)
    const w = Math.max(1, Math.min(innerWidth - 32, available * 1.5))
    const h = w / 1.5
    renderer.setSize(w, h)
    canvas.style.left = `${(innerWidth - w) / 2}px`
    canvas.style.top = `${top + (available - h) / 2}px`
  }
  const observer = new ResizeObserver(resize)
  observer.observe(panel)
  observer.observe(document.querySelector('nav'))
  window.addEventListener('resize', resize)
  resize()
  let previous = performance.now()
  renderer.setAnimationLoop(() => {
    const now = performance.now()
    clock.value += Math.min((now - previous) / 1000, 0.1)
    previous = now
    renderer.render(scene, camera)
    canvas.dataset.ready = 'true'
  })
  return () => {
    renderer.setAnimationLoop(null)
    observer.disconnect()
    window.removeEventListener('resize', resize)
    geometry.dispose()
    material.dispose()
    background.dispose()
    renderer.dispose()
    canvas.remove()
    panel.remove()
    document.body.classList.remove('refraction-lesson')
  }
}
