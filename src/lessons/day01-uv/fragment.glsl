//fragment shader: 색상 결정
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  gl_FragColor = vec4( //rgba
    uv.x,
    uv.y,
    0.0,
    1.0
  );
}