# WebGL Lab

```sh
npm install
npm run dev
```

상단 메뉴에서 레슨을 선택한다. 기본 화면은 Week 02 · Breathing Halo다.

| Day | 학습 내용 |
| --- | --- |
| 1 · UV | UV 좌표를 색상으로 표현하며 `0~1` 좌표계와 픽셀 색상 출력을 이해한다. |
| 2 · Distance | `distance()`로 중심까지의 거리를 구하고 방사형 그라데이션을 만든다. |
| 3 · Smoothstep | 거리 값에 `smoothstep()`을 적용해 경계가 부드러운 원을 만든다. |
| 4 · SDF Rings | `abs(length(p) - radius)`로 링을 만들고 두께·경계·발광을 조절한다. |
| 5 · Time | `sin`, `cos`, `time`으로 두 링을 맥동시킨다. 속도와 진폭의 차이를 익힌다. |
| 6 · Patterns | `fract`로 UV를 타일링하고 `mod`로 시간을 반복한다. 타일 수와 링·채운 원을 바꿔 본다. |
| 7 · Rotation | 중심을 원점으로 옮기고 `rotateUV()`로 사각형을 회전한다. 세로 비율과 회전 방향을 바꿔 본다. |
| 8 · Polar | `length`와 `atan`으로 거리·각도를 구해 꽃잎을 만든다. 꽃잎 수·회전·`pow`로 날카로움을 조절한다. |
| 9 · Noise | `floor`, `fract`, `mix`, `smoothstep`으로 3D Value Noise를 만들고 링을 변형한다. 강도·공간 주파수·속도를 바꿔 본다. |
| 10 · UV Distortion | 노이즈로 UV 좌표를 움직여 수직 줄무늬를 일렁이게 한다. 강도·방향·속도와 노이즈·물결·혼합 방식을 비교한다. |
| 11 · Vertex Deformation | `positionLocal`과 `positionNode`로 80×80 격자의 실제 정점을 움직인다. 진폭·주파수·속도·방향과 파도·Value Noise·혼합을 비교한다. |
| 12 · Texture & Mouse | 이미지 텍스처를 샘플링하고 포인터 주변 UV를 물결처럼 왜곡한다. 범위·강도·주파수·속도, 방사형·수평 방향과 이동 속도 반응을 비교한다. |
| Week 02 · Breathing Halo | 원 → 호흡 → 링·발광으로 확장한다. `uniform`으로 시간·마우스 좌표를 전달해 포인터 근처를 변형한다. |

각 레슨은 `src/lessons/`에 있다. Day 4~12는 `index.js`가 TSL 실행본이고 GLSL 비교본이 함께 있다.
Breathing Halo는 하단에서 완성본·실습용을 선택하고 `fragment.practice.glsl`의 TODO를 채운다.

```sh
npm run build
```

Day 10은 현재 Three.js에 `snoise` export가 없어 Day 9의 3D Value Noise를 재사용한다. 왜곡 강도 0 또는 Y 방향만 선택하면 원래 수직 줄무늬를 확인할 수 있다.

Day 11은 `?lesson=day11-vertex-deformation`에서 선택한다. XY 평면의 Z좌표를 변형하며 기본 진폭은 0.18이다. 진폭 0은 평면, 속도 0은 정지한 표면이다. 대각선은 기본 주파수 8에서 `8x + 5y`를 사용한다. 격자·면 표시로 실루엣 변화를 비교할 수 있다. GLSL 비교본은 `ShaderMaterial`용이며 `uTime`, `uAmplitude`, `uFrequency`, `uSpeed`, `uDirectionY`, `uWaveAmount`, `uNoiseAmount`를 TSL 제어값과 동일하게 전달한다. 현재 `snoise` export가 없어 Day 9·10과 같은 Value Noise를 사용한다. GPU 정점 변형은 원본 position 배열이나 조명용 법선을 자동 갱신하지 않는다.

Day 12는 `?lesson=day12-texture-mouse`에서 선택한다. 저장소에 포함한 `public/textures/sample.svg`를 sRGB 텍스처로 읽으며 외부 이미지 요청은 없다. 이미지 위에서 마우스를 움직이거나 터치하면 물결이 생기고, 이미지 밖으로 나가거나 터치를 놓으면 원본으로 돌아온다. 기본 범위 0.3·강도 0.015·주파수 60·속도 6을 조절하며, 강도 0으로 원본과 비교한다. '이동 속도 + 감쇠' 모드는 포인터 이동 거리를 시간으로 나눈 속도를 최대 2로 제한하고, 멈추면 효과를 감쇠시킨다. 화면 비율을 보정해 영향 범위를 원형으로 유지하고 샘플링 UV는 0~1로 제한한다. GLSL 비교본은 `ShaderMaterial`용이며 `uTexture`와 주석에 기재된 uniform을 별도로 연결한다.
