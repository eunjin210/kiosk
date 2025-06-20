import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import styled from '@emotion/styled';
import Button from '@/components/Common/Button';
import { setSerialPort } from '@/utils/serialPort';

type SerialPort = {
  open: (options: { baudRate: number }) => Promise<void>;
  writable: WritableStream<Uint8Array>;
  readable: ReadableStream<Uint8Array>;
  close: () => Promise<void>;
};

declare global {
  interface Navigator {
    serial: {
      requestPort: () => Promise<SerialPort>;
    };
  }
}
type FaceRecognitionProps = {
  mode: 'face' | 'calibration';
  setMode: React.Dispatch<React.SetStateAction<'face' | 'calibration'>>;
  setDistance: React.Dispatch<React.SetStateAction<number | null>>;
};

const REAL_FACE_WIDTH_CM = 16;
const STEP = 5;

const FaceRecognition = ({ setMode, setDistance }: FaceRecognitionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const faceCanvasRef = useRef<HTMLCanvasElement>(null);
  const [finished, setFinished] = useState(false);

  const samples: tf.Tensor[] = [];
  let frameCount = 0;

  useEffect(() => {
    let stream: MediaStream;
    let animationId: number;
    let ageGenderModel: tf.GraphModel;
    let faceModel: blazeface.BlazeFaceModel;

    const MEAN = tf.tensor([0.485, 0.456, 0.406]).reshape([1, 3, 1, 1]);
    const STD = tf.tensor([0.229, 0.224, 0.225]).reshape([1, 3, 1, 1]);

    const init = async () => {
      [ageGenderModel, faceModel] = await Promise.all([
        tf.loadGraphModel('./web_model/model.json'),
        blazeface.load(),
      ]);

      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });

      const video = videoRef.current!;
      video.srcObject = stream;
      await new Promise((resolve) => (video.onloadedmetadata = resolve));
      video.play();

      const overlay = overlayRef.current!;
      overlay.width = video.videoWidth;
      overlay.height = video.videoHeight;
      overlay.style.width = `${video.videoWidth}px`;
      overlay.style.height = `${video.videoHeight}px`;
      video.width = video.videoWidth;
      video.height = video.videoHeight;

      const faceCanvas = faceCanvasRef.current!;
      const fctx = faceCanvas.getContext('2d')!;
      const octx = overlay.getContext('2d')!;

      const loop = async () => {
        frameCount++;
        const prediction = (await faceModel.estimateFaces(video, false))[0];
        octx.clearRect(0, 0, overlay.width, overlay.height);

        if (prediction) {
          const [x1, y1] = prediction.topLeft as [number, number];
          const [x2, y2] = prediction.bottomRight as [number, number];
          const w = x2 - x1;
          const h = y2 - y1;

          octx.strokeStyle = '#0f0';
          octx.lineWidth = 2;
          octx.strokeRect(x1, y1, w, h);

          const dx_px = x1 + w / 2 - overlay.width / 2;
          const dy_px = overlay.height / 2 - (y1 + h / 2);
          const px2cm = REAL_FACE_WIDTH_CM / w;
          const dx_cm = (dx_px * px2cm).toFixed(1);
          const dy_cm = (dy_px * px2cm).toFixed(1);
          console.log('거리값 float로 ', parseInt(dy_cm));
          setDistance(parseInt(dy_cm));
          octx.fillStyle = '#0f0';
          octx.font = '16px sans-serif';
          octx.fillText(
            `ΔX ${dx_cm} cm, ΔY ${dy_cm} cm`,
            x1,
            Math.max(y1 - 10, 16)
          );
          if (!finished && samples.length < 5 && frameCount % STEP === 0) {
            fctx.drawImage(video, x1, y1, w, h, 0, 0, 224, 224);
            const t = tf.tidy(() =>
              tf.browser
                .fromPixels(faceCanvas)
                .toFloat()
                .div(255)
                .transpose([2, 0, 1])
                .expandDims(0)
                .sub(MEAN)
                .div(STD)
            );
            samples.push(t);
          }

          if (!finished && samples.length === 3) {
            let ageSum = 0,
              gSum = 0;
            for (const t of samples) {
              const outs = ageGenderModel.predict(t) as tf.Tensor[];
              const [age, log] =
                outs[0].shape[1] === 2
                  ? [outs[1], outs[0]]
                  : [outs[0], outs[1]];
              ageSum += age.dataSync()[0];
              gSum += tf.softmax(log).dataSync()[1];
              age.dispose();
              log.dispose();
            }
            samples.forEach((t) => t.dispose());
            samples.length = 0;

            const ageAvg = (ageSum / 3).toFixed(1);
            const gProb = gSum / 3;
            const gLab = gProb > 0.5 ? 'Male' : 'Female';
            console.log(
              `Gender: ${gLab} (${(gProb * 100).toFixed(0)}%)  |  Age ≈ ${ageAvg} yrs`
            );
            setFinished(true);
            stream.getTracks().forEach((track) => track.stop());
            return;
          }
        } else {
          samples.forEach((t) => t.dispose());
          samples.length = 0;
        }

        animationId = requestAnimationFrame(loop);
      };

      loop();
    };

    init();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function connect() {
    try {
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 9600 });
      const selectedWriter = selectedPort.writable.getWriter();
      const selectedReader = selectedPort.readable.getReader();

      setSerialPort(selectedPort, selectedWriter, selectedReader);
    } catch (err) {
      console.error('❌ 연결 실패:', err);
    }
  }

  const handleStartClick = () => {
    setMode('calibration');
  };

  return (
    <PageWrapper>
      <Button size="xlarge" theme="blue" onClick={() => handleStartClick()}>
        시작하기
      </Button>
      <div style={{ textAlign: 'center' }}>
        <div id="wrap" style={{ position: 'relative', display: 'none' }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              border: '2px solid #444',
              borderRadius: '4px',
              display: 'none',
            }}
          />
          <canvas
            ref={overlayRef}
            style={{ position: 'absolute', left: 0, top: 0, display: 'none' }}
          />
        </div>
        <canvas
          ref={faceCanvasRef}
          width={224}
          height={224}
          style={{ display: 'none' }}
        />
      </div>
      <ConnectButton onClick={connect}>🔌 아두이노 연결</ConnectButton>
    </PageWrapper>
  );
};

export default FaceRecognition;

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #213ebb;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ConnectButton = styled.button`
  position: fixed;
  left: 10px;
  bottom: 10px;
  z-index: 9999;
  background-color: #ffffffcc;
  color: #213ebb;
  border: 1px solid #213ebb;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: #e6e6e6;
  }
`;
