import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
interface CalibrationData {
  index: number;
  target_X: number;
  target_Y: number;
  pred_X: number;
  pred_Y: number;
  timestamp: number; // ✅ 추가
  segmentIndex: number; // ✅ 추가
  latency: number; // ✅ 추가: 예측값 얻는데 걸린 시간 (ms)
}

interface PositionSegment {
  from: [number, number];
  to: [number, number];
  start: number;
  end: number;
}
interface Point {
  x: number;
  y: number;
  timestamp: number;
}

const CalibrationPage = () => {
  const navigate = useNavigate();
  const [calibrationFinished, setCalibrationFinished] = useState(false);
  const [accuracy, setAccuracy] = useState<string | null>(null);
  const [accuracyTesting, setAccuracyTesting] = useState(false);
  const [accuracyTestDone, setAccuracyTestDone] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#213ebb';
    const counter = document.getElementById('countdown');

    let startTime = 0; // ✅ 추가: 시작 시각
    let timeline: PositionSegment[] = []; // ✅ 추가: 구간 배열 전역화

    (async () => {
      await window.webgazer.clearData();
      window.webgazer.setRegression('weightedRidge');
      window.webgazer.setSmoothingWindowSize(4);
      await window.webgazer.begin();
      console.log('✅ WebGazer 초기화 완료');

      // window.webgazer
      //   .showVideo(false)
      //   .showFaceOverlay(false)
      //   .showPredictionPoints(true);

      let i = 5;
      const countdown = setInterval(() => {
        if (counter) counter.textContent = `${i}초 후 시작합니다`;
        if (i-- === 0) {
          clearInterval(countdown);
          if (counter) counter.textContent = '';
          startCalibration();
        }
      }, 1000);
    })();

    const styleEl = document.createElement('style');
    styleEl.textContent = `
      #dot {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: red;
        position: fixed;
        z-index: 99999;
        display: none;
        transform: translate(-50%, -50%);
      }
      #gazeOutput {
        position: fixed;
        bottom: 20px;
        left: 20px;
        font-size: 20px;
        color: blue;
      }
              #accuracyDot {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: red;
        position: fixed;
        z-index: 99999;
        display: none;
        transform: translate(-50%, -50%);
      }
    `;
    document.head.appendChild(styleEl);

    const gazeOutput = document.createElement('div');
    gazeOutput.id = 'gazeOutput';
    gazeOutput.textContent = '(x: -, y: -)';
    document.body.appendChild(gazeOutput);

    const canvas = document.createElement('canvas');
    canvas.id = 'plotting_canvas';
    canvas.width = 1920;
    canvas.height = 1080;
    canvas.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 1;';
    document.body.appendChild(canvas);

    const dot = document.createElement('div');
    dot.id = 'dot';
    document.body.appendChild(dot);

    const calibrationLog: CalibrationData[] = [];
    let sampleIndex = 0;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const margin = 50;
    const positions: { from: [number, number]; to: [number, number] }[] = [
      {
        from: [w - margin, margin], // 오른쪽 위 시작
        to: [w - margin, h - margin], // ↓ 오른쪽 아래
      },
      {
        from: [w - margin, h - margin],
        to: [margin, h - margin], // ← 왼쪽 아래
      },
      {
        from: [margin, h - margin],
        to: [margin, margin], // ↑ 왼쪽 위
      },
      {
        from: [margin, margin],
        to: [w - margin, margin], // → 다시 오른쪽 위
      },
    ];

    function distance(p1: [number, number], p2: [number, number]) {
      const dx = p2[0] - p1[0];
      const dy = p2[1] - p1[1];
      return Math.sqrt(dx * dx + dy * dy);
    }

    function interpolate(start: number, end: number, t: number) {
      return start + (end - start) * t;
    }

    let count = 0;

    async function recordCalibrationSample(target_x: number, target_y: number) {
      const perfStart = performance.now(); // ✅ 시작 시각
      const data = await window.webgazer.getCurrentPrediction();
      const perfEnd = performance.now(); // ✅ 끝 시각
      if (!data) return;

      const timestamp = perfStart - startTime;
      const latency = perfEnd - perfStart;
      const segmentIndex = timeline.findIndex(
        (seg) => timestamp >= seg.start && timestamp < seg.end
      );

      count++;
      calibrationLog.push({
        index: sampleIndex++,
        target_X: target_x,
        target_Y: target_y,
        pred_X: data.x,
        pred_Y: data.y,
        timestamp,
        segmentIndex,
        latency, // ✅ 추가
      });

      // console.log(
      //   `${count}번 째 캘리브레이션: ${timestamp.toFixed(1)}ms | 구간: ${segmentIndex} | 지연: ${latency.toFixed(2)}ms`
      // );
    }

    async function startCalibration() {
      dot.style.display = 'block';
      startTime = performance.now();
      const totalDuration = 30000; // 캘리브레이션 진행 시간
      const lengths = positions.map((pos) => distance(pos.from, pos.to));
      const totalLength = lengths.reduce((a, b) => a + b, 0);

      let acc = 0;
      timeline = [];
      for (let i = 0; i < positions.length; i++) {
        const segDuration = (lengths[i] / totalLength) * totalDuration;
        timeline.push({
          from: positions[i].from,
          to: positions[i].to,
          start: acc,
          end: acc + segDuration,
        });
        acc += segDuration;
      }
      // console.log('📍 Timeline', timeline);

      function moveDot() {
        const now = performance.now();
        const elapsed = now - startTime;

        if (elapsed >= totalDuration) {
          dot.style.display = 'none';
          console.table(calibrationLog);
          downloadCSVFromCalibrationLog();
          setCalibrationFinished(true);

          // window.dispatchEvent(
          //   new CustomEvent('gaze-tracker-toggle', { detail: { active: true } })
          // );
          // navigate('/home');

          canvas.style.cssText =
            'position: fixed; top: 0; left: 0; z-index: 1; pointer-events: none;';
          dot.style.pointerEvents = 'none';
          return;
        }

        const seg = timeline.find((s) => elapsed >= s.start && elapsed < s.end);
        if (!seg) {
          requestAnimationFrame(moveDot);
          return;
        }

        const t = (elapsed - seg.start) / (seg.end - seg.start);
        const x = interpolate(seg.from[0], seg.to[0], t);
        const y = interpolate(seg.from[1], seg.to[1], t);

        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;

        window.webgazer.recordScreenPosition(x, y, 'custom');
        recordCalibrationSample(x, y);

        requestAnimationFrame(moveDot);
      }

      requestAnimationFrame(moveDot);
    }

    function downloadCSVFromCalibrationLog() {
      if (calibrationLog.length === 0) return;
      const headers = [
        'index',
        'target_X',
        'target_Y',
        'pred_X',
        'pred_Y',
        'timestamp',
        'segmentIndex',
        'latency',
      ];
      const csvRows = [
        headers.join(','),
        ...calibrationLog.map((row) =>
          [
            row.index,
            row.target_X,
            row.target_Y,
            row.pred_X,
            row.pred_Y,
            row.timestamp.toFixed(1),
            row.segmentIndex,
            row.latency.toFixed(2), // ✅ 추가
          ].join(',')
        ),
      ];
      const csvContent = csvRows.join('\n');
      const now = new Date();
      const fileName = `${now.toISOString().replace(/[:T]/g, '_').split('.')[0]}_v6.csv`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function updateGazeDisplay() {
      const prediction = window.webgazer.getSmoothedPrediction?.();
      if (prediction) {
        const x = Math.round(prediction.x);
        const y = Math.round(prediction.y);
        gazeOutput.textContent = `(x: ${x}, y: ${y})`;
      }
      requestAnimationFrame(updateGazeDisplay);
    }

    requestAnimationFrame(updateGazeDisplay);

    return () => {
      document.head.removeChild(styleEl);
      document.body.removeChild(dot);
      document.body.removeChild(gazeOutput);
      document.body.removeChild(canvas);
    };
  }, [navigate]);

  async function startAccuracyTest() {
    setAccuracyTesting(true);
    setAccuracyTestDone(false);
    console.log('정확도 분석 시작');
    const accuracyDot = document.createElement('div');
    accuracyDot.id = 'accuracyDot';
    document.body.appendChild(accuracyDot);
    if (!accuracyDot) return;
    // alert('정확도 측정을 시작합니다.\n화면 중앙 점을 5초간 바라보세요.');

    const prediction = window.webgazer.getSmoothedPrediction();
    console.log(prediction);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    accuracyDot.style.left = `${centerX}px`;
    accuracyDot.style.top = `${centerY}px`;
    accuracyDot.style.display = 'block';

    await sleep(2000);
    storePoints();
    await sleep(5000);
    stopStorePoints();
    console.log(window.webgazer.getStoredPoints());

    const [xList, yList]: [number[], number[]] =
      window.webgazer.getStoredPoints();
    const now = performance.now();
    const points: Point[] = xList.map((x, i) => ({
      x,
      y: yList[i],
      timestamp: now + i,
    }));

    const result = calculatePrecision(points, centerX, centerY);
    setAccuracy(result);
    downloadAccuracyCSV(points, centerX, centerY);

    if (accuracyDot) accuracyDot.style.display = 'none';

    alert(`정확도 측정 완료!\n화면 중앙 기준으로 ${result}% 정확도입니다.`);
    setAccuracyTestDone(true);
  }
  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function storePoints() {
    window.webgazer.params.storingPoints = true;
  }

  function stopStorePoints() {
    window.webgazer.params.storingPoints = false;
  }

  function downloadAccuracyCSV(
    points: Point[],
    targetX: number,
    targetY: number
  ) {
    const headers = ['target_X', 'target_Y', 'pred_X', 'pred_Y', 'timestamp'];
    const csvRows = [
      headers.join(','),
      ...points.map((p) => [targetX, targetY, p.x, p.y, p.timestamp].join(',')),
    ];
    const blob = new Blob([csvRows.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accuracy_${new Date().toISOString().replace(/[:.]/g, '')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function calculatePrecision(points: Point[], cx: number, cy: number): string {
    const inRadius = points.filter((p) => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      return Math.sqrt(dx * dx + dy * dy) <= 100;
    });
    return ((inRadius.length / points.length) * 100).toFixed(2);
  }

  function handleGoHome() {
    window.dispatchEvent(
      new CustomEvent('gaze-tracker-toggle', { detail: { active: true } })
    );
    navigate('/home');
  }

  return (
    <PageWrapper isTesting={accuracyTesting}>
      {!calibrationFinished ? (
        <>
          <MessageText>정면의 점을 응시해주세요</MessageText>
          <CountdownText id="countdown">초기화 중입니다...</CountdownText>
        </>
      ) : accuracyTesting && !accuracyTestDone ? null : accuracyTesting && // 분석 중에는 아무것도 보여주지 않음
        accuracyTestDone ? (
        // 분석 끝났을 때만 결과 + 홈버튼 표시
        <>
          <ResultText>📊 정확도: {accuracy}%</ResultText>
          <ActionButton onClick={handleGoHome}>홈으로 이동</ActionButton>
        </>
      ) : (
        // 일반 상태: 분석 전
        <ButtonContainer>
          <ActionButton onClick={handleGoHome}>홈으로 이동</ActionButton>
          <ActionButton onClick={startAccuracyTest}>정확도 분석</ActionButton>
          {accuracy && <ResultText>📊 정확도: {accuracy}%</ResultText>}
        </ButtonContainer>
      )}
    </PageWrapper>
  );
};

// const PageWrapper = styled.div`
//   width: 100vw;
//   height: 100vh;
//   background-color: #213ebb;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `;

const PageWrapper = styled.div<{ isTesting: boolean }>`
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => (props.isTesting ? 'white' : '#213ebb')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MessageText = styled.div`
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin-top: 4rem;
`;

const CountdownText = styled.div`
  color: white;
  font-size: 1.5rem;
  margin-top: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const ActionButton = styled.button`
  padding: 16px 32px;
  font-size: 1.5rem;
  background-color: white;
  color: #213ebb;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #d0e0ff;
  }
`;

const ResultText = styled.div`
  color: blakc;
  font-size: 1.5rem;
  margin-top: 12px;
`;

export default CalibrationPage;
