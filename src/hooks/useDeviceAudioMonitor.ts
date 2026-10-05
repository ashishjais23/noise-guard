import { useState, useEffect, useRef, useCallback } from 'react';

export type MicPermissionState = 'idle' | 'prompt' | 'granted' | 'denied' | 'unavailable' | 'unsupported';

export interface AudioPoint {
  time: string;
  db: number;
}

export interface UseDeviceAudioMonitorReturn {
  permissionState: MicPermissionState;
  isMonitoring: boolean;
  isPaused: boolean;
  currentDb: number;
  averageDb: number;
  peakDb: number;
  durationSeconds: number;
  history: AudioPoint[];
  errorMessage: string | null;
  startMonitoring: () => Promise<void>;
  pauseMonitoring: () => void;
  resumeMonitoring: () => void;
  stopMonitoring: () => void;
}

export function useDeviceAudioMonitor(): UseDeviceAudioMonitorReturn {
  const [permissionState, setPermissionState] = useState<MicPermissionState>('idle');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentDb, setCurrentDb] = useState(45);
  const [averageDb, setAverageDb] = useState(45);
  const [peakDb, setPeakDb] = useState(45);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [history, setHistory] = useState<AudioPoint[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<any>(null);

  const samplesRef = useRef<number[]>([]);
  const peakRef = useRef<number>(45);
  const isPausedRef = useRef(false);

  // Sync ref
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Clean up resources on unmount
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const startMonitoring = async () => {
    setErrorMessage(null);
    setPermissionState('prompt');

    // 1. Check browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionState('unsupported');
      setErrorMessage(
        'Your browser does not support standard Web Audio recording. Please try an updated modern browser such as Chrome, Safari, Edge, or Firefox.'
      );
      return;
    }

    try {
      // 2. Request microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      mediaStreamRef.current = stream;
      setPermissionState('granted');

      // 3. Setup AudioContext and Analyser
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.65;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      // Reset states
      samplesRef.current = [];
      peakRef.current = 40;
      setDurationSeconds(0);
      setHistory([]);
      setIsMonitoring(true);
      setIsPaused(false);

      // Timer ticker
      timerIntervalRef.current = setInterval(() => {
        if (!isPausedRef.current) {
          setDurationSeconds((d) => d + 1);
        }
      }, 1000);

      // 4. Real-time audio analysis loop
      const buffer = new Float32Array(analyser.fftSize);
      let lastChartUpdate = Date.now();

      const processAudio = () => {
        if (!analyserRef.current || !isMonitoring) {
          return;
        }

        if (!isPausedRef.current) {
          analyserRef.current.getFloatTimeDomainData(buffer);

          // Calculate Root Mean Square (RMS)
          let sumSquares = 0;
          for (let i = 0; i < buffer.length; i++) {
            sumSquares += buffer[i] * buffer[i];
          }
          const rms = Math.sqrt(sumSquares / buffer.length);

          // Convert RMS to estimated acoustic decibel SPL
          // Uncalibrated consumer device baseline normalization
          let dbEst = 20 * Math.log10(rms + 1e-4) + 96;

          // Clamp to realistic everyday acoustic limits (35 dB whisper - 110 dB siren)
          dbEst = Math.max(35, Math.min(108, Math.round(dbEst * 10) / 10));

          setCurrentDb(dbEst);

          // Update samples and peak
          samplesRef.current.push(dbEst);
          if (dbEst > peakRef.current) {
            peakRef.current = dbEst;
            setPeakDb(dbEst);
          }

          // Calculate energy equivalent / running mean
          if (samplesRef.current.length % 5 === 0) {
            const sum = samplesRef.current.reduce((a, b) => a + b, 0);
            const avg = Math.round((sum / samplesRef.current.length) * 10) / 10;
            setAverageDb(avg);
          }

          // Append to chart history every 800ms
          const now = Date.now();
          if (now - lastChartUpdate >= 800) {
            lastChartUpdate = now;
            const timeLabel = new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });

            setHistory((prev) => {
              const next = [...prev, { time: timeLabel, db: dbEst }];
              return next.length > 30 ? next.slice(next.length - 30) : next;
            });
          }
        }

        animationFrameRef.current = requestAnimationFrame(processAudio);
      };

      animationFrameRef.current = requestAnimationFrame(processAudio);
    } catch (err: any) {
      cleanup();
      setIsMonitoring(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionState('denied');
        setErrorMessage(
          'Microphone permission was denied. Please allow microphone access in your browser address bar settings to measure ambient noise.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionState('unavailable');
        setErrorMessage(
          'No microphone device was detected on your computer or phone. Please plug in or connect an audio input.'
        );
      } else {
        setPermissionState('unavailable');
        setErrorMessage(
          err.message || 'Unable to access audio device. Please ensure your microphone is not locked by another application.'
        );
      }
    }
  };

  const pauseMonitoring = () => {
    setIsPaused(true);
  };

  const resumeMonitoring = () => {
    setIsPaused(false);
  };

  const stopMonitoring = () => {
    cleanup();
    setIsMonitoring(false);
    setIsPaused(false);
  };

  return {
    permissionState,
    isMonitoring,
    isPaused,
    currentDb,
    averageDb,
    peakDb,
    durationSeconds,
    history,
    errorMessage,
    startMonitoring,
    pauseMonitoring,
    resumeMonitoring,
    stopMonitoring
  };
}
