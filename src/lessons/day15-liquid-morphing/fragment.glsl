// ShaderMaterial용. 기본 amplitude.05, speed.3, radius.28, distortion-.28, tint.16, double0, display0.
uniform sampler2D uTexture;
uniform float uTime,uAmplitude,uSpeed,uRadius,uDistortion,uTint,uDouble,uDisplay;
varying vec2 vUv;
// Day 9의 signed 3D Value Noise. Simplex Noise와 다른 알고리즘이다.
float randomValue(vec3 p) { return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }
float noise3D(vec3 p) {
  vec3 i = floor(p), f = fract(p), w = smoothstep(0.0,1.0,f);
  float a = mix(mix(randomValue(i),randomValue(i+vec3(1,0,0)),w.x),mix(randomValue(i+vec3(0,1,0)),randomValue(i+vec3(1,1,0)),w.x),w.y);
  float b = mix(mix(randomValue(i+vec3(0,0,1)),randomValue(i+vec3(1,0,1)),w.x),mix(randomValue(i+vec3(0,1,1)),randomValue(i+vec3(1,1,1)),w.x),w.y);
  return mix(a,b,w.z)*2.0-1.0;
}


float liquid(vec2 center,float baseRadius,float timeScale,float offset) {
  vec2 p=(vUv-center)*vec2(1.5,1);
  float angle=atan(p.y,(p.x==0.0 && p.y==0.0)?0.000001:p.x);
  float n=noise3D(vec3(cos(angle)*2.0,sin(angle)*2.0,uTime*timeScale+offset));
  float r=baseRadius+n*uAmplitude;
  return 1.0-smoothstep(r-.015,r+.015,length(p));
}
void main() {
  float a=liquid(vec2(.5),uRadius,uSpeed,0.0);
  float b=liquid(vec2(.66,.52),uRadius*.75,uSpeed*1.7,7.3);
  float mask=max(a,b*uDouble);
  vec2 warped=clamp(vUv+(vUv-.5)*uDistortion*mask,0.0,1.0);
  vec3 color=mix(texture2D(uTexture,warped).rgb,vec3(.12,.72,.9),mask*uTint);
  gl_FragColor=vec4(mix(color,vec3(mask),uDisplay),1);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
