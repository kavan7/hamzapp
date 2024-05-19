"use client";

import React, { useEffect, useRef, useState } from 'react';
import { PoseLandmarker, FilesetResolver, DrawingUtils, LandmarkData } from '@mediapipe/tasks-vision';
import Flashcard from './components/Flashcard';
import { calculateAngle } from './utils/MathUtils';
import Link from 'next/link';

let leftStage = "up";
let rightStage = "up";
// const [questCount, setQuestCount] = useState(0);

const initialQuestion = {
  question: "What is the capital of France?",
  choices: ["Berlin", "Paris"] as [string, string],
  correctAnswer: "Paris",
};

const getNewQuestion = async () => {
  let quests: String[][] = [['Which language is primairly used for web development along with HTML and CSS', 'Javascript', 'Python', 'Javascript'], ['What is the purpose of a "for loop" in programming', 'To iterate over a sequence of elements', 'To define a new variable', 'To iterate over a sequence of elements'], ['Which of the following is a version control system', 'Git', 'SSH', 'Git'], ['What does the python function len() do', 'converts a value to a string', 'returns the length of an object', 'returns the length of an object'], ['What does SQL stand for', 'Structured Query Language', 'Simple Query List', 'Structured Query Language'], ['Which HTML tag is used to create a hyperlink', '<a>', '<link>', '<a>'], ['Which language is primairly usef for iOS app development', 'Swift', 'Kotlin', 'Swift'], ['What is the main purpose of CSS in web dev', 'To style and layout web pages', 'To structure the content of web pages', 'To style and layout web pages'], ['What does API stand for','Advanced Programming Instruction', 'Application Programming Interface', 'Application Programming Interface'],['In Java, what keyword is used to define a class', 'define', 'class', 'class'] ]
  return {
    question: "What is the capital of Germany?",
    choices: ["Berlin", "Paris"] as [string, string],
    correctAnswer: "Berlin",
  };
};

const PoseLandmarkerComponent: React.FC = () => {
  const [question, setQuestion] = useState(initialQuestion);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleAnswer = async (isCorrect: boolean) => {
    alert(isCorrect ? "Correct!" : "Incorrect!");
    setHasAnswered(true);
    await handleNewQuestion();
  };

  const handleNewQuestion = async () => {
    const newQuestion = await getNewQuestion();
    setQuestion(newQuestion);
    setHasAnswered(false);
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const lastVideoTime = useRef(-1);

  useEffect(() => {
    const createPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      const newPoseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 3,
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
                radius: (data: LandmarkData) => (data.from ? DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1) : 1),
              });
              drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
            }
          } else {
            console.log("No landmarks detected.");
          }

          canvasCtx.restore();

          if (result.landmarks[0] && result.landmarks[0].length >= 16) {
            const leftShoulder = result.landmarks[0][11];
            const leftElbow = result.landmarks[0][13];
            const leftWrist = result.landmarks[0][15];
            const rightShoulder = result.landmarks[0][12];
            const rightElbow = result.landmarks[0][14];
            const rightWrist = result.landmarks[0][16];
            const leftAnkle = result.landmarks[0][28];
            const leftKnee = result.landmarks[0][26];
            const leftHip = result.landmarks[0][24];
            const rightAnkle = result.landmarks[0][27];
            const rightKnee = result.landmarks[0][25];
            const rightHip = result.landmarks[0][23];

            let leftAngleS = calculateAngle(leftAnkle, leftKnee, leftHip);
            let rightAngleS = calculateAngle(rightAnkle, rightKnee, rightHip);
            let leftAngleP = calculateAngle(leftShoulder, leftElbow, leftWrist);
            let rightAngleP = calculateAngle(rightShoulder, rightElbow, rightWrist);

            console.log(`Left Arm Angle: ${leftAngleP}`);
            console.log(`Right Arm Angle: ${rightAngleP}`);
            console.log(`Left Leg Angle: ${leftAngleS}`);
            console.log(`Right Leg Angle: ${rightAngleS}`);

            const leftArmRaised = leftAngleP > 80 && leftAngleP < 100;
            const rightArmRaised = rightAngleP > 80 && rightAngleP < 100;
            const leftLegRaised = leftAngleS > 80 && leftAngleS < 100;
            const rightLegRaised = rightAngleS > 80 && rightAngleS < 100;

            if (leftArmRaised && rightArmRaised) {
              handleAnswer(question.choices[1] === question.correctAnswer);
            } else if (leftLegRaised && rightLegRaised) {
              handleAnswer(question.choices[0] === question.correctAnswer);
            }
          }
        });
      }
      window.requestAnimationFrame(predictWebcam);
    }
  };

  return (
    <section className="bg-hero-pattern">
      <div className="container" onClick={enableCam}>
        <div className="video-container">
          <video ref={videoRef} style={{ display: 'block' }}></video>
          <canvas ref={canvasRef} id="output_canvas" width="480" height="480"></canvas>
        </div>
        
        <Flashcard
          question={question.question}
          choices={question.choices}
          correctAnswer={question.correctAnswer}
          onAnswer={handleAnswer}
          onNewQuestion={handleNewQuestion}
        />
        
        <Link href="/addFlashcard">
          <button style={{ padding: '10px 10px', backgroundColor: 'blue' }}>Go to Home</button>
        </Link>
        <style>{`
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
    </section>
  );
};

export default PoseLandmarkerComponent;
