import * as THREE from 'three/webgpu'
import { normalView, positionViewDirection, dot, clamp, cos, pow, vec3, uniform, mix } from 'three/tsl'
import { createSphereLesson } from '../shared/sphere-lesson.js'

const thickness = uniform(3)
const exponent = uniform(3)
// 두 노드 모두 View Space. 설치된 Three.js에서 V는 표면 → 카메라 방향이다.
const angle = clamp(dot(normalView, positionViewDirection), 0, 1).oneMinus()
const iridescence = cos(angle.mul(thickness).mul(Math.PI * 2).add(vec3(0, 2.1, 4.2))).mul(0.5).add(0.5)
const material = new THREE.MeshBasicNodeMaterial()
material.colorNode = mix(vec3(0.02, 0.04, 0.08), iridescence, pow(angle, exponent))
const dispose = await createSphereLesson({
  title: 'Day 30 · Thin-Film Iridescence',
  description: 'RGB = 0.5 + 0.5 cos(angle × thickness × 2π + phase) · 드래그: 시점 이동 / 휠·핀치: 확대. 두께 1·3·6, Fresnel 지수 1·3·6을 비교하세요. 완전한 구체는 회전해도 같은 법선 분포를 유지합니다. 물리적 박막 간섭의 예술적 근사입니다.',
  material,
  sliders: [
    ['가상 막 두께', thickness, 1, 6, 0.1],
    ['Fresnel 지수', exponent, 1, 6, 0.1],
  ],
})
import.meta.hot?.dispose(dispose)
