varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDirection;
void main() {
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
  vNormal = normalMatrix * normal;
  vViewDirection = -viewPosition.xyz;
  gl_Position = projectionMatrix * viewPosition;
}
