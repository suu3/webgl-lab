# WebGL Lab

```sh
npm install
npm run dev
```

상단 메뉴에서 Day 1~8와 Week 02를 선택한다. 기본 화면은 Week 02다.

## Day 4 — SDF Rings

`src/lessons/day04-sdf-rings/index.js`는 TSL 실행본이다. 같은 수식의 GLSL 비교본은 `fragment.glsl`에 있다. 반지름 0.12 / 0.25 / 0.38인 흰색·청록색·파란색 링을 그린다.

- `abs(length(p) - radius)`로 원 경계까지의 거리를 구한다.
- `smoothstep`으로 링과 발광 마스크를 만들고 `mix`로 색상을 합친다.
- 화면 하단에서 두께, 경계 부드러움, 발광, 중심 이동을 조절한다.
- 색상은 `index.js`의 각 `vec3`에서 변경한다.
- 발광은 거리 함수로 흉내 낸 효과이며 Bloom 후처리는 아니다.
- WebGPURenderer가 지원 환경에 따라 WebGPU 또는 WebGL 2를 사용한다.

## Shader Deep Session — Week 02: Breathing Halo

`src/lessons/week02-breathing-halo/`에서 학습한다.

1. Sketch 01: `distance`와 `smoothstep`으로 원을 만든다.
2. Sketch 02: `sin(uTime * uSpeed) * 0.02`를 거리에 더해 호흡시킨다.
3. Sketch 03: 두 원의 차이로 링을 만들고 포인터 주변 변형과 발광을 더한다.

하단에서 스케치와 완성본/실습용 모드를 선택하고 반지름, 두께, 부드러움, 속도, 색상을 조절한다. 실습용 모드는 `fragment.practice.glsl`을 실행한다. 이 파일의 TODO를 직접 채우며 연습한다. 초기 상태는 모든 스케치에서 정적인 원을 표시한다.

`index.js`가 `uniforms.uTime.value`를 매 프레임 갱신하고, 포인터 이벤트에서 `uPointer`를 0~1 UV 좌표로 전달한다. 세로 좌표는 아래가 0이 되도록 뒤집는다. GLSL은 이 uniform 값을 사용해 각 픽셀의 색상을 계산한다. 가로세로 비율을 보정하므로 창 크기를 바꿔도 원형을 유지한다.

`d + breath < radius` 조건은 `d < radius - breath`와 같다. 따라서 breath가 커질 때 원은 작아진다. 운영체제의 동작 줄이기 설정이 켜져 있으면 시간 애니메이션을 멈춘다.

### 완료 체크

- [ ] 완성본 없이 sin 애니메이션 구현
- [ ] 링의 두께, 색상, 움직임 변경
- [ ] JavaScript → GLSL uniform 전달 과정 설명

```sh
npm run build
```

## Day 5~8 — GLSL 개념 → TSL 구현 → 실습

각 폴더의 `index.js`는 독립 실행 가능한 TSL 레슨이고, `fragment.glsl`과
`vertex.glsl`은 같은 수식의 GLSL 비교본이다. 상단 메뉴 또는 아래 쿼리로 선택한다.
GLSL 비교본을 ShaderMaterial로 실행할 때는 `uResolution`을 화면 크기로,
`uTime`을 초 단위 경과 시간으로 전달하고 나머지 uniform은 TSL 초기값에 맞춘다.
화면 비율을 보정하므로 원과 꽃잎은 창 크기를 바꿔도 찌그러지지 않는다.
Day 6의 4×4는 정사각형 화면 기준이며, 넓은 화면에서는 타일이 추가로 보인다.

### Day 5 — 시간 기반 애니메이션

1. **GLSL 개념:** `r = r0 + sin(time * speed) * amplitude`로 반지름이 왕복한다.
   `abs(length(p) - r)`에 `smoothstep`을 적용하면 부드러운 링이 된다.
2. **TSL 구현:** `src/lessons/day05-time/index.js`, `?lesson=day05-time`.
   `sin(time.mul(speed))`와 `cos(time.mul(speed2))`로 두 링을 만든다.
