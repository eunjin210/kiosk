import { useEffect, useState, useRef } from 'react';

const GlobalGazeTracker = () => {
  const [isActive, setIsActive] = useState(false);
  const hoverTargetRef = useRef<HTMLElement | null>(null);
  const hoverStartRef = useRef<number | null>(null);

  useEffect(() => {
    const dot = document.createElement('div');
    dot.id = 'gaze-dot';
    dot.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: red;
      position: fixed;
      z-index: 99999;
      pointer-events: none;
      display: none;
    `;

    document.body.appendChild(dot);

    const interval = setInterval(() => {
      if (
        !window.webgazer ||
        typeof window.webgazer.getSmoothedPrediction !== 'function'
      )
        return;
      const prediction = window.webgazer.getSmoothedPrediction();

      if (!prediction) {
        console.log('예측값이 없어요');
        return;
      }

      const x = prediction.x;
      const y = prediction.y;

      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      dot.style.display = isActive ? 'block' : 'none';

      const el = document.elementFromPoint(
        prediction.x,
        prediction.y
      ) as HTMLElement | null;

      if (el !== hoverTargetRef.current) {
        if (hoverTargetRef.current) {
          hoverTargetRef.current.dispatchEvent(
            new Event('mouseleave', { bubbles: true })
          );
          hoverTargetRef.current.style?.setProperty('outline', 'none');
        }

        if (el) {
          el.dispatchEvent(new Event('mouseenter', { bubbles: true }));
        }
        hoverTargetRef.current = el;
        hoverStartRef.current = Date.now();
      } else if (
        el &&
        hoverStartRef.current &&
        Date.now() - hoverStartRef.current > 500
      ) {
        el.click();
        hoverStartRef.current = null;
      }
    }, 100);

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsActive(detail.active);
    };
    window.addEventListener('gaze-tracker-toggle', handler);

    return () => {
      clearInterval(interval);
      window.removeEventListener('gaze-tracker-toggle', handler);
      document.body.removeChild(dot);
    };
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      console.log('🟢 시선 추적 점 활성화됨');
    } else {
      console.log('🔴 시선 추적 점 비활성화됨');
    }
  }, [isActive]);

  return null;
};

export default GlobalGazeTracker;
