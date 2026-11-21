uniform float uBrightness;
void main(){
  float a=1.0-smoothstep(.18,.5,length(gl_PointCoord-.5));
  gl_FragColor=vec4(vec3(.25,.9,1)*uBrightness,a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
