import './style.css'

const lessons = {
  'day01-uv': ['Day 1 · UV', () => import('./lessons/day01-uv')],
  'day02-distance': ['Day 2 · Distance', () => import('./lessons/day02-distance')],
  'day03-smoothstep': ['Day 3 · Smoothstep', () => import('./lessons/day03-smoothstep')],
  'day04-sdf-rings': ['Day 4 · SDF Rings', () => import('./lessons/day04-sdf-rings')],
  'day05-time': ['Day 5 · Time', () => import('./lessons/day05-time')],
  'day06-patterns': ['Day 6 · Patterns', () => import('./lessons/day06-patterns')],
  'day07-rotation': ['Day 7 · Rotation', () => import('./lessons/day07-rotation')],
  'day08-polar': ['Day 8 · Polar', () => import('./lessons/day08-polar')],
  'day09-noise': ['Day 9 · Noise', () => import('./lessons/day09-noise')],
  'day10-uv-distortion': ['Day 10 · UV Distortion', () => import('./lessons/day10-uv-distortion')],
  'day11-vertex-deformation': ['Day 11 · Vertex Deformation', () => import('./lessons/day11-vertex-deformation')],
  'day12-texture-mouse': ['Day 12 · Texture & Mouse', () => import('./lessons/day12-texture-mouse')],
  'day13-chromatic-aberration': ['Day 13 · Chromatic Aberration', () => import('./lessons/day13-chromatic-aberration')],
  'day14-refraction-distortion': ['Day 14 · Refraction Distortion', () => import('./lessons/day14-refraction-distortion')],
  'day15-liquid-morphing': ['Day 15 · Liquid Morphing', () => import('./lessons/day15-liquid-morphing')],
  'day16-ripple-propagation': ['Day 16 · Ripple Propagation', () => import('./lessons/day16-ripple-propagation')],
  'day17-glitch': ['Day 17 · Glitch & Digital Corruption', () => import('./lessons/day17-glitch')],
  'day18-layered-noise': ['Day 18 · Layered Noise & fBM', () => import('./lessons/day18-layered-noise')],
  'day19-domain-warping': ['Day 19 · Domain Warping', () => import('./lessons/day19-domain-warping')],
  'day20-flow-field': ['Day 20 · Flow Field', () => import('./lessons/day20-flow-field')],
  'day21-curl-noise': ['Day 21 · Curl Noise', () => import('./lessons/day21-curl-noise')],
  'day22-particle-advection': ['Day 22 · Particle Advection', () => import('./lessons/day22-particle-advection')],
  'day23-gpu-particles': ['Day 23 · GPU Particle Simulation', () => import('./lessons/day23-gpu-particles')],
  'day24-particle-trails': ['Day 24 · Particle Trails & Feedback', () => import('./lessons/day24-particle-trails')],
  'day25-bloom': ['Day 25 · Bloom & Light Scattering', () => import('./lessons/day25-bloom')],
  'day26-chromatic-postprocessing': ['Day 26 · Chromatic Aberration Postprocessing', () => import('./lessons/day26-chromatic-postprocessing')],
  'day27-heat-haze': ['Day 27 · Heat Haze & Refraction', () => import('./lessons/day27-heat-haze')],
  'day28-liquid-lens': ['Day 28 · Liquid Lens & Edge Highlight', () => import('./lessons/day28-liquid-lens')],
  'day29-fresnel-fake-glass': ['Day 29 · Fresnel & Fake Glass', () => import('./lessons/day29-fresnel-fake-glass')],
  'day30-thin-film-iridescence': ['Day 30 · Thin-Film Iridescence', () => import('./lessons/day30-thin-film-iridescence')],
  'day31-layered-iridescence': ['Day 31 · Layered Iridescence & Parallax', () => import('./lessons/day31-layered-iridescence')],
  'week02-breathing-halo': ['Week 02 · Breathing Halo', () => import('./lessons/week02-breathing-halo')],
}
const requested = new URLSearchParams(location.search).get('lesson')
const active = Object.hasOwn(lessons, requested) ? requested : 'week02-breathing-halo'
const nav = document.createElement('nav')
nav.setAttribute('aria-label', '셰이더 실습 선택')
for (const [id, [label]] of Object.entries(lessons)) {
  const link = document.createElement('a')
  link.href = `?lesson=${id}`
  link.textContent = label
  if (id === active) link.setAttribute('aria-current', 'page')
  nav.append(link)
}
document.body.append(nav)
nav.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest' })
try {
  await lessons[active][1]()
} catch (error) {
  console.error(error)
  const message = document.createElement('p')
  message.className = 'error'
  message.setAttribute('role', 'alert')
  message.textContent = '셰이더를 실행하지 못했습니다. WebGL 2를 지원하는 브라우저에서 다시 시도해 주세요.'
  document.body.append(message)
}
