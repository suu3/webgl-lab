import * as THREE from 'three/webgpu'
import { uv, uniform, vec2, vec3, float, length, atan, cos, sin, smoothstep, texture, clamp, mix, max } from 'three/tsl'
import { createLabView } from '../shared/lab-view.js'
import { noise3D } from '../shared/noise.js'

const view = await createLabView('Day 15 · Liquid Morphing', 'r = r₀ + A × Noise(cos θ, sin θ, time) · 각도를 원형 Noise 좌표로 바꿔 이음매를 없앱니다. 윤곽 강도 0.01 / 0.05 / 0.10을 비교하세요. 현재 릴리스에서는 Day 9의 Value Noise를 사용합니다. 메시 대신 이미지 왜곡 영역의 윤곽을 바꿉니다.', 1.5)
const image = await new THREE.TextureLoader().loadAsync(`${import.meta.env.BASE_URL}textures/sample.svg`)
image.colorSpace = THREE.SRGBColorSpace
const elapsed = uniform(0), amplitude = uniform(0.05), speed = uniform(0.3), radius = uniform(0.28), distortion = uniform(-0.28), tint = uniform(0.16), double = uniform(0), display = uniform(0)
const baseUV = uv()
function liquid(center, baseRadius, timeScale, offset) {
  const p = baseUV.sub(center).mul(vec2(1.5, 1))
  const d = length(p)
  const safeX = p.x.equal(0).and(p.y.equal(0)).select(float(0.000001), p.x)
  const angle = atan(p.y, safeX)
  const n = noise3D(vec3(cos(angle).mul(2), sin(angle).mul(2), elapsed.mul(timeScale).add(offset)))
  const r = baseRadius.add(n.mul(amplitude))
  return smoothstep(r.sub(0.015), r.add(0.015), d).oneMinus()
}
const maskA = liquid(vec2(0.5), radius, speed, 0)
const maskB = liquid(vec2(0.66, 0.52), radius.mul(0.75), speed.mul(1.7), 7.3)
const mask = max(maskA, maskB.mul(double))
const offset = baseUV.sub(0.5).mul(distortion).mul(mask)
const background = texture(image, clamp(baseUV.add(offset), 0, 1)).rgb
const material = new THREE.MeshBasicNodeMaterial()
material.colorNode = mix(mix(background, vec3(0.12, 0.72, 0.9), mask.mul(tint)), vec3(mask), display)
const geometry = new THREE.PlaneGeometry(2, 2)
view.scene.add(new THREE.Mesh(geometry, material))
for (const args of [['윤곽 Noise 강도', amplitude, 0, 0.1, 0.01], ['액체 변화 속도', speed, 0, 1, 0.1], ['기본 반지름', radius, 0.2, 0.35, 0.01], ['내부 왜곡', distortion, -0.5, 0.3, 0.01], ['색상 혼합', tint, 0, 0.4, 0.01]]) view.slider(...args)
view.select('액체 레이어', [['one', '한 겹'], ['two', '두 겹 · Max 합성']], v => { double.value = v === 'two' ? 1 : 0 })
view.select('표시', [['image', '왜곡 이미지'], ['mask', '액체 마스크']], v => { display.value = v === 'mask' ? 1 : 0 })
let paused = false
view.select('재생', [['play', '재생'], ['pause', '일시정지']], v => { paused = v === 'pause' })
view.button('초기화', () => { view.resets.forEach(fn => fn()); elapsed.value = 0 })
view.start(dt => { if (!paused) elapsed.value += dt; view.renderer.render(view.scene, view.camera) })
import.meta.hot?.dispose(() => { geometry.dispose(); material.dispose(); image.dispose(); view.dispose() })
