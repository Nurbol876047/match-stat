import React, { useEffect, useRef, useState } from 'react';
// MediaPipe loaded dynamically
// types ignored
import { mapLandmarksToGesture } from './GestureMapper';
import type { GestureState } from './GestureMapper';
import { Hand, Camera, CameraOff, AlertCircle } from 'lucide-react';

interface HandTrackingProps {
  onGestureUpdate: (gesture: GestureState) => void;
  className?: string;
}

export const HandTracking: React.FC<HandTrackingProps> = ({ onGestureUpdate, className = '' }) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<any>(null);
  const smoothedLandmarksRef = useRef<any[] | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  // Keep track of active state for the rAF loop
  const isActiveRef = useRef(false);

  const initHands = () => {
      const hands = new (window as any).Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });
      
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0, // Уменьшена сложность для предотвращения лагов (работает намного быстрее!)
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      
      hands.onResults(onResults);
      handsRef.current = hands;
  };

  const onResults = (results: any) => {
    // Draw landmarks on canvas
    if (canvasRef.current && videoRef.current) {
      const canvasCtx = canvasRef.current.getContext('2d');
      if (canvasCtx) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // draw video
        canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // draw landmarks
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const rawLandmarks = results.multiHandLandmarks[0];
          
          // 1. Exponential Moving Average (EMA) Filter for Jitter
          const smoothingFactor = 0.4; // 0.4 дает более четкий и быстрый отклик
          
          let landmarks = rawLandmarks;
          if (!smoothedLandmarksRef.current) {
            smoothedLandmarksRef.current = rawLandmarks.map((l: any) => ({ ...l }));
          } else {
            landmarks = rawLandmarks.map((raw: any, i: number) => {
              const smoothed = smoothedLandmarksRef.current![i];
              smoothed.x += (raw.x - smoothed.x) * smoothingFactor;
              smoothed.y += (raw.y - smoothed.y) * smoothingFactor;
              smoothed.z += (raw.z - smoothed.z) * smoothingFactor;
              return { ...smoothed };
            });
          }

          // emit gesture state
          const gesture = mapLandmarksToGesture(landmarks);
          onGestureUpdate(gesture);

          // draw connections roughly
          canvasCtx.fillStyle = '#10b981'; // emerald 500
          for (let i = 0; i < landmarks.length; i++) {
            const x = landmarks[i].x * canvasRef.current.width;
            const y = landmarks[i].y * canvasRef.current.height;
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, 3, 0, 2 * Math.PI);
            canvasCtx.fill();
          }
        } else {
            // Hand lost - softly reset gesture
            smoothedLandmarksRef.current = null;
            onGestureUpdate({ wingAmplitude: 0, pitch: 0, yaw: 0, position: { x: 0.5, y: 0.5, z: 0.5 } });
        }
        canvasCtx.restore();
      }
    }
  };

  const startCamera = async () => {
    try {
      setIsInitializing(true);
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      initHands();
      setIsActive(true);
      isActiveRef.current = true;
      
      // start processing loop
      const processFrame = async () => {
        if (!isActiveRef.current) return;
        
        if (videoRef.current && handsRef.current) {
           await handsRef.current.send({ image: videoRef.current });
        }
        animationRef.current = requestAnimationFrame(processFrame);
      };
      
      processFrame();
      
    } catch (err: any) {
      console.error('Camera error:', err);
      setError('Не удалось получить доступ к камере. Пожалуйста, разрешите доступ в настройках браузера.');
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    setIsActive(false);
    isActiveRef.current = false;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    
    // reset gesture values
    onGestureUpdate({ wingAmplitude: 0, pitch: 0, yaw: 0, position: { x: 0.5, y: 0.5, z: 0.5 } });
  };

  useEffect(() => {
    // Load MediaPipe script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      stopCamera(); // cleanup on unmount
    };
  }, []);

  const toggleTracking = () => {
    if (isActive) stopCamera();
    else startCamera();
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex items-start gap-3 text-red-200 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      <button
        onClick={toggleTracking}
        disabled={isInitializing}
        className={`relative flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl font-medium tracking-wide transition-all overflow-hidden ${
          isActive 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
            : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isActive ? (
          <>
            <span className="absolute left-4 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <CameraOff className="w-4 h-4" />
            <span className="text-sm">Выключить управление рукой</span>
          </>
        ) : (
          <>
            <Camera className="w-4 h-4" />
            <span className="text-sm">{isInitializing ? 'Подключение...' : 'Включить управление рукой'}</span>
          </>
        )}
      </button>

      {/* Preview Window */}
      <div className={`relative w-full rounded-xl overflow-hidden border border-white/10 transition-all duration-300 ${isActive ? 'h-[180px] opacity-100' : 'h-0 opacity-0 border-transparent'}`}>
        <video 
          ref={videoRef} 
          className="hidden" 
          playsInline 
          muted 
        />
        <canvas 
          ref={canvasRef} 
          width={320} 
          height={240} 
          className="w-full h-full object-cover -scale-x-100" 
        />
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-white/80 text-[10px] px-2 py-1 rounded-md flex items-center gap-2">
          <Hand className="w-3 h-3" />
          <span>Hand Tracking Active</span>
        </div>
      </div>
    </div>
  );
};
