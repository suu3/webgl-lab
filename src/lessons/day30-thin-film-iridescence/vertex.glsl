// ShaderMaterial용 비교본. fragment.glsl과 함께 사용한다.
varying vec3 vNormal;
varying vec3 vViewDirection;
void main() {
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalMatrix * normal;
  vViewDirection = -viewPosition.xyz;
  gl_Position = projectionMatrix * viewPosition;
}
