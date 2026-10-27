// Three.js ShaderMaterial용 GLSL 비교본.
varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uMouse; // 비활성: (-10, -10)
uniform float uAmplitude; // 0.012
uniform float uEdgeStart; // 0.1
uniform float uEdgeEnd; // 0.65 (항상 uEdgeStart보다 크게)
uniform float uRadius; // 0.25
uniform float uHorizontal; // 방사형 0, 수평 1
uniform float uPointerMode; // 가장자리 0, 마우스 주변 1
void main() {
  vec2 center = mix(vec2(0.5), uMouse, uPointerMode);
  vec2 p = vUv - center;
  float dist = length(p);
  vec2 direction = mix(p / max(dist, 0.001), vec2(1.0, 0.0), uHorizontal);
  float edgeMask = smoothstep(uEdgeStart, uEdgeEnd, dist);
  float pointerMask = 1.0 - smoothstep(0.0, uRadius, dist);
  float strength = mix(edgeMask, pointerMask, uPointerMode) * uAmplitude;
  vec2 offset = direction * strength;
  vec2 uvR = clamp(vUv + offset, 0.0, 1.0);
  vec2 uvB = clamp(vUv - offset, 0.0, 1.0);
  float r = texture2D(uTexture, uvR).r;
  float g = texture2D(uTexture, vUv).g;
  float b = texture2D(uTexture, uvB).b;
  gl_FragColor = vec4(r, g, b, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
