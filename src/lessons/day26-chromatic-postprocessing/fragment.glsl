// 전체 장면 RenderTarget의 선형 HDR 텍스처를 uScene에 전달한다.
// 기본값 strength .025, influence 0, useEdge 1. 최종 출력 패스에서만 색 공간 변환.
uniform sampler2D uScene;
uniform float uStrength;
uniform float uMouseInfluence;
uniform float uUseEdge;
varying vec2 vUv;
void main() {
  vec2 centered = vUv - 0.5;
  float edge = smoothstep(0.1, 0.65, length(centered));
  vec2 offset = centered * (uStrength + uMouseInfluence) * mix(1.0, edge, uUseEdge);
  float r = texture2D(uScene, clamp(vUv + offset, 0.0, 1.0)).r;
  float g = texture2D(uScene, vUv).g;
  float b = texture2D(uScene, clamp(vUv - offset, 0.0, 1.0)).b;
  gl_FragColor = vec4(r, g, b, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
