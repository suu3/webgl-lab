varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  float d = distance(uv, vec2(0.5));

    /**
    smoothstep(0.29, 0.3, d)는:
    - d < 0.29 이면 거의 0
    - d > 0.3 이면 거의 1
    - 그 사이 값은 부드럽게 변함
    */
  float circle = 1.0 - smoothstep(0.29, 0.3, d);

  gl_FragColor = vec4(vec3(circle), 1.0);
}