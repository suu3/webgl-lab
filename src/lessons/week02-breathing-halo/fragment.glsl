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
  float breath = sin(uTime * uSpeed) * 0.02;
  vec3 background = vec3(0.01, 0.02, 0.05);

  if (uSketch == 1) {
    float circle = 1.0 - smoothstep(uRadius - uSoftness, uRadius, d);
    gl_FragColor = vec4(mix(background, uColor, circle), 1.0);
  } else if (uSketch == 2) {
    // 거리에 양수를 더하면 경계에 도달하는 실제 반지름은 작아진다.
    float circle = 1.0 - smoothstep(uRadius - uSoftness, uRadius, d + breath);
    gl_FragColor = vec4(mix(background, uColor, circle), 1.0);
  } else {
    vec2 pointer = (uPointer - 0.5) * aspect;
    float influence = 1.0 - smoothstep(0.0, 0.28, distance(p, pointer));
    float warpedDistance = d + breath - influence * 0.035;
    // 안쪽 원을 바깥 원에서 빼서 고리를 만든다.
    float outer = 1.0 - smoothstep(uRadius, uRadius + uSoftness, warpedDistance);
    float inner = 1.0 - smoothstep(uRadius - uThickness - uSoftness, uRadius - uThickness, warpedDistance);
    float ring = max(outer - inner, 0.0);
    float ringDistance = abs(warpedDistance - (uRadius - uThickness * 0.5));
    float glow = 1.0 - smoothstep(0.0, 0.08, ringDistance);
    vec3 color = background + uColor * glow * 0.4;
    color = mix(color, uColor, ring);
    gl_FragColor = vec4(color, 1.0);
  }
}
