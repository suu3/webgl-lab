// ShaderMaterial용. 기본 grid12, scale.16, dashSpeed.45, dashLength.14, fixed0, display0.
// fieldSpeed: Day20=0, Day21=.08. Day21 epsilon.02, gradient0, showStrength0.
uniform float uTime,uGrid,uScale,uFieldSpeed,uDashSpeed,uDashLength,uFixed,uDisplay;
varying vec2 vUv;
// Day 9의 signed 3D Value Noise. Simplex Noise와 다른 알고리즘이다.
float randomValue(vec3 p) { return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }
float noise3D(vec3 p) {
  vec3 i = floor(p), f = fract(p), w = smoothstep(0.0,1.0,f);
  float a = mix(mix(randomValue(i),randomValue(i+vec3(1,0,0)),w.x),mix(randomValue(i+vec3(0,1,0)),randomValue(i+vec3(1,1,0)),w.x),w.y);
  float b = mix(mix(randomValue(i+vec3(0,0,1)),randomValue(i+vec3(1,0,1)),w.x),mix(randomValue(i+vec3(0,1,1)),randomValue(i+vec3(1,1,1)),w.x),w.y);
  return mix(a,b,w.z)*2.0-1.0;
}

void main() {
  vec2 grid=vUv*uGrid,cell=floor(grid),local=fract(grid)-.5;
  vec2 p=cell*uScale;float t=uTime*uFieldSpeed;
  float angle=noise3D(vec3(p,t))*6.28318530718;
  vec2 direction=vec2(cos(angle),sin(angle)); float magnitude=1.0;
  vec2 perpendicular=vec2(-direction.y,direction.x);
  float along=dot(local,direction),across=abs(dot(local,perpendicular));
  float line=1.0-smoothstep(.02,.055,across);
  float phase=fract(uTime*uDashSpeed+cell.x*.17+cell.y*.13);
  float center=mix(phase*.7-.35,0.0,uFixed);
  float dash=1.0-smoothstep(uDashLength*.43,uDashLength,abs(along-center));
  vec3 color=mix(vec3(.01,.03,.08),vec3(.25,.9,1),line*dash*magnitude);
  gl_FragColor=vec4(mix(color,vec3(line),uDisplay),1);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
