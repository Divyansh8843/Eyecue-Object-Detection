"use client";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {renderPredictions} from "../utils/renderPredictions"
import * as tf from "@tensorflow/tfjs";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectInterval = useRef(null);

  const runObjectDetection = async (net) => {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const video = webcamRef.current.video;
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;

      const ctx = canvasRef.current.getContext("2d");
      const detectedObjects = await net.detect(video);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      renderPredictions(detectedObjects, ctx);
    }
  };

  const runCoco = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const net = await cocoSSDLoad();
      setIsLoading(false);

      detectInterval.current = setInterval(() => {
        runObjectDetection(net);
      }, 200); 
    } catch (error) {
      console.error("Error loading the COCO-SSD model:", error);
      setError("Failed to load AI model. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
  
    if (webcamRef.current?.video) {
      webcamRef.current.video.width = webcamRef.current.video.videoWidth;
      webcamRef.current.video.height = webcamRef.current.video.videoHeight;
    }

    runCoco();

    return () => {
      if (detectInterval.current) {
        clearInterval(detectInterval.current);
      }
  
      if (webcamRef.current?.video?.srcObject) {
        const tracks = webcamRef.current.video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="mt-8 text-white">
      {isLoading ? (
        <div className="gradienttext">Loading AI Model...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="gradienttitle relative flex justify-center items-center text-white p-1.5 rounded-md">
          <Webcam
            ref={webcamRef}
            className="rounded-md w-full lg:h-[720px]"
            muted
            onError={(e) => setError("Failed to access camera. Please check permissions.")}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-50 w-full lg:h-[720px]"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
