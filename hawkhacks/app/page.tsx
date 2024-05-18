"use client";

import React, { useEffect, useRef, useState } from 'react';
import { PoseLandmarker, FilesetResolver, DrawingUtils, LandmarkData } from '@mediapipe/tasks-vision';
import Flashcard from './components/Flashcard';

let stage = "up";

const initialQuestion = {
  question: "What is the capital of France?",
  choices: ["Paris", "Berlin"] as [string, string],
  correctAnswer: "Paris",
};

const getNewQuestion = async () => {
  // Simulate an AI call to generate a new question
  return {
    question: "What is the capital of Germany?",
    choices: ["Berlin", "Paris"] as [string, string],
    correctAnswer: "Berlin",
  };
};


const PoseLandmarkerComponent: React.FC = () => {
  const [question, setQuestion] = useState(initialQuestion);

  const handleAnswer = (isCorrect: boolean) => {
    alert(isCorrect ? "Correct!" : "Incorrect!");
  };

  const handleNewQuestion = async () => {
    const newQuestion = await getNewQuestion();
    setQuestion(newQuestion);
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [counter, setCounter] = useState(0);

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
        numPoses: 3
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

    const video = videoRef.current;
    if (video) {
      if (webcamRunning) {
        video.srcObject = null;
        setWebcamRunning(false);
      } else {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = stream;
          video.play();
          video.addEventListener("loadeddata", predictWebcam);
          setWebcamRunning(true);
        } catch (error) {
          console.error("Error accessing webcam: ", error);
        }
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

    if (video && canvas && canvasCtx && poseLandmarker) {
      const startTimeMs = performance.now();
      if (lastVideoTime.current !== video.currentTime) {
        lastVideoTime.current = video.currentTime;

        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        if (videoWidth === 0 || videoHeight === 0) {
          console.log("Video width or height is zero.");
          return;
        }
        poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

          if (result.landmarks.length > 0) {
            for (const landmark of result.landmarks) {
              const drawingUtils = new DrawingUtils(canvasCtx);
              drawingUtils.drawLandmarks(landmark, {
                radius: (data: LandmarkData) => data.from ? DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1) : 1
              });
              drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
            }
          } else {
            console.log("No landmarks detected.");
          }

          canvasCtx.restore();

          if (result.landmarks[0] && result.landmarks[0].length >= 16) {
            const shoulder = [result.landmarks[0][11].x, result.landmarks[0][11].y];
            const elbow = [result.landmarks[0][13].x, result.landmarks[0][13].y];
            const wrist = [result.landmarks[0][15].x, result.landmarks[0][15].y];

            let angle = calculateAngle(shoulder, elbow, wrist);
            console.log(angle);

            if (angle > 160 && stage === "up") {
              stage = "down";
            } 
            else if (stage === "down" && angle < 20) {
              stage = "up";
              setCounter((prev) => prev + 1);
            }
            console.log(counter);

          }
        });
      }

      window.requestAnimationFrame(predictWebcam);
    }
  };

  return (
    <div className="container">
      <div className="video-container">
        <video ref={videoRef} style={{ display: 'block' }}></video>
        <canvas ref={canvasRef} id="output_canvas" width="480" height="480"></canvas>
      </div>
      <button onClick={enableCam} id="webcamButton">
        {webcamRunning ? "DISABLE PREDICTIONS" : "ENABLE PREDICTIONS"}
      </button>
      <p>Counter: {counter}</p>
      <p>Stage: {stage}</p>
      <Flashcard
        question={question.question}
        choices={question.choices}
        correctAnswer={question.correctAnswer}
        onAnswer={handleAnswer}
        onNewQuestion={handleNewQuestion}
      />
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        .video-container {
          position: relative;
          width: 480px;
          height: 480px;
        }
        video {
          width: 100%;
          height: 100%;
        }
        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default PoseLandmarkerComponent;
