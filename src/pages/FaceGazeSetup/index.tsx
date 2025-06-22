import { useState } from 'react';
import FaceRecognition from '../FaceRecognition';
import CalibrationPage from '../Webgazer';
const FaceGazeSetupPage = () => {
  const [mode, setMode] = useState<'face' | 'calibration'>('face');
  const [distance, setDistance] = useState<number | null>(null);
  return (
    <>
      {mode === 'face' ? (
        <FaceRecognition
          mode={mode}
          setAiMode={setMode}
          setDistance={setDistance}
        />
      ) : (
        <CalibrationPage distance={distance} />
      )}
    </>
  );
};

export default FaceGazeSetupPage;
