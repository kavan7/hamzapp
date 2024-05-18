"use client";

import React, { useEffect, useRef, useState } from 'react';
import { PoseLandmarker, FilesetResolver, DrawingUtils, LandmarkData } from '@mediapipe/tasks-vision';

const PoseLandmarkerComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [counter, setCounter] = useState(0);
  const [stage, setStage] = useState<string | null>(null);
  const lastVideoTime = useRef(-1);

  useEffect(() => {
    const createPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      const newPoseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numPoses: 2
      });
      setPoseLandmarker(newPoseLandmarker);
    };
    createPoseLandmarker();
  }, []);

  const enableCam = async () => {
    if (!poseLandmarker) {
      console.log("Wait! poseLandmarker not loaded yet.");
      return;
    }

    setWebcamRunning((prev) => !prev);

    const video = videoRef.current;
    if (video) {
      if (webcamRunning) {
        video.srcObject = null;
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = 'block';  // Ensure the video is visible
        video.addEventListener("loadeddata", predictWebcam);
      }
    }
  };

  const calculateAngle = (a: number[], b: number[], c: number[]): number => {
    let radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
    let angle = Math.abs(radians * 180 / Math.PI);
    if (angle > 180) {
      angle = 360 - angle;
    }
    return angle;
  };

  const predictWebcam = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");

    if (video && canvas && canvasCtx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const startTimeMs = performance.now();
      if (lastVideoTime.current !== video.currentTime) {
        lastVideoTime.current = video.currentTime;
        poseLandmarker!.detectForVideo(video, startTimeMs, (result) => {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
          for (const landmark of result.landmarks) {
            const drawingUtils = new DrawingUtils(canvasCtx);
            drawingUtils.drawLandmarks(landmark, {
              radius: (data: LandmarkData) => data.from ? DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1) : 1
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
          }
          canvasCtx.restore();


          if (result.landmarks[0] && result.landmarks[0].length >= 16) {
            const shoulder = [result.landmarks[0][11].x, result.landmarks[0][11].y];
            const elbow = [result.landmarks[0][13].x, result.landmarks[0][13].y];
            const wrist = [result.landmarks[0][15].x, result.landmarks[0][15].y];

            let angle = calculateAngle(shoulder, elbow, wrist);

            if (angle > 160) {
              setStage("down");
            } 
            if (angle < 30 && stage === "down") {
              setStage("up");
              setCounter((prev) => prev + 1);
            }
          }
        });
      }

      if (webcamRunning) {
        window.requestAnimationFrame(predictWebcam);
      }
    }
  };

  return (
    <div>
      <video ref={videoRef} style={{ display: 'block', width: '480px', height: '480px' }}></video>
      <canvas ref={canvasRef} id="output_canvas" width="480" height="480"></canvas>

      <button onClick={enableCam} id="webcamButton">
        {webcamRunning ? "DISABLE PREDICTIONS" : "ENABLE PREDICTIONS"}
      </button>
      <p>Counter: {counter}</p>
      <p>Stage: {stage}</p>
    </div>
  );
};

export default PoseLandmarkerComponent;
