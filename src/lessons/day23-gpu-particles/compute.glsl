#version 310 es
// 개념 비교용 GLSL ES Compute. WebGL ShaderMaterial에서 실행할 수 없다.
// 실행본은 particle-system.js의 TSL Compute → WebGPU WGSL이다.
layout(local_size_x=64) in;
layout(std430,binding=0) buffer Positions { vec4 positions[]; };
uniform float uDeltaTime,uSpeed;
uniform vec2 uVelocity;
uniform uint uCount;
void main(){
  uint i=gl_GlobalInvocationID.x;
  if(i>=uCount)return;
  vec2 next=positions[i].xy+uVelocity*uSpeed*uDeltaTime;
  positions[i]=vec4(fract((next+1.0)/2.0)*2.0-1.0,0,0);
}
