import * as THREE from 'three/webgpu'
import { uv, normalView, positionViewDirection, dot, clamp, cos, sin, pow, vec3, uniform, mix } from 'three/tsl'
import { createSphereLesson } from '../shared/sphere-lesson.js'

const depth = uniform(0.6)
const strength = uniform(0.08)
const frequencyA = uniform(12)
const frequencyB = uniform(16)
const frequencyC = uniform(20)
const reflection = uniform(0.55)
// 첨부 예제처럼 A·C 깊이는 고정하고 B 깊이를 조절한다.
// View Space XY를 UV에 더하는 근사이며 Tangent Space 매핑은 아니다.
const offset = positionViewDirection.xy.mul(strength)
const uvA = uv().add(offset.mul(0.2))
const uvB = uv().add(offset.mul(depth))
const uvC = uv().add(offset)
const patternA = sin(uvA.x.mul(frequencyA)).mul(0.5).add(0.5)
const patternB = cos(uvB.y.mul(frequencyB)).mul(0.5).add(0.5)
const patternC = sin(uvC.x.add(uvC.y).mul(frequencyC)).mul(0.5).add(0.5)
const colorA = mix(vec3(0.02, 0.25, 0.3), vec3(0.1, 0.9, 0.85), patternA)
const colorB = mix(vec3(0.12, 0.02, 0.25), vec3(0.65, 0.3, 1), patternB)
const colorC = mix(vec3(0.25, 0.02, 0.15), vec3(1, 0.45, 0.75), patternC)
const layered = mix(mix(colorA, colorB, 0.4), colorC, 0.25)
const fresnel = pow(clamp(dot(normalView, positionViewDirection), 0, 1).oneMinus(), 3)
const material = new THREE.MeshBasicNodeMaterial()
material.colorNode = mix(layered, vec3(0.75, 0.95, 1), fresnel.mul(reflection))
const dispose = await createSphereLesson({
  title: 'Day 31 · Layered Iridescence & Parallax',
  description: 'UVᵢ = UV + V.xy × depthᵢ × strength · 드래그해서 세 색상층의 움직임을 비교하세요. A 깊이 0.2 / B 깊이 조절 / C 깊이 1. 시차 강도 0으로 원본과 비교합니다. 실제 투명 볼륨 대신 UV 레이어를 합성하는 View Space 근사입니다.',
  material,
  sliders: [
    ['B 레이어 깊이', depth, 0, 1, 0.01],
    ['시차 강도', strength, 0, 0.3, 0.01],
    ['A 주파수', frequencyA, 1, 40, 1],
    ['B 주파수', frequencyB, 1, 40, 1],
    ['C 주파수', frequencyC, 1, 40, 1],
    ['표면 반사', reflection, 0, 1, 0.05],
  ],
})
import.meta.hot?.dispose(dispose)
