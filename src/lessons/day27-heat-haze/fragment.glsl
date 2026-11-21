// ShaderMaterial용 비교본. 로컬 sample.svg는 sRGB 텍스처로 연결한다.
// 공통 기본값: strength .012, speed 3, frequency 35, flow (1,0), axis (0,1).
uniform sampler2D uBackground;
uniform float uTime;
uniform float uStrength;
uniform float uSpeed;
uniform float uFrequency;
uniform float uRadius;
uniform vec2 uFlow;
uniform vec2 uAxis;
varying vec2 vUv;
// 기본값 radius .38, softness .13. 비율 보정으로 화면에서 원형을 유지한다.
uniform float uSoftness;
void main() {
  vec2 centered = (vUv - 0.5) * vec2(1.5, 1.0);
  float mask = 1.0 - smoothstep(uRadius - uSoftness, uRadius, length(centered));
  float wave = sin(dot(vUv, uAxis) * uFrequency - uTime * uSpeed);
  vec2 displaced = clamp(vUv + uFlow * wave * uStrength * mask, 0.0, 1.0);
  gl_FragColor = vec4(texture2D(uBackground, displaced).rgb, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
