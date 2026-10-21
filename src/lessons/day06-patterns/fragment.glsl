varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uTiles;
uniform float uSpeed;
uniform float uFilled;

void main() {
  vec2 p = (vUv - 0.5) * uResolution / min(uResolution.x, uResolution.y);
  vec2 tileUV = fract((p + 0.5) * uTiles) - 0.5;
  float d = length(tileUV);
  float radius = 0.08 + mod(uTime * uSpeed, 1.0) * 0.28;
  float ring = 1.0 - smoothstep(0.015, 0.03, abs(d - radius));
  float disk = 1.0 - smoothstep(radius - 0.015, radius + 0.015, d);
  float mask = mix(ring, disk, uFilled);
  gl_FragColor = vec4(mix(vec3(0.01, 0.02, 0.05), vec3(0.2, 0.8, 1.0), mask), 1.0);
}
