import * as THREE from 'three/webgpu'
import { Fn, instancedArray, instanceIndex, uniform, hash, vec3, vec2, sin, cos, fract, max, length, uv, smoothstep, instancedBufferAttribute } from 'three/tsl'
import { advanceCPU } from './particle-math.js'

export async function createParticleSystem(renderer, { gpu = false, count = 1000, constant = false } = {}) {
  const speed = uniform(constant ? 1 : 0.25)
  const velocity = uniform(new THREE.Vector2(0.2, 0.1))
  const field = uniform(constant ? 0 : 1)
  const delta = uniform(0)
  const brightness = uniform(1)
  const size = uniform(4)
  let positions, positionNode, initialize, compute, cpuAttribute
  const data = gpu ? null : new Float32Array(count * 3)
  if (gpu) {
    positions = instancedArray(count, 'vec3')
    initialize = Fn(() => {
      positions.element(instanceIndex).assign(vec3(hash(instanceIndex).mul(2).sub(1), hash(instanceIndex.add(17)).mul(2).sub(1), 0))
    })().compute(count)
    const scalar = Fn(([p]) => sin(p.x.mul(2.1).add(cos(p.y.mul(1.7)))).mul(cos(p.y.mul(1.9).sub(sin(p.x.mul(1.3))))))
    compute = Fn(() => {
      const p = positions.element(instanceIndex)
      const e = 0.01
      const dx = scalar(p.xy.add(vec2(e, 0))).sub(scalar(p.xy.sub(vec2(e, 0)))).div(2 * e)
      const dy = scalar(p.xy.add(vec2(0, e))).sub(scalar(p.xy.sub(vec2(0, e)))).div(2 * e)
      const flow = vec2(dy, dx.negate())
      const curl = flow.div(max(length(flow), 0.0001))
      const v = field.greaterThan(0.5).select(curl, velocity)
      const next = p.xy.add(v.mul(speed).mul(delta))
      // fract 기반 양방향 wrap은 음수 속도와 overshoot도 보존한다.
      p.assign(vec3(fract(next.add(1).div(2)).mul(2).sub(1), 0))
    })().compute(count)
    positionNode = positions.toAttribute()
    await renderer.computeAsync(initialize)
  } else {
    cpuAttribute = new THREE.InstancedBufferAttribute(data, 3)
    cpuAttribute.setUsage(THREE.DynamicDrawUsage)
    positionNode = instancedBufferAttribute(cpuAttribute)
  }
  const material = new THREE.PointsNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: false })
  material.positionNode = positionNode
  material.sizeNode = size
  material.colorNode = vec3(0.25, 0.9, 1).mul(brightness)
  material.opacityNode = smoothstep(0.18, 0.5, length(uv().sub(0.5))).oneMinus()
  const particles = new THREE.Sprite(material)
  // Sprite 인스턴싱으로 WebGPU의 1px Points 제한을 피한다.
  particles.geometry = particles.geometry.clone()
  particles.geometry.setAttribute('particlePosition', gpu ? positions.value : cpuAttribute)
  particles.count = count
  particles.frustumCulled = false
  let respawn = false, paused = false
  let seed = 12345
  function random() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  function reset() {
    if (gpu) renderer.compute(initialize)
    else {
      seed = 12345
      for (let i = 0; i < data.length; i += 3) { data[i] = random() * 2 - 1; data[i + 1] = random() * 2 - 1; data[i + 2] = 0 }
      cpuAttribute.needsUpdate = true
    }
  }
  if (!gpu) reset()
  return {
    particles, positions, data, speed, velocity, field, brightness, size,
    set respawn(value) { respawn = value }, set paused(value) { paused = value },
    reset,
    update(dt) {
      if (paused || speed.value === 0) return
      if (gpu) { delta.value = dt; renderer.compute(compute) }
      else { advanceCPU(data, dt, speed.value, respawn, random); cpuAttribute.needsUpdate = true }
    },
    dispose() {
      particles.geometry.dispose(); material.dispose()
      if (gpu) { initialize.dispose(); compute.dispose(); positions.dispose() }
    },
  }
}
