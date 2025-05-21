import React, { useEffect } from 'react';

declare global {
  interface Window {
    webgazer: any;
  }
}

const EyeTracker: React.FC = () => {
  useEffect(() => {
    const gazeListener = (data: any, elapsedTime: number) => {
      if (data) {
        console.log(`X: ${data.x}, Y: ${data.y}`);
      }
    };

    // WebGazer 초기화
    window.webgazer
      .setRegression('ridge')
      .setGazeListener(gazeListener)
      .begin()
      .then(() => {
        console.log('WebGazer has started.');
      });

    // 안전하게 정리
    return () => {
      if (
        window.webgazer?.isReady &&
        typeof window.webgazer.end === 'function'
      ) {
        window.webgazer.end();
      }
    };
  }, []);

  return (
    <div>
      <h1>WebGazer Eye Tracking</h1>
      <p>웹캠을 통해 시선을 추적합니다.</p>
    </div>
  );
};

export default EyeTracker;
