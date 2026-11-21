// ShaderMaterial용. elapsed=-1은 비활성. 기본 speed.45, width.1, frequency70, lifetime1.5, amplitude.025.
// clickA/B와 elapsedA/B를 각각 전달한다. 한 파동 모드는 elapsedB=-1.
uniform sampler2D uTexture;
uniform vec2 uClickA,uClickB;
uniform float uElapsedA,uElapsedB,uSpeed,uWidth,uFrequency,uLifetime,uAmplitude;
varying vec2 vUv;
vec2 ripple(vec2 click,float elapsed) {
  vec2 aspect=vec2(1.5,1),delta=(vUv-click)*aspect;
  float d=length(delta),age=max(elapsed,0.0),q=d-age*uSpeed;
  float ring=1.0-smoothstep(0.0,uWidth,abs(q));
  float fade=1.0-smoothstep(uLifetime*2.0/3.0,uLifetime,age);
  float active=smoothstep(0.0,.01,elapsed);
  return delta/max(d,.001)/aspect*cos(q*uFrequency)*ring*fade*active*uAmplitude;
}
void main() {
  vec2 offset=ripple(uClickA,uElapsedA)+ripple(uClickB,uElapsedB);
  offset/=max(length(offset)/.05,1.0);
  gl_FragColor=vec4(texture2D(uTexture,clamp(vUv+offset,0.0,1.0)).rgb,1);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
