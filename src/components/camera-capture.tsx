import React, { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FlipHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { speak } from '../lib/utils';
import { processImage } from '../lib/image-processing';

const vibrate = (pattern: number[]) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

export function CameraCapture() {
  const webcamRef = useRef<Webcam>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDescription, setLastDescription] = useState<string>('');
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [autoCapture, setAutoCapture] = useState(false);

  const capture = useCallback(async () => {
    if (isProcessing) return;
    
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      speak("Failed to capture image. Please try again.");
      return;
    }

    setIsProcessing(true);
    speak("Processing the image. Please wait.");

    try {
      const description = await processImage(imageSrc);
      setLastDescription(description);
      speak(description);
    } catch (error) {
      speak("Sorry, there was an error processing the image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const handleSwitchCamera = () => {
    setFacingMode(prevMode => 
      prevMode === "user" ? "environment" : "user"
    );
    speak(facingMode === "user" ? 
      "Switching to back camera" : 
      "Switching to front camera"
    );
  };

  const [lastTap, setLastTap] = useState<number>(0);
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      capture();
    }
    setLastTap(now);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speak("Camera is ready. Double tap anywhere on the screen to capture and describe what the camera sees.");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!autoCapture) return;

    const interval = setInterval(() => {
      if (!isProcessing) {
        capture();
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [autoCapture, isProcessing, capture]);

  return (
    <div 
      className="relative h-[calc(100vh-4rem)]"
      onClick={handleDoubleTap}
    >
      <div className="relative h-full rounded-lg overflow-hidden bg-gray-900">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
          audio={false}
          videoConstraints={{
            facingMode: facingMode,
            height: window.innerHeight - 64,
            width: window.innerWidth
          }}
        />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleSwitchCamera();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-800"
          variant="outline"
          size="default"
        >
          <FlipHorizontal className="w-5 h-5" />
        </Button>
      </div>
      
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white">Processing...</div>
        </div>
      )}
    </div>
  );
}
