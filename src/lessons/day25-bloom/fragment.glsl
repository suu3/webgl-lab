// 교육용 Bloom 합성 패스. 런타임은 Three.js BloomNode의 다중 해상도 구현을 사용한다.
// 별도 HDR RenderTarget에 bright.glsl → blur.glsl 가로 → blur.glsl 세로를 렌더링한 뒤 연결한다.
// scene과 blur는 선형 HDR 색상. strength 기본값 .8.
uniform sampler2D uScene;
uniform sampler2D uBlur;
uniform float uStrength;
varying vec2 vUv;
void main() {
  vec3 color = texture2D(uScene, vUv).rgb + texture2D(uBlur, vUv).rgb * uStrength;
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
