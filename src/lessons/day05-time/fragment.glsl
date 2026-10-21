varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uSpeed;
uniform float uSpeed2;

void main() {
  vec2 p = (vUv - 0.5) * uResolution / min(uResolution.x, uResolution.y);
  float d = length(p);
  float r1 = 0.22 + sin(uTime * uSpeed) * 0.04;
  float r2 = 0.36 + cos(uTime * uSpeed2) * 0.04;
  float mask = max(1.0 - smoothstep(0.008, 0.016, abs(d - r1)),
                   1.0 - smoothstep(0.008, 0.016, abs(d - r2)));
  gl_FragColor = vec4(mix(vec3(0.01, 0.02, 0.05), vec3(0.2, 0.8, 1.0), mask), 1.0);
}
