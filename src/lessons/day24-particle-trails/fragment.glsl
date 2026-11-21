// Ping-Pong 합성용 중간 패스. 읽는 RenderTarget과 쓰는 RenderTarget을 반드시 분리한다.
// 선형 HDR 텍스처 입력/출력이며 여기서는 출력 색 공간 변환을 적용하지 않는다.
// retention.96, deltaTime초, maxBlend0, rgbDecay0.
uniform sampler2D uPreviousFrame,uCurrentParticles;
uniform float uRetention,uDeltaTime,uMaxBlend,uRGBDecay;
varying vec2 vUv;
void main(){
  float scale=max(uDeltaTime*60.0,.0001);
  vec3 r=mix(vec3(uRetention),vec3(.94,.97,.99),uRGBDecay);
  vec3 previous=texture2D(uPreviousFrame,vUv).rgb*pow(r,vec3(scale));
  vec3 current=texture2D(uCurrentParticles,vUv).rgb;
  vec3 added=min(previous+current*scale,vec3(1));
  gl_FragColor=vec4(mix(added,max(previous,current),uMaxBlend),1);
}
