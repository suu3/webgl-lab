// 밝기 추출: 선형 HDR 입력. 이 중간 패스에는 출력 색 공간 변환을 적용하지 않는다.
uniform sampler2D uScene;
uniform float uThreshold;
varying vec2 vUv;
void main() {
  vec3 color = texture2D(uScene, vUv).rgb;
  float brightness = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float mask = smoothstep(uThreshold, uThreshold + 0.01, brightness);
  gl_FragColor = vec4(color * mask, 1.0);
}
