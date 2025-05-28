import { useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

interface CalibrationData {
  index: number;
  target_X: number;
  target_Y: number;
  pred_X: number;
  pred_Y: number;
}

interface PositionSegment {
  from: [number, number];
  to: [number, number];
  start: number;
  end: number;
}

const CalibrationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#213ebb';
    const counter = document.getElementById('countdown');

    (async () => {
      await window.webgazer.clearData();
      window.webgazer.setRegression('weightedRidge');
      window.webgazer.setSmoothingWindowSize(4);
      await window.webgazer.begin();
      console.log('✅ WebGazer 초기화 완료');

      window.webgazer
        .showVideo(false)
        .showFaceOverlay(false)
        .showPredictionPoints(false);

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
        from: [margin, margin] as [number, number],
        to: [margin, h - margin] as [number, number],
      },
      {
        from: [margin, h - margin] as [number, number],
        to: [w / 2, h - margin] as [number, number],
      },
      {
        from: [w / 2, h - margin] as [number, number],
        to: [w / 2, margin] as [number, number],
      },
      {
        from: [w / 2, margin] as [number, number],
        to: [w - margin, margin] as [number, number],
      },
      {
        from: [w - margin, margin] as [number, number],
        to: [w - margin, h - margin] as [number, number],
      },
      {
        from: [w - margin, h - margin] as [number, number],
        to: [margin, margin] as [number, number],
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

    async function recordCalibrationSample(target_x: number, target_y: number) {
      const data = await window.webgazer.getCurrentPrediction();
      if (!data) return;
      calibrationLog.push({
        index: sampleIndex++,
        target_X: target_x,
        target_Y: target_y,
        pred_X: data.x,
        pred_Y: data.y,
      });
    }

    function downloadCSVFromCalibrationLog() {
      if (calibrationLog.length === 0) return;
      const headers = ['index', 'target_X', 'target_Y', 'pred_X', 'pred_Y'];
      const csvRows = [
        headers.join(','),
        ...calibrationLog.map((row) =>
          [row.index, row.target_X, row.target_Y, row.pred_X, row.pred_Y].join(
            ','
          )
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

    async function startCalibration() {
      dot.style.display = 'block';

      const totalDuration = 60000;
      const startTime = performance.now();
      const lengths = positions.map((pos) => distance(pos.from, pos.to));
      const totalLength = lengths.reduce((a, b) => a + b, 0);

      let acc = 0;
      const timeline: PositionSegment[] = [];
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

      function moveDot() {
        const now = performance.now();
        const elapsed = now - startTime;

        if (elapsed >= totalDuration) {
          dot.style.display = 'none';
          console.table(calibrationLog);
          downloadCSVFromCalibrationLog();

          window.dispatchEvent(
            new CustomEvent('gaze-tracker-toggle', { detail: { active: true } })
          );
          navigate('/home');
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

        window.webgazer.recordScreenPosition(x + 50, y + 50, 'custom');
        recordCalibrationSample(x, y);

        requestAnimationFrame(moveDot);
      }

      requestAnimationFrame(moveDot);
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

  return (
    <PageWrapper>
      <MessageText>정면의 점을 응시해주세요</MessageText>
      <CountdownText id="countdown">초기화 중입니다...</CountdownText>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #213ebb;
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

export default CalibrationPage;
