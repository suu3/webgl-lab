varying vec2 vUv;
uniform float uTime;
uniform float uStrength; // 기본값 0.06
uniform float uFrequency; // 기본값 4.0
uniform float uSpeed; // 기본값 0.3
uniform vec2 uDirection; // XY: (1,1), X: (1,0), Y: (0,1)
uniform float uNoiseAmount; // 노이즈/혼합: 1.0, 물결: 0.0
uniform float uWaveAmount; // 물결/혼합: 1.0, 노이즈: 0.0

// 3D Value Noise (Simplex Noise와 구분).
float randomValue(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}
float noise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 w = smoothstep(vec3(0.0), vec3(1.0), f);
  float z0 = mix(
    mix(randomValue(i), randomValue(i + vec3(1, 0, 0)), w.x),
    mix(randomValue(i + vec3(0, 1, 0)), randomValue(i + vec3(1, 1, 0)), w.x), w.y);
  float z1 = mix(
    mix(randomValue(i + vec3(0, 0, 1)), randomValue(i + vec3(1, 0, 1)), w.x),
    mix(randomValue(i + vec3(0, 1, 1)), randomValue(i + vec3(1, 1, 1)), w.x), w.y);
  return mix(z0, z1, w.z) * 2.0 - 1.0;
}
void main() {
  vec2 p = vUv * uFrequency;
  float t = uTime * uSpeed;
  float nx = noise3D(vec3(p, t));
  float ny = noise3D(vec3(p + vec2(17.4, 9.2), t));
  float wave = sin(vUv.y * 20.0 + t) * 0.03;
  vec2 offset = (vec2(nx, ny) * uStrength * uNoiseAmount
    + vec2(wave * uWaveAmount, 0.0)) * uDirection;
  vec2 distortedUV = vUv + offset;
  float mask = smoothstep(-0.1, 0.1, sin(distortedUV.x * 40.0));
  gl_FragColor = vec4(mix(vec3(0.02, 0.03, 0.08), vec3(0.2, 0.8, 1.0), mask), 1.0);
}
