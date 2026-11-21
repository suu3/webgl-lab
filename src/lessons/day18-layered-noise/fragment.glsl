// 기본: scale3, speed.2, octaves4, turbulence0, density0, palette0.
uniform float uTime,uScale,uSpeed,uTurbulence,uDensity,uPalette;
uniform int uOctaves;
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
  float sum=0.0, weight=0.0;
  for(int i=0;i<4;i++) {
    if(i>=uOctaves) break;
    float a=pow(.5,float(i+1));
    float n=noise3D(vec3(vUv*uScale*pow(2.0,float(i)),uTime*uSpeed));
    sum+=mix(n,abs(n),uTurbulence)*a; weight+=a;
  }
  float n=sum/max(weight,.0001);
  float v=clamp(mix(n*.5+.5,n,uTurbulence),0.0,1.0);
  v=mix(v,smoothstep(.4,.7,v),uDensity);
  vec3 teal=mix(vec3(.02,.04,.1),vec3(.25,.85,.9),v);
  vec3 opal=mix(vec3(.2,.8,.9),vec3(.9,.3,.7),v);
  gl_FragColor=vec4(mix(teal,opal,uPalette),1);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
