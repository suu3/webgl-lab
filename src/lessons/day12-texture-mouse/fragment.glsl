// Three.js ShaderMaterial용 비교본. TSL 실행본과 동일한 제어값을 전달한다.
varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uMouse; // 비활성: (-10, -10)
uniform vec2 uAspect; // (1.5, 1.0)
uniform float uTime;
uniform float uRadius; // 0.3
uniform float uAmplitude; // 0.015
uniform float uFrequency; // 60.0
uniform float uSpeed; // 6.0
uniform float uHorizontal; // 방사형: 0.0, 수평: 1.0
uniform float uMotionGain; // 기본: 1.0, 이동 모드: 감쇠한 속도
void main() {
  vec2 delta = (vUv - uMouse) * uAspect;
  float dist = length(delta);
  float influence = 1.0 - smoothstep(0.0, uRadius, dist);
  float wave = sin(dist * uFrequency - uTime * uSpeed);
  vec2 direction = mix(delta / max(dist, 0.001) / uAspect, vec2(1.0, 0.0), uHorizontal);
  vec2 offset = direction * wave * uAmplitude * influence * uMotionGain;
  vec2 distortedUV = clamp(vUv + offset, 0.0, 1.0);
  gl_FragColor = texture2D(uTexture, distortedUV);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
