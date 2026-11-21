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
| 13 · Chromatic Aberration | RGB 채널을 서로 다른 UV에서 샘플링해 색수차를 만든다. 강도·범위·방향과 가장자리·마우스 주변 적용을 비교한다. |
| 14 · Refraction Distortion | 원형 렌즈 마스크로 배경 UV를 이동한다. 확대·축소, 반지름·경계 부드러움, 마우스 이동과 테두리를 비교한다. |
| 15 · Liquid Morphing | 원형 Noise 좌표로 액체 윤곽을 움직이고 내부 왜곡·색상·두 마스크 합성을 비교한다. |
| 16 · Ripple Propagation | 클릭 지점에서 시간 기반 파동을 전파한다. 속도·수명·최근 두 파동을 비교한다. |
| 17 · Glitch & Digital Corruption | 가로줄과 시간을 양자화해 UV를 불연속적으로 이동한다. 밀도·빈도·RGB 분리를 비교한다. |
| 18 · Layered Noise & fBM | 1~4 Octave Noise를 합산하고 진폭 정규화·밀도·Turbulence를 비교한다. |
| 19 · Domain Warping | 서로 다른 두 fBM으로 입력 좌표를 뒤틀고 강도·방향·q 성분을 비교한다. |
| 20 · Flow Field | Noise를 각도로 바꿔 격자별 방향과 짧은 선의 이동을 시각화한다. |
| 21 · Curl Noise | 중앙 차분 기울기를 90도 회전하고 Gradient·Curl·흐름 강도를 비교한다. |
| 22 · Particle Advection | 200개 위치를 CPU에서 갱신한다. 속도·경계 순환·랜덤 재생성을 비교한다. |
| 23 · GPU Particle Simulation | 1,000개 위치를 TSL Compute로 초기화·갱신하고 같은 버퍼로 렌더링한다. |
| 24 · Particle Trails & Feedback | 이전 프레임을 Ping-Pong으로 누적한다. 유지율·Additive·Max·RGB 감쇠를 비교한다. |
| 25 · Bloom & Light Scattering | HDR 입자 궤적에 Bloom 후처리를 적용하고 강도·반경·밝기 임계값을 비교한다. |
| 26 · Chromatic Aberration Postprocessing | 렌더링된 장면 전체에 RGB Shift를 적용한다. 포인터 속도 반응·감쇠와 Bloom 순서를 비교한다. |
| 27 · Heat Haze & Refraction | 원형 마스크 안에서 배경 UV를 물결로 왜곡한다. 강도·속도·주파수·방향·경계를 비교한다. |
| 28 · Liquid Lens & Edge Highlight | 원형 SDF 경계에 하이라이트를 합성한다. 두께·맥동·비대칭 조명·경계 마스크를 비교한다. |
| 29 · Fresnel & Fake Glass | 3D 구체의 법선과 시선 내적으로 테두리를 밝히고 Fresnel 지수·투명도·이중 색상 하이라이트를 비교한다. |
| 30 · Thin-Film Iridescence | 시선 각도와 RGB 위상으로 무지갯빛을 만들고 가상 막 두께와 Fresnel 지수를 조절한다. |
| 31 · Layered Iridescence & Parallax | 청록·보라·분홍 UV 레이어를 합성하고 가상 깊이·시차 강도·패턴 주파수·표면 반사를 비교한다. |
| Week 02 · Breathing Halo | 원 → 호흡 → 링·발광으로 확장한다. `uniform`으로 시간·마우스 좌표를 전달해 포인터 근처를 변형한다. |

각 레슨은 `src/lessons/`에 있다. Day 4~31은 `index.js`가 TSL 실행본이고 GLSL 비교본이 함께 있다.
Breathing Halo는 하단에서 완성본·실습용을 선택하고 `fragment.practice.glsl`의 TODO를 채운다.

```sh
npm run build
npm test
```

