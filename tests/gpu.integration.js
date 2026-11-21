import * as THREE from 'three/webgpu'
import { createParticleSystem } from '../src/lessons/shared/particle-system.js'
export async function checkGPU() {
  const renderer = new THREE.WebGPURenderer()
  await renderer.init()
  const simulation = await createParticleSystem(renderer, { gpu: true, count: 1000, constant: true })
  const before = new Float32Array(await renderer.getArrayBufferAsync(simulation.positions.value))
  simulation.update(0.05)
  const after = new Float32Array(await renderer.getArrayBufferAsync(simulation.positions.value))
  let checked = 0
  const stride = before.length / 1000
  for (let i = 0; i < 1000; i++) {
    const wrap = x => ((x + 1) % 2 + 2) % 2 - 1
    if (Math.abs(after[i * stride] - wrap(before[i * stride] + 0.01)) > 1e-5) throw Error('X update mismatch ' + i)
    if (Math.abs(after[i * stride + 1] - wrap(before[i * stride + 1] + 0.005)) > 1e-5) throw Error('Y update mismatch ' + i)
    checked++
  }
  simulation.velocity.value.set(-20, -20)
  simulation.update(0.05)
  const reverse = new Float32Array(await renderer.getArrayBufferAsync(simulation.positions.value))
  for (let i = 0; i < reverse.length; i += stride) {
    if (reverse[i] < -1 || reverse[i] >= 1 || reverse[i + 1] < -1 || reverse[i + 1] >= 1) throw Error('wrap bounds')
  }
  simulation.reset()
  const reset = new Float32Array(await renderer.getArrayBufferAsync(simulation.positions.value))
  if (reset.some((v, i) => v !== before[i])) throw Error('GPU reset mismatch')
  simulation.dispose(); renderer.dispose()
  return { checked, stride, realCompute: true, bidirectionalWrap: true, deterministicReset: true }
}

export async function checkFeedback() {
  const { uniform, vec4 } = await import('three/tsl')
  const { createFeedback } = await import('../src/lessons/shared/feedback.js')
  const renderer = new THREE.WebGPURenderer()
  await renderer.init()
  renderer.setSize(4, 4)
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1,1,1,-1,.1,10)
  camera.position.z = 2
  const color = uniform(new THREE.Vector3(.2,.3,.4))
  const material = new THREE.MeshBasicNodeMaterial()
  material.colorNode = color
  const geometry = new THREE.PlaneGeometry(2,2)
  scene.add(new THREE.Mesh(geometry,material))
  const feedback = createFeedback(renderer,scene,camera)
  feedback.resize(4,4)
  const capture = new THREE.RenderTarget(4,4,{type:THREE.HalfFloatType,depthBuffer:false})
  const captureMaterial = new THREE.NodeMaterial()
  captureMaterial.fragmentNode = vec4(feedback.output.rgb,1)
  const quad = new THREE.QuadMesh(captureMaterial)
  async function sample() {
    renderer.setRenderTarget(capture); quad.render(renderer); renderer.setRenderTarget(null)
    const data = await renderer.readRenderTargetPixelsAsync(capture,1,1,1,1)
    return [...data.slice(0,3)].map(v=>THREE.DataUtils.fromHalfFloat(v))
  }
  const verify = (values,expected,label) => {values.forEach((v,i)=>{if(Math.abs(v-expected[i])>.002)throw Error(label+': '+values)})}
  feedback.render(1/60)
  const first=await sample();verify(first,[.2,.3,.4],'first')
  color.value.set(0,0,0);feedback.render(1/60)
  const decay=await sample();verify(decay,[.192,.288,.384],'decay')
  color.value.set(.1,.1,.1);feedback.blendMax.value=1;feedback.render(1/60)
  const maximum=await sample();verify(maximum,[.18432,.27648,.36864],'max')
  feedback.reset();color.value.set(0,0,0);feedback.render(1/60)
  const cleared=await sample();verify(cleared,[0,0,0],'clear')
  feedback.blendMax.value=0;color.value.set(.2,.3,.4);feedback.render(1/60)
  color.value.set(0,0,0);feedback.rgbDecay.value=1;feedback.render(1/60)
  const rgb=await sample();verify(rgb,[.188,.291,.396],'rgb')
  feedback.resize(8,8);feedback.render(1/60)
  verify(await sample(),[0,0,0],'resize')
  feedback.dispose();capture.dispose();captureMaterial.dispose();geometry.dispose();material.dispose();renderer.dispose()
  return {first,decay,maximum,cleared,rgb,resizeCleared:true}
}
