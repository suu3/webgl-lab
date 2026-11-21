// ShaderMaterial용. transparent: true, depthWrite: false.
// 기본값 uPower = 3, uGlass = 0, uDualColor = 0.
uniform float uPower;
uniform float uGlass;
uniform float uDualColor;
varying vec3 vNormal;
varying vec3 vViewDirection;
void main() {
  float f = pow(1.0 - clamp(dot(normalize(vNormal), normalize(vViewDirection)), 0.0, 1.0), uPower);
  vec3 colorfulRim = mix(vec3(0.1, 0.8, 0.9), vec3(0.7, 0.2, 1.0), f);
  vec3 rim = mix(vec3(0.35, 0.85, 1.0), colorfulRim, uDualColor);
  gl_FragColor = vec4(mix(vec3(0.02, 0.12, 0.18), rim, f), mix(1.0, f * 0.75 + 0.08, uGlass));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
