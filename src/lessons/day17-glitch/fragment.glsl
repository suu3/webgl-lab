// ShaderMaterial용. 기본: rows40, ticks12, threshold.86, strength.12, rgb0, selective1.
uniform sampler2D uTexture;
uniform float uTime, uRows, uTicks, uThreshold, uStrength, uRGB, uSelective;
varying vec2 vUv;
void main() {
  float row=floor(vUv.y*uRows), tick=floor(uTime*uTicks);
  float r=fract(sin(row*127.1+tick*311.7)*43758.5453);
  float active=mix(1.0,step(uThreshold,r),uSelective);
  vec2 p=clamp(vUv+vec2((r-.5)*uStrength*active,0),0.0,1.0);
  vec2 offset=vec2(uRGB*active,0);
  gl_FragColor=vec4(texture2D(uTexture,clamp(p+offset,0.0,1.0)).r,texture2D(uTexture,p).g,texture2D(uTexture,clamp(p-offset,0.0,1.0)).b,1);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
