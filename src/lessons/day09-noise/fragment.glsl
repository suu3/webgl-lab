varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uStrength;
uniform float uFrequency;
uniform float uSpeed;

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
  vec2 p = (vUv - 0.5) * uResolution / min(uResolution.x, uResolution.y);
  float n = noise3D(vec3((p + 0.5) * uFrequency, uTime * uSpeed));
  float radius = 0.3 + n * uStrength;
  float ring = 1.0 - smoothstep(0.008, 0.018, abs(length(p) - radius));
  gl_FragColor = vec4(mix(vec3(0.01, 0.02, 0.05), vec3(0.2, 0.8, 1.0), ring), 1.0);
}
