varying vec2 vUv;
uniform float uTime;
uniform vec2 uPointer;
uniform vec2 uResolution;
uniform int uSketch;
uniform float uRadius;
uniform float uThickness;
uniform float uSoftness;
uniform float uSpeed;
uniform vec3 uColor;

void main() {
  vec2 aspect = uResolution / min(uResolution.x, uResolution.y);
  vec2 p = (vUv - 0.5) * aspect;
  float d = length(p);

  // Sketch 01: 경계의 부드러움을 조절하며 복습한다.
  float circle = 1.0 - smoothstep(uRadius - uSoftness, uRadius, d);
  // TODO Sketch 02: sin(uTime * uSpeed)로 breath를 만들고 d에 더한다.
  // TODO Sketch 03: 두 원의 차이로 링을 만들고 uPointer 주변을 변형한다.
  // TODO 링 경계까지의 거리로 부드러운 발광을 추가한다.
  gl_FragColor = vec4(mix(vec3(0.01, 0.02, 0.05), uColor, circle), 1.0);
}
