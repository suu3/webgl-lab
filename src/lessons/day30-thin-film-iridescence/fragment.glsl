// uThickness = 3.0, uExponent = 3.0. TSL 제어값과 동일하게 전달한다.
uniform float uThickness;
uniform float uExponent;
varying vec3 vNormal;
varying vec3 vViewDirection;
void main() {
  float angle = 1.0 - clamp(dot(normalize(vNormal), normalize(vViewDirection)), 0.0, 1.0);
  vec3 rainbow = 0.5 + 0.5 * cos(angle * uThickness * 6.28318530718 + vec3(0.0, 2.1, 4.2));
  gl_FragColor = vec4(mix(vec3(0.02, 0.04, 0.08), rainbow, pow(angle, uExponent)), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
