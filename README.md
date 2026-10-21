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
| Week 02 · Breathing Halo | 원 → 호흡 → 링·발광으로 확장한다. `uniform`으로 시간·마우스 좌표를 전달해 포인터 근처를 변형한다. |

각 레슨은 `src/lessons/`에 있다. Day 4~8은 `index.js`가 TSL 실행본이고 GLSL 비교본이 함께 있다.
Breathing Halo는 하단에서 완성본·실습용을 선택하고 `fragment.practice.glsl`의 TODO를 채운다.

```sh
npm run build
```
