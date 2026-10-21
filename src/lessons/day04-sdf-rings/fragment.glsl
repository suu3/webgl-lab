varying vec2 vUv;
uniform vec2 uResolution;
uniform float uThickness;
uniform float uSoftness;
uniform float uGlow;
uniform float uOffset;

// abs(length(p) - radius): 원의 경계 양쪽까지의 거리.
vec3 layer(vec3 background, vec2 p, float radius, float width, vec3 color) {
  float ringDistance = abs(length(p) - radius);
  float ring = 1.0 - smoothstep(width, width + uSoftness, ringDistance);
  float glow = 1.0 - smoothstep(0.0, 0.08, ringDistance);
  return mix(background + color * glow * uGlow, color, ring);
}
void main() {
  vec2 p = (vUv - 0.5) * uResolution / min(uResolution.x, uResolution.y);
  vec3 color = vec3(0.01, 0.02, 0.05);
  color = layer(color, p, 0.12, uThickness * 0.5, vec3(1.0));
  color = layer(color, p - vec2(uOffset, 0.0), 0.25, uThickness, vec3(0.1, 0.8, 1.0));
  color = layer(color, p - vec2(-uOffset, uOffset * 0.5), 0.38, uThickness * 1.5, vec3(0.1, 0.3, 1.0));
  gl_FragColor = vec4(color, 1.0);
}
