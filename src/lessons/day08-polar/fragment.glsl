varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uPetals;
uniform float uSpeed;
uniform float uSharpness;

void main() {
  vec2 p = (vUv - 0.5) * uResolution / min(uResolution.x, uResolution.y);
  float r = length(p);
  float a = atan(p.y, (p.x == 0.0 && p.y == 0.0) ? 0.000001 : p.x) + uTime * uSpeed;
  float wave = pow(cos(a * uPetals) * 0.5 + 0.5, uSharpness);
  float boundary = 0.2 + 0.2 * wave;
  float mask = 1.0 - smoothstep(boundary - 0.015, boundary + 0.015, r);
  gl_FragColor = vec4(mix(vec3(0.01, 0.02, 0.05), vec3(0.2, 0.8, 1.0), mask), 1.0);
}
