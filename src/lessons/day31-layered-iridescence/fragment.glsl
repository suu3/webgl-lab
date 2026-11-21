// ShaderMaterial용. 기본값: depth .6, strength .08, frequencies (12,16,20), reflection .55.
uniform float uDepth;
uniform float uStrength;
uniform vec3 uFrequencies;
uniform float uReflection;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDirection;
void main() {
  vec3 V = normalize(vViewDirection);
  vec2 offset = V.xy * uStrength;
  vec2 a = vUv + offset * 0.2;
  vec2 b = vUv + offset * uDepth;
  vec2 c = vUv + offset;
  vec3 colorA = mix(vec3(0.02, 0.25, 0.3), vec3(0.1, 0.9, 0.85), sin(a.x * uFrequencies.x) * 0.5 + 0.5);
  vec3 colorB = mix(vec3(0.12, 0.02, 0.25), vec3(0.65, 0.3, 1.0), cos(b.y * uFrequencies.y) * 0.5 + 0.5);
  vec3 colorC = mix(vec3(0.25, 0.02, 0.15), vec3(1.0, 0.45, 0.75), sin((c.x + c.y) * uFrequencies.z) * 0.5 + 0.5);
  vec3 layered = mix(mix(colorA, colorB, 0.4), colorC, 0.25);
  float fresnel = pow(1.0 - clamp(dot(normalize(vNormal), V), 0.0, 1.0), 3.0);
  gl_FragColor = vec4(mix(layered, vec3(0.75, 0.95, 1.0), fresnel * uReflection), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
