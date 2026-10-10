varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position =
    projectionMatrix * // 카메라 투영 행렬
    modelViewMatrix * // 모델 뷰 행렬
    vec4(position, 1.0);
}