Day 10은 현재 Three.js에 `snoise` export가 없어 Day 9의 3D Value Noise를 재사용한다. 왜곡 강도 0 또는 Y 방향만 선택하면 원래 수직 줄무늬를 확인할 수 있다.

Day 11은 `?lesson=day11-vertex-deformation`에서 선택한다. XY 평면의 Z좌표를 변형하며 기본 진폭은 0.18이다. 진폭 0은 평면, 속도 0은 정지한 표면이다. 대각선은 기본 주파수 8에서 `8x + 5y`를 사용한다. 격자·면 표시로 실루엣 변화를 비교할 수 있다. GLSL 비교본은 `ShaderMaterial`용이며 `uTime`, `uAmplitude`, `uFrequency`, `uSpeed`, `uDirectionY`, `uWaveAmount`, `uNoiseAmount`를 TSL 제어값과 동일하게 전달한다. 현재 `snoise` export가 없어 Day 9·10과 같은 Value Noise를 사용한다. GPU 정점 변형은 원본 position 배열이나 조명용 법선을 자동 갱신하지 않는다.

Day 12는 `?lesson=day12-texture-mouse`에서 선택한다. 저장소에 포함한 `public/textures/sample.svg`를 sRGB 텍스처로 읽으며 외부 이미지 요청은 없다. 이미지 위에서 마우스를 움직이거나 터치하면 물결이 생기고, 이미지 밖으로 나가거나 터치를 놓으면 원본으로 돌아온다. 기본 범위 0.3·강도 0.015·주파수 60·속도 6을 조절하며, 강도 0으로 원본과 비교한다. '이동 속도 + 감쇠' 모드는 포인터 이동 거리를 시간으로 나눈 속도를 최대 2로 제한하고, 멈추면 효과를 감쇠시킨다. 화면 비율을 보정해 영향 범위를 원형으로 유지하고 샘플링 UV는 0~1로 제한한다. GLSL 비교본은 `ShaderMaterial`용이며 `uTexture`와 주석에 기재된 uniform을 별도로 연결한다.

Day 13은 `?lesson=day13-chromatic-aberration`에서 선택한다. Day 12의 로컬 이미지를 재사용하며 기본 강도는 0.012다. 강도 0은 원본, 0.04는 강한 RGB 분리다. 가장자리 모드는 시작 거리 0.1에서 최대 거리 0.65까지 효과가 증가하고, 마우스 주변 모드는 포인터 범위 0.25 안에서만 효과가 나타난다. 방향은 방사형·수평으로 비교할 수 있다. 포인터 이탈·터치 종료 시 마우스 모드의 효과가 사라진다. 거리는 첨부 수식과 동일한 UV 기준이다. GLSL 비교본은 ShaderMaterial용이며 주석의 uniform을 별도로 연결한다.

Day 14는 `?lesson=day14-refraction-distortion`에서 선택한다. 기본 강도 -0.28은 확대, +0.2는 축소, 0은 원본이다. 기본 반지름 0.32·부드러움 0.1은 안쪽 0.22부터 바깥쪽 0.32까지 전환되는 마스크다. 가로형 이미지 비율을 거리 계산에 반영해 원형 렌즈를 유지한다. 원형 렌즈·이미지 전체 모드로 마스크의 역할을 비교하고 테두리 하이라이트를 켤 수 있다. 마우스 따라가기 모드는 터치도 지원하며 포인터 이탈·터치 종료 시 중앙으로 돌아온다. 실제 광선 추적 대신 한 장의 이미지 UV를 왜곡하는 근사 효과다. GLSL 비교본은 ShaderMaterial용이며 주석의 uniform을 별도로 연결한다.

Day 29~31은 각각 `?lesson=day29-fresnel-fake-glass`, `?lesson=day30-thin-film-iridescence`, `?lesson=day31-layered-iridescence`에서 선택한다. 드래그·터치로 OrbitControls 카메라를 회전하고 휠·핀치로 확대한다. 초기화는 카메라와 모든 제어값을 복원한다. 완전한 구체의 회전만으로는 법선 분포가 바뀌지 않아 Day 29·30의 무늬가 거의 동일하게 보인다.