3. **실습:** 하단의 두 속도를 다르게 설정한다. 시간이 지날수록 맥동 타이밍이
   어긋나는지 확인하고, 코드에서 진폭 `0.04`를 바꿔 움직임의 폭을 비교한다.

### Day 6 — fract와 mod 반복 패턴

1. **GLSL 개념:** `fract(x) = x - floor(x)`로 공간을 반복하고,
   `mod(time * speed, 1.0)`으로 커지다가 처음으로 돌아오는 시간을 만든다.
2. **TSL 구현:** `src/lessons/day06-patterns/index.js`, `?lesson=day06-patterns`.
   `fract(p.add(0.5).mul(tiles)).sub(0.5)`로 타일별 중심을 잡고 링을 그린다.
3. **실습:** 타일 수를 4에서 8로 바꾸고 ‘채운 원’을 1로 설정한다.
   `sin`의 연속 왕복과 `mod`의 초기화가 어떻게 다른지 설명한다.

### Day 7 — UV 회전

1. **GLSL 개념:** 중심을 원점으로 옮긴 뒤 회전 행렬을 곱한다.
   GLSL `mat2` 생성자는 열 우선이다. 좌표를 회전시키면 화면에 보이는 도형은
   반대 방향으로 회전하므로 좌표 변환과 도형 움직임을 구분한다.
2. **TSL 구현:** `src/lessons/day07-rotation/index.js`, `?lesson=day07-rotation`.
   `rotateUV(p, time.mul(speed), vec2(0))`와 `max(abs(x), abs(y))`로 사각형을 만든다.
3. **실습:** 세로 비율을 바꿔 직사각형으로 만들고, 회전 속도의 부호를 바꾼다.
   정사각형은 90도마다 같은 모습이 된다는 점을 확인한다.

### Day 8 — atan과 극좌표: 8개의 꽃잎

권장 시간: 원리 15분 → TSL 구현 20분 → 연출 변형 15분.

1. **GLSL 개념:** `r = length(p)`, `a = atan(p.y, p.x)`로 거리와 각도(-π~π)를 구한다.
   `boundary = 0.3 + 0.1 * cos(a * 8.0)`은 한 바퀴에 8번 반지름이 커지는 윤곽이다.
   `1.0 - smoothstep(boundary - 0.015, boundary + 0.015, r)`로 내부를 채운다.
2. **TSL 구현:** `src/lessons/day08-polar/index.js`, `?lesson=day08-polar`.
   `atan(p.y, p.x)` → `cos(a.mul(petals))` → 반지름 → 마스크 → `material.colorNode`
   순서로 읽는다. 초기값은 정적인 8개 꽃잎이다. 밝은 청록색으로 표현하며 Bloom은 사용하지 않는다.
3. **실습 A:** 꽃잎 수를 4·8·12로 바꾸고 각도에 곱한 숫자가 반복 횟수가 되는 이유를 설명한다.
4. **실습 B:** 회전 속도를 0에서 바꾸고 `a.add(time.mul(speed))`의 역할을 확인한다.
5. **실습 C:** 날카로움을 1에서 올린다. `pow(cos(...) * 0.5 + 0.5, sharpness)`로
   밑을 0~1로 만들어 음수의 분수 제곱을 피한다. `abs(cos(a * n))`를 바로 쓰면
   반복 횟수가 두 배가 될 수 있다는 차이도 비교한다.

직접 재구현할 때는 완성 코드를 가리고 boundary → mask → mix 순서로 채워 본다.
오팔 응용은 각도별 색상 마스크를 하나 추가하고, 서로 다른 각도 오프셋의 색상을
겹치는 데서 시작한다. 실제 굴절이나 3D 레이어 구현은 다음 단계다.

통합 도전: Day 6의 타일 안에 Day 5의 맥동과 Day 7의 회전을 적용한다.
회전이 보이도록 원 대신 직사각형이나 Day 8의 꽃잎을 사용한다.
