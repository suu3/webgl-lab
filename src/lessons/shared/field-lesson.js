import * as THREE from 'three/webgpu'
import { uv, uniform, vec2, vec3, float, floor, fract, sin, cos, dot, abs, smoothstep, mix, clamp, length, max } from 'three/tsl'
import { createLabView } from './lab-view.js'
import { noise3D, fbm } from './noise.js'

export async function createFieldLesson(day) {
  const titles = { 18: 'Layered Noise & fBM', 19: 'Domain Warping', 20: 'Flow Field', 21: 'Curl Noise' }
  const descriptions = {
    18: 'fBM = Σ amplitude × Noise(frequency × p) · 1 / 2 / 4 Octave를 비교합니다. 합산 진폭으로 정규화하며 Turbulence는 |Noise|를 합산합니다.',
    19: 'f(p) = fBM(p + strength × q(p)) · 강도 0 / 0.5 / 1.2 / 2.5를 비교하세요. q.x와 q.y는 서로 다른 좌표에서 평가합니다.',
    20: 'F = (cos(Noise × 2π), sin(Noise × 2π)) · 각 격자 안에서 선이 이동하는 방향 시각화입니다. 입자 위치를 누적하지 않습니다.',
    21: 'Curl = (∂N/∂y, −∂N/∂x) · 중앙 차분으로 구한 기울기를 90° 회전합니다. Gradient와 Curl, 정규화 전 흐름 강도를 비교하세요.',
  }
  const view = await createLabView(`Day ${day} · ${titles[day]}`, `${descriptions[day]} 현재 릴리스에 snoise export가 없어 Day 9의 3D Value Noise를 사용합니다.`)
  const elapsed = uniform(0)
  const scale = uniform(day < 20 ? 3 : 0.16)
  const speed = uniform(day < 20 ? 0.2 : day === 21 ? 0.08 : 0)
  const material = new THREE.MeshBasicNodeMaterial()
  if (day < 20) {
    const p = uv().mul(scale)
    const t = elapsed.mul(speed)
    const density = uniform(0)
    const palette = uniform(0)
    let value
    view.slider('공간 크기', scale, 1, 8, 0.1)
    view.slider('변화 속도', speed, 0, 0.6, 0.01)
    if (day === 18) {
      const octaves = uniform(4)
      const turbulence = uniform(0)
      let sum = float(0), weight = float(0)
      for (let i = 0; i < 4; i++) {
        const n = noise3D(vec3(p.mul(2 ** i), t))
        const amplitude = octaves.greaterThan(i).select(0.5 ** (i + 1), 0)
        sum = sum.add(mix(n, abs(n), turbulence).mul(amplitude))
        weight = weight.add(amplitude)
      }
      const normalized = sum.div(weight)
      value = mix(normalized.mul(0.5).add(0.5), normalized, turbulence)
      view.slider('Octave 수', octaves, 1, 4, 1)
      view.select('Noise 합성', [['fbm', 'fBM'], ['turbulence', 'Turbulence']], v => { turbulence.value = v === 'turbulence' ? 1 : 0 })
    } else {
      const strength = uniform(1.2)
      const axes = uniform(new THREE.Vector2(1, 1))
      const qView = uniform(0)
      const qx = fbm(p, t).sum
      const qy = fbm(p.add(vec2(5.2, 1.3)), t).sum
      const q = vec2(qx, qy).mul(axes)
      const f = fbm(p.add(q.mul(strength)), t).sum
      value = mix(mix(f, qx, qView.equal(1).select(1, 0)), qy, qView.equal(2).select(1, 0)).mul(0.5).add(0.5)
      view.slider('왜곡 강도', strength, 0, 2.5, 0.1)
      view.select('왜곡 방향', [['xy', 'X + Y'], ['x', 'X만'], ['y', 'Y만']], v => { axes.value.set(v === 'y' ? 0 : 1, v === 'x' ? 0 : 1) })
      view.select('표시', [['pattern', '최종 패턴'], ['qx', 'q.x'], ['qy', 'q.y']], v => { qView.value = v === 'qx' ? 1 : v === 'qy' ? 2 : 0 })
    }
    value = clamp(value, 0, 1)
    const contrast = day === 18 ? smoothstep(0.4, 0.7, value) : smoothstep(0.35, 0.65, value)
    value = mix(value, contrast, density)
    const teal = mix(vec3(0.02, 0.04, 0.1), vec3(0.25, 0.85, 0.9), value)
    const opal = mix(vec3(0.2, 0.8, 0.9), vec3(0.9, 0.3, 0.7), value)
    material.colorNode = mix(teal, opal, palette)
    view.select('색상 경계', [['soft', '부드럽게'], ['sharp', 'Smoothstep 밀도']], v => { density.value = v === 'sharp' ? 1 : 0 })
    view.select('색상', [['teal', '청록 구름'], ['opal', '청록 + 분홍']], v => { palette.value = v === 'opal' ? 1 : 0 })
  } else {
    const grid = uniform(12)
    const dashSpeed = uniform(0.45)
    const dashLength = uniform(0.14)
    const fixed = uniform(0)
    const display = uniform(0)
    const gridUV = uv().mul(grid), cell = floor(gridUV), local = fract(gridUV).sub(0.5)
    const p = cell.mul(scale), t = elapsed.mul(speed)
    let direction, magnitude = float(1)
    if (day === 20) {
      const angle = noise3D(vec3(p, t)).mul(Math.PI * 2)
      direction = vec2(cos(angle), sin(angle))
    } else {
      const e = uniform(0.02)
      const gradient = uniform(0)
      const showStrength = uniform(0)
      const noiseAt = p => noise3D(vec3(p, t))
      const dx = noiseAt(p.add(vec2(e, 0))).sub(noiseAt(p.sub(vec2(e, 0)))).div(e.mul(2))
      const dy = noiseAt(p.add(vec2(0, e))).sub(noiseAt(p.sub(vec2(0, e)))).div(e.mul(2))
      const flow = mix(vec2(dy, dx.negate()), vec2(dx, dy), gradient)
      const len = length(flow)
      direction = flow.div(max(len, 0.001))
      magnitude = mix(1, clamp(len, 0, 1), showStrength)
      view.slider('차분 간격', e, 0.005, 0.08, 0.005)
      view.select('방향 계산', [['curl', 'Curl'], ['gradient', 'Gradient']], v => { gradient.value = v === 'gradient' ? 1 : 0 })
      view.select('밝기', [['same', '동일'], ['strength', '흐름 강도']], v => { showStrength.value = v === 'strength' ? 1 : 0 })
    }
    const perpendicular = vec2(direction.y.negate(), direction.x)
    const along = dot(local, direction), across = abs(dot(local, perpendicular))
    const line = smoothstep(0.02, 0.055, across).oneMinus()
    const phase = fract(elapsed.mul(dashSpeed).add(cell.x.mul(0.17)).add(cell.y.mul(0.13)))
    const center = mix(phase.mul(0.7).sub(0.35), 0, fixed)
    const dash = smoothstep(dashLength.mul(0.43), dashLength, abs(along.sub(center))).oneMinus()
    const color = mix(vec3(0.01, 0.03, 0.08), vec3(0.25, 0.9, 1), line.mul(dash).mul(magnitude))
    material.colorNode = mix(color, vec3(line), display)
    view.slider('격자 밀도', grid, 6, 24, 1)
    view.slider('공간 크기', scale, 0.05, 0.5, 0.01)
    view.slider('방향 변화 속도', speed, 0, 0.3, 0.01)
    view.slider('선 이동 속도', dashSpeed, 0, 1, 0.05)
    view.slider('선 길이', dashLength, 0.06, 0.25, 0.01)
    view.select('선 중심', [['move', '이동'], ['fixed', '고정']], v => { fixed.value = v === 'fixed' ? 1 : 0 })
    view.select('표시', [['color', '색상'], ['line', '선 두께 마스크']], v => { display.value = v === 'line' ? 1 : 0 })
  }
  let paused = false
  view.select('재생', [['play', '재생'], ['pause', '일시정지']], v => { paused = v === 'pause' })
  view.button('초기화', () => { view.resets.forEach(fn => fn()); elapsed.value = 0 })
  const geometry = new THREE.PlaneGeometry(2, 2)
  view.scene.add(new THREE.Mesh(geometry, material))
  view.start(dt => { if (!paused) elapsed.value += dt; view.renderer.render(view.scene, view.camera) })
  return () => { geometry.dispose(); material.dispose(); view.dispose() }
}