Day 29는 기본 Fresnel 지수 3의 불투명 구체에서 시작한다. Fake Glass 1은 `fresnel * 0.75 + 0.08`의 알파를 사용한다. Day 30은 가상 막 두께 3과 RGB 위상 (0, 2.1, 4.2)을 사용하며 물리적 박막 두께나 스펙트럼 계산은 아니다. Day 31은 A 깊이 0.2·C 깊이 1을 고정하고 B 깊이만 0~1로 조절한다. B 깊이 0이어도 A·C는 움직이며, 전체 시차를 끄려면 강도를 0으로 설정한다. 기본 강도는 0.08, 주파수는 12·16·20, 표면 반사는 0.55다. 첨부 예제처럼 View Space 시선의 XY를 UV에 직접 더하며 실제 투명 볼륨이나 Tangent Space Parallax Mapping은 아니다. Noise/fBM 도전 과제는 포함하지 않는다. GLSL 비교본은 ShaderMaterial용으로 각 파일 주석의 uniform을 별도로 연결한다.

Day 27은 `?lesson=day27-heat-haze`, Day 28은 `?lesson=day28-liquid-lens`에서 선택한다. 기존 로컬 `sample.svg`를 재사용하고 이미지와 Plane의 3:2 비율을 맞춘다. 마스크 거리에는 X축 1.5배 보정을 적용해 화면에서 원형으로 유지한다. 기본 왜곡 강도 .012·주파수 35·속도 3이며 수평·수직·대각선 이동을 비교한다. 강도 0은 원본이다. 대각선은 정규화된 (1,1) 방향으로 이동한다. Day 27은 바깥 반지름 .38·경계 폭 .13, Day 28은 반지름 .3·맥동 진폭 .008·속도 1.5·경계 폭 .025·하이라이트 .75를 사용한다. Day 28의 왼쪽 위 조명은 방향 내적으로 경계를 밝히며, 경계 마스크 보기로 `abs(SDF)` 링을 확인할 수 있다. 흐름 속도 0과 맥동 진폭 0으로 정지시킨다. 초기화는 모든 설정을 복원한다. 실제 광학적 굴절이나 Fresnel 대신 2D 이미지 UV와 SDF를 사용하는 근사다. Noise/fBM 도전 과제는 포함하지 않는다. GLSL 비교본에는 주석의 uniform을 별도로 연결한다.

Day 15는 `?lesson=day15-liquid-morphing`, Day 16은 `?lesson=day16-ripple-propagation`에서 선택한다. 둘 다 기존 로컬 sRGB 이미지를 사용하고 3:2 이미지 비율에 맞춰 원형 거리의 X축을 1.5배 보정한다.

Day 15는 기본 반지름 .28·Noise 강도 .05·속도 .3·내부 왜곡 -.28·청록 혼합 .16으로 시작한다. `atan` 중심의 미정의 값을 피하고 `cos(angle), sin(angle)`을 Noise 좌표로 사용해 이음매가 이어지도록 한다. Day 9의 Value Noise를 사용한다. 한 겹/두 겹과 액체 마스크 보기를 제공하며, 두 번째 마스크는 반지름·위치·시간 속도가 다르다. `max` 합성은 영역의 합집합이며 부드러운 SDF 결합은 아니다. 실제 메시를 변형하지 않는다.

