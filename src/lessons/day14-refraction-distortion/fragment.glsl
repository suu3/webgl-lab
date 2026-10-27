// Three.js ShaderMaterial용 비교본. TSL과 같은 uniform을 전달한다.
varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uCenter; // (0.5, 0.5)
uniform vec2 uAspect; // (1.5, 1.0)
uniform float uStrength; // -0.28
uniform float uRadius; // 0.32
uniform float uSoftness; // 0.1, 0 < uSoftness < uRadius
uniform float uGlobalMode; // 원형 0, 전체 1
uniform float uRimAmount; // 없음 0, 표시 1
void main() {
  vec2 p = vUv - uCenter;
  float d = length(p * uAspect);
  float lens = 1.0 - smoothstep(uRadius - uSoftness, uRadius, d);
  float mask = mix(lens, 1.0, uGlobalMode);
  vec2 warpedUV = clamp(vUv + p * uStrength * mask, 0.0, 1.0);
  vec3 color = texture2D(uTexture, warpedUV).rgb;
  float rim = 1.0 - smoothstep(0.008, 0.025, abs(d - (uRadius - 0.02)));
  gl_FragColor = vec4(mix(color, vec3(0.8, 0.95, 1.0), rim * uRimAmount * 0.6), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
