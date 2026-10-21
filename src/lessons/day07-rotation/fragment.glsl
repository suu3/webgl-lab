varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uSpeed;
uniform float uHeight;

void main() {
  vec2 p = (vUv - 0.5) * uResolution / min(uResolution.x, uResolution.y);
  float angle = uTime * uSpeed;
  mat2 rotation = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
  vec2 rotated = rotation * p;
  float edge = max(abs(rotated.x), abs(rotated.y) / uHeight);
  float mask = 1.0 - smoothstep(0.15, 0.17, edge);
  gl_FragColor = vec4(mix(vec3(0.01, 0.02, 0.05), vec3(0.2, 0.8, 1.0), mask), 1.0);
}
