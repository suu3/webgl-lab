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
