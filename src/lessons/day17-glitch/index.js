import * as THREE from 'three/webgpu'
import { uv, uniform, floor, fract, sin, step, clamp, texture, vec2, vec3, mix } from 'three/tsl'
import { createLabView } from '../shared/lab-view.js'

const view = await createLabView('Day 17 · Glitch & Digital Corruption', 'floor(UV.y × rows) / floor(time × ticks) · 줄과 시간을 불연속 구간으로 나눕니다. 임계값 0.7 / 0.86 / 0.97, Tick 3 / 12 / 30을 비교하세요. 개별 이미지에 적용하는 UV 효과입니다.', 1.5)
const image = await new THREE.TextureLoader().loadAsync(`${import.meta.env.BASE_URL}textures/sample.svg`)
image.colorSpace = THREE.SRGBColorSpace
const elapsed = uniform(0), rows = uniform(40), ticks = uniform(12), threshold = uniform(0.86), strength = uniform(0.12), rgb = uniform(0), selective = uniform(1)
const p = uv(), row = floor(p.y.mul(rows)), tick = floor(elapsed.mul(ticks))
const random = fract(sin(row.mul(127.1).add(tick.mul(311.7))).mul(43758.5453))
const active = mix(1, step(threshold, random), selective)
const offset = random.sub(0.5).mul(strength).mul(active)
const shifted = clamp(p.add(vec2(offset, 0)), 0, 1)
const channelShift = vec2(rgb.mul(active), 0)
const material = new THREE.MeshBasicNodeMaterial()
material.colorNode = vec3(texture(image, clamp(shifted.add(channelShift), 0, 1)).r, texture(image, shifted).g, texture(image, clamp(shifted.sub(channelShift), 0, 1)).b)
const geometry = new THREE.PlaneGeometry(2, 2)
view.scene.add(new THREE.Mesh(geometry, material))
for (const args of [['글리치 강도', strength, 0, 0.3, 0.01], ['선택 임계값', threshold, 0, 1, 0.01], ['Tick 속도', ticks, 0, 30, 1], ['가로줄 수', rows, 10, 100, 1], ['RGB 분리', rgb, 0, 0.02, 0.001]]) view.slider(...args)
view.select('적용 줄', [['selected', '선택한 줄'], ['all', '모든 줄']], v => { selective.value = v === 'selected' ? 1 : 0 })
let paused = false
view.select('재생', [['play', '재생'], ['pause', '일시정지']], v => { paused = v === 'pause' })
view.button('초기화', () => { view.resets.forEach(fn => fn()); elapsed.value = 0 })
view.start(dt => { if (!paused) elapsed.value += dt; view.renderer.render(view.scene, view.camera) })
import.meta.hot?.dispose(() => { geometry.dispose(); material.dispose(); image.dispose(); view.dispose() })
