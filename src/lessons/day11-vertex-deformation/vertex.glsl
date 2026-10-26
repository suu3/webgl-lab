// ShaderMaterial 비교본. 기본값은 TSL 실행본의 uniform과 동일하다.
uniform float uTime;
uniform float uAmplitude; // 0.18
uniform float uFrequency; // 8.0
uniform float uSpeed; // 2.0
uniform float uDirectionY; // X: 0.0, 대각선: 0.625
uniform float uWaveAmount; // 파도/혼합: 1.0, 노이즈: 0.0
uniform float uNoiseAmount; // 파도: 0.0, 노이즈/혼합: 1.0

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
  vec3 pos = position;
  float phase = pos.x * uFrequency + pos.y * uFrequency * uDirectionY - uTime * uSpeed;
  float wave = sin(phase);
  float noise = noise3D(vec3(pos.xy * 2.0, uTime * uSpeed * 0.15));
  pos.z += (wave * uWaveAmount + noise * uNoiseAmount) * uAmplitude;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
