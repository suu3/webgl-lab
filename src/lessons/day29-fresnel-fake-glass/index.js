import * as THREE from 'three/webgpu'
import { normalView, positionViewDirection, dot, clamp, pow, vec3, uniform, mix } from 'three/tsl'
import { createSphereLesson } from '../shared/sphere-lesson.js'

const power = uniform(3)
const glass = uniform(0)
const dualColor = uniform(0)
const fresnel = pow(clamp(dot(normalView, positionViewDirection), 0, 1).oneMinus(), power)
const colorfulRim = mix(vec3(0.1, 0.8, 0.9), vec3(0.7, 0.2, 1), fresnel)
const rim = mix(vec3(0.35, 0.85, 1), colorfulRim, dualColor)
const material = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false })
material.colorNode = mix(vec3(0.02, 0.12, 0.18), rim, fresnel)
material.opacityNode = mix(1, fresnel.mul(0.75).add(0.08), glass)
const dispose = await createSphereLesson({
  title: 'Day 29 · Fresnel & Fake Glass',
  description: 'F = (1 − dot(N, V))ᵖ · 드래그: 시점 이동 / 휠·핀치: 확대. 지수 1·3·6으로 테두리 폭을 비교하세요. Fake Glass 0은 불투명, 1은 정면 0.08·가장자리 0.83의 투명도입니다. 배경 굴절 없이 알파와 색으로 유리를 근사합니다.',
  material,
  sliders: [
    ['Fresnel 지수', power, 1, 6, 0.1],
    ['Fake Glass', glass, 0, 1, 1],
    ['이중 색상 하이라이트', dualColor, 0, 1, 1],
  ],
})
import.meta.hot?.dispose(dispose)
