import * as THREE from 'three'

import vertexShader from './vertex.glsl?raw'
import fragmentShader from './fragment.glsl?raw'

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(
  -1,
  1,
  1,
  -1,
  0.1,
  10
)

camera.position.z = 1

const renderer = new THREE.WebGLRenderer({
  antialias: true,
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

document.body.appendChild(renderer.domElement)

const geometry = new THREE.PlaneGeometry(2, 2)

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
})

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()