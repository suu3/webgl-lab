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
// 기본값 radius .3, pulse .008, width .025, highlight .75, asymmetric 0, mode 0.
uniform float uPulse;
uniform float uWidth;
uniform float uHighlight;
uniform float uAsymmetric;
uniform float uMode;
void main() {
  vec2 centered = (vUv - 0.5) * vec2(1.5, 1.0);
  float dist = length(centered);
  float radius = uRadius + sin(uTime * 1.5) * uPulse;
  float d = dist - radius;
  float mask = 1.0 - smoothstep(-0.005, 0.005, d);
  float rim = 1.0 - smoothstep(0.0, uWidth, abs(d));
  float light = clamp(dot(centered / max(dist, 0.0001), normalize(vec2(-0.7, 0.7))), 0.0, 1.0);
  float litRim = rim * mix(1.0, light, uAsymmetric);
  float wave = sin(dot(vUv, uAxis) * uFrequency - uTime * uSpeed);
  vec2 displaced = clamp(vUv + uFlow * wave * uStrength * mask, 0.0, 1.0);
  vec3 color = texture2D(uBackground, displaced).rgb;
  color = mix(color, vec3(0.65, 0.92, 1.0), litRim * uHighlight);
  gl_FragColor = vec4(mix(color, vec3(rim), uMode), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
