import { useState } from 'react';
import FaceRecognition from '../FaceRecognition';
import CalibrationPage from '../Webgazer';
const FaceGazeSetupPage = () => {
  const [mode, setMode] = useState<'face' | 'calibration'>('face');

  return (
    <>
      {mode === 'face' ? (
        <FaceRecognition mode={mode} setMode={setMode} />
      ) : (
        <CalibrationPage />
      )}
    </>
  );
};

export default FaceGazeSetupPage;
