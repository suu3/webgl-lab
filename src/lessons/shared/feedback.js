import * as THREE from 'three/webgpu'
import { texture, uniform, vec3, vec4, min, max, mix, pow } from 'three/tsl'

export function createFeedback(renderer, scene, camera, { hdr = false } = {}) {
  const options = { depthBuffer: false, stencilBuffer: false, type: THREE.HalfFloatType }
  const particleTarget = new THREE.RenderTarget(1, 1, options)
  let read = new THREE.RenderTarget(1, 1, options)
  let write = new THREE.RenderTarget(1, 1, options)
  const previous = texture(read.texture)
  const current = texture(particleTarget.texture)
  const output = texture(read.texture)
  const retention = uniform(0.96)
  const blendMax = uniform(0)
  const rgbDecay = uniform(0)
  const frameScale = uniform(1)
  const channelRetention = mix(vec3(retention), vec3(0.94, 0.97, 0.99), rgbDecay)
  const faded = previous.rgb.mul(pow(channelRetention, frameScale))
  const sum = min(faded.add(current.rgb.mul(frameScale)), vec3(hdr ? 8 : 1))
  const result = mix(sum, max(faded, current.rgb), blendMax)
  const material = new THREE.NodeMaterial()
  material.fragmentNode = vec4(result, 1)
  material.depthTest = false
  material.depthWrite = false
  const quad = new THREE.QuadMesh(material)
  let pendingClear = true
  function clear() {
    const original = renderer.getRenderTarget()
    const clearColor = renderer.getClearColor(new THREE.Color())
    const clearAlpha = renderer.getClearAlpha()
    renderer.setClearColor(0, 1)
    for (const target of [read, write, particleTarget]) {
      renderer.setRenderTarget(target); renderer.clear()
    }
    renderer.setRenderTarget(original)
    renderer.setClearColor(clearColor, clearAlpha)
    pendingClear = false
  }
  return {
    output, retention, blendMax, rgbDecay,
    reset() { clear() },
    resize(w, h) {
      if (read.width === w && read.height === h) return
      for (const target of [read, write, particleTarget]) target.setSize(w, h)
      pendingClear = true
    },
    render(dt) {
      if (pendingClear) clear()
      frameScale.value = Math.max(dt * 60, 0.0001)
      const original = renderer.getRenderTarget()
      renderer.setRenderTarget(particleTarget)
      renderer.render(scene, camera)
      previous.value = read.texture
      renderer.setRenderTarget(write)
      quad.render(renderer)
      output.value = write.texture
      ;[read, write] = [write, read]
      renderer.setRenderTarget(original)
    },
    dispose() { material.dispose(); read.dispose(); write.dispose(); particleTarget.dispose() },
  }
}
