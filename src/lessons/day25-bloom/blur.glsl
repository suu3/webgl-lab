// 분리형 Gaussian blur 비교본. 두 RenderTarget을 번갈아 사용한다.
// 가로 패스 uDirection=(1,0), 세로 패스=(0,1). uTexelSize=1/입력 크기.
uniform sampler2D uInput;
uniform vec2 uDirection;
uniform vec2 uTexelSize;
varying vec2 vUv;
void main() {
  vec2 stepUV = uDirection * uTexelSize;
  vec3 color = texture2D(uInput, vUv).rgb * 0.227027;
  color += texture2D(uInput, vUv + stepUV * 1.384615).rgb * 0.316216;
  color += texture2D(uInput, vUv - stepUV * 1.384615).rgb * 0.316216;
  color += texture2D(uInput, vUv + stepUV * 3.230769).rgb * 0.070270;
  color += texture2D(uInput, vUv - stepUV * 3.230769).rgb * 0.070270;
  gl_FragColor = vec4(color, 1.0);
}
