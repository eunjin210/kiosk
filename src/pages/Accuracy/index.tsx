import styled from '@emotion/styled';
import Header from '@/components/Common/Header';
import { useRef, useState } from 'react';

type Point = {
  x: number;
  y: number;
  timestamp: number;
};

// declare global {
//   interface Window {
//     webgazer: any; // WebGazer.js는 타입이 없기 때문에 any로 처리 (또는 @types/webgazer 사용)
//   }
// }

const AccuracyPage = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [calibrationFinished, setCalibrationFinished] = useState(false);
  const [accuracy, setAccuracy] = useState<string | null>(null);

  const startAccuracyTest = async () => {
    alert('정확도 측정을 시작합니다.\n화면 중앙 점을 5초간 바라보세요.');

    const prediction = window.webgazer.getSmoothedPrediction();
    console.log(prediction);
    const dot = dotRef.current;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    if (dot) {
      dot.style.left = `${centerX}px`;
      dot.style.top = `${centerY}px`;
      dot.style.display = 'block';
    }

    await sleep(2000);
    storePoints();
    await sleep(5000);
    stopStorePoints();
    console.log(window.webgazer.getStoredPoints());

    const [xList, yList]: [number[], number[]] =
      window.webgazer.getStoredPoints();
    const now = Date.now();
    const points: Point[] = xList.map((x, i) => ({
      x,
      y: yList[i],
      timestamp: now + i,
    }));

    const result = calculatePrecision(points, centerX, centerY);
    setAccuracy(result);
    downloadAccuracyCSV(points, centerX, centerY);

    if (dot) dot.style.display = 'none';

    alert(`정확도 측정 완료!\n화면 중앙 기준으로 ${result}% 정확도입니다.`);
  };

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function storePoints() {
    window.webgazer.params.storingPoints = true;
  }

  function stopStorePoints() {
    window.webgazer.params.storingPoints = false;
  }

  function calculatePrecision(points: Point[], cx: number, cy: number): string {
    const inRadius = points.filter((p) => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      return Math.sqrt(dx * dx + dy * dy) <= 100;
    });
    return ((inRadius.length / points.length) * 100).toFixed(2);
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

  return (
    <Wrapper>
      <Header></Header>
      <Title>시선 정확도 분석</Title>
      <Button onClick={startAccuracyTest}>정확도 분석 시작</Button>
      {accuracy && <Result>📊 정확도: {accuracy}%</Result>}
      <Dot ref={dotRef} />
    </Wrapper>
  );
};

export default AccuracyPage;

const Wrapper = styled.div`
  background-color: white;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
    margin: 0;
    padding: 0;
  }

  @media (max-width: 480px) {
    padding: 12px;
    gap: 12px;
    margin: 0;
    padding: 0;
  }
`;

const Title = styled.h1`
  color: white;
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 18px;
  background: white;
  border: none;
  cursor: pointer;
`;

const Result = styled.div`
  color: yellow;
  font-size: 20px;
`;

const Dot = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: red;
  position: fixed;
  z-index: 99999;
  display: none;
`;
