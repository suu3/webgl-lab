// CPU에서 갱신한 position BufferAttribute를 사용하는 WebGL Points 비교본.
// WebGPU 실행본은 1px Points 제한을 피하려고 PointsNodeMaterial + Sprite 인스턴싱을 사용한다.
uniform float uSize;
void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1);gl_PointSize=uSize;}