Day 16은 클릭·터치 전에는 원본을 표시한다. 기본 전파 속도 .45·파동 폭 .1·주파수 70·수명 1.5초·강도 .025이며 수명의 2/3부터 서서히 감쇠한다. 클릭 좌표는 캔버스 기준으로 변환하고 Y축을 뒤집는다. 수명이 지나면 원본으로 돌아오며, 새 클릭은 기본적으로 기존 파동을 교체한다. 두 파동 모드는 최근 두 클릭을 순환 저장하고 합산 변위를 .05 이하로 제한한다. 일시정지는 경과 시간을 멈추고, 중앙에서 파동 버튼은 키보드로도 실행할 수 있다. 파동 지우기·초기화·크기 변경 시 파동을 제거한다. 3:2 비율을 보정한 거리와 방향을 사용하므로 화면에서 원형으로 퍼진다.

Day 17~24는 메뉴 또는 다음 URL로 선택한다.

| Day | lesson 값 |
| --- | --- |
| 17 | `day17-glitch` |
| 18 | `day18-layered-noise` |
| 19 | `day19-domain-warping` |
| 20 | `day20-flow-field` |
| 21 | `day21-curl-noise` |
| 22 | `day22-particle-advection` |
| 23 | `day23-gpu-particles` |
| 24 | `day24-particle-trails` |

Day 17은 로컬 sRGB 이미지를 재사용한다. 기본 가로줄 40·Tick 12·선택 임계값 .86·UV 이동 강도 .12·RGB 분리 0이며, 모든 줄 적용과 선택한 줄 적용을 비교한다. 재생 일시정지로 특정 Tick을 고정할 수 있다. 강도 0과 RGB 분리 0은 원본이다.

Day 18~21은 현재 릴리스에 `snoise` export가 없어 Day 9와 같은 signed 3D Value Noise를 사용한다. Simplex Noise와는 시각적 특성이 다르다. Day 18은 기본 4-Octave·공간 크기 3·속도 .2로 시작하고, 실제 활성 Octave의 진폭 합으로 정규화한다. Turbulence는 각 Noise의 절댓값을 합산하며 unsigned 값으로 표시한다. 밀도·청록/분홍 팔레트를 바꿀 수 있다. Day 19는 강도 1.2·오프셋 (5.2,1.3)의 두 fBM으로 좌표를 왜곡한다. X/Y 단독 왜곡과 q.x/q.y 보기, Smoothstep 경계를 비교한다. 기본 4-Octave fBM 3회 평가로 픽셀당 Noise 평가가 12회 발생한다.

Day 20·21은 기본 12×12 격자·공간 배율 .16·선 이동 속도 .45·선 길이 .14다. 각 격자 안의 선만 움직이고 입자 위치는 누적하지 않는다. Day 20의 방향 변화 속도 기본값은 0, Day 21은 .08이다. Day 21은 차분 간격 .02의 회전 기울기를 사용하고 Gradient와 비교한다. 밝기 비교에는 정규화 전 흐름 길이를 사용한다. 선 중심 고정·두께 마스크 보기·일시정지를 제공한다.

Day 22는 첨부의 삼각함수 스칼라 필드로 Curl을 계산한다. 이는 Simplex Noise나 실제 유체 방정식이 아니다. 기본 속도 .25, 입자 200개의 위치를 CPU Float32Array에서 갱신하고 `needsUpdate`로 GPU에 전달한다. 순환은 양방향 overshoot를 보존하며 랜덤 재생성과 비교할 수 있다. WebGPU Points의 1px 제한 때문에 실행본은 BufferAttribute를 읽는 PointsNodeMaterial + Sprite 인스턴싱으로 4px 점을 그린다. GLSL 비교본은 일반 WebGL Points용이다. 짧은 LineSegments 도전 과제는 포함하지 않는다.

Day 23은 실제 WebGPU Compute가 필요하다. GPU에서 1,000개 위치를 `hash(instanceIndex)`로 초기화하고 `p += velocity * speed * deltaTime`으로 갱신한다. 기본 속도 (0.2,0.1), 배율 1이며 음수 속도도 순환한다. Curl 모드는 Day 22의 같은 스칼라 필드를 GPU에서 중앙 차분한다. 매 프레임 CPU 위치 반복문이나 위치 업로드는 없다. 같은 Storage Buffer를 Sprite 렌더링에 연결한다. WebGL 백엔드에서는 지원 안내를 표시하며 CPU로 위장 실행하지 않는다. `compute.glsl`은 GLSL ES Compute의 개념 비교본으로 WebGL ShaderMaterial에서 실행되지 않는다.

