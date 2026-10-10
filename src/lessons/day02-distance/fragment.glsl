varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  //vec2(0.5) : (0.5, 0.5), 중심점을 의미
  //float d = distance(uv, vec2(0.5)); : uv와 중심점 사이의 거리를 계산
  //gl_FragColor = vec4(vec3(d), 1.0); : d를 이용하여 색상을 결정
  float d = distance(uv, vec2(0.5));

  //(d, d, d, 1.0) : 결과물 = 방사형 그라데이션
  gl_FragColor = vec4(vec3(d), 1.0);
}