Day 24는 Day 23의 GPU 입자와 실제 Feedback Rendering을 연결한다. WebGPU가 없으면 CPU 입자 + 동일한 GPU Ping-Pong 합성을 사용한다고 화면에 표시한다. 입자 전용 RenderTarget과 두 누적 RenderTarget을 분리해 읽기/쓰기 충돌을 피한다. 모두 선형 Half-Float 텍스처이며 초기화·크기 변경 시 검은색으로 지운다. 기본 유지율 .96은 60FPS 기준이며 `pow(retention, deltaTime * 60)`으로 감쇠하고 Additive 주입량도 경과 시간으로 보정한다. 합산은 1로 제한하고 Max 합성과 RGB 감쇠 (.94,.97,.99)를 비교한다. 일시정지는 입자와 누적을 함께 멈추고, 잔상 지우기는 정지 상태에서도 동작한다. 초기화는 설정·위치·누적 텍스처를 복원한다.

Day 25는 `?lesson=day25-bloom`, Day 26은 `?lesson=day26-chromatic-postprocessing`에서 선택한다. 현재 Three.js의 `RenderPipeline`, `three/addons/tsl/display/BloomNode.js`의 `bloom()`을 사용한다. 두 레슨 모두 Day 24의 실제 누적 결과 텍스처를 후처리 입력으로 사용하며 장면을 `pass()`로 다시 렌더링하지 않는다. Bloom용 누적 밝기 상한은 HDR 8이고 최종 출력에서 ACES 톤 매핑과 색 공간 변환을 적용한다. WebGPU에서는 GPU Compute 입자, WebGL에서는 CPU 입자를 사용한다. 이동 속도 0으로 위치를 고정하고 잔상 유지율과 초기화를 조절할 수 있다.

Day 25 기본 Bloom 강도 .8·반경 .5·임계값 .7이다. Day 26은 Bloom 강도 .5·색수차 .025에서 시작한다. `TextureNode.sample()`로 R/G/B UV를 분리하고, 연산 결과는 `convertToTexture()`로 중간 텍스처에 저장해 Bloom → 색수차 / 색수차 → Bloom 순서를 전환한다. 가장자리 마스크는 거리 .1~.65이며 제거해 비교할 수 있다. 포인터 속도는 캔버스 내 정규화 좌표 이동량을 경과 시간으로 나눠 계산하고 영향은 최대 .04, 프레임별 `exp(-6 * deltaTime)`으로 감쇠한다(0.5초 후 약 5% 잔류). 최초 진입은 속도 계산에서 제외하고 이탈·터치 종료·취소 시 초기화한다. 강도 0과 포인터 반응 없음으로 색수차를 완전히 끈다. 초기화는 설정·포인터 영향·입자 위치·잔상을 복원한다. Day 25 GLSL은 밝기 추출·분리형 흐림·합성의 교육용 비교본이며 런타임 BloomNode의 다중 해상도 구현과 동일한 파이프라인은 아니다. Day 26 GLSL 입력에는 최종 누적 RenderTarget을 별도로 연결한다.

`npm test`는 CPU Curl·경계 순환·이류 계산을 검증한다. WebGPU 브라우저에서 개발 서버의 `tests/gpu.integration.js`를 import한 뒤 `checkGPU()`와 `checkFeedback()`을 호출하면 실제 버퍼 읽기와 Half-Float 픽셀 읽기로 GPU 위치 갱신·경계·초기화 및 Ping-Pong 감쇠·Max·RGB·초기화·리사이즈를 확인할 수 있다. GLSL 비교본은 실행본에 자동 연결되지 않으며 각 파일의 uniform을 별도로 전달한다.
