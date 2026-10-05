import { useState, useEffect, useRef, useCallback } from 'react';

export type MonitoringState =
  | 'IDLE'
  | 'REQUESTING_PERMISSION'
  | 'INITIALIZING'
  | 'MONITORING'
  | 'PAUSED'
  | 'ERROR'
  | 'STOPPED';

export type MicPermissionState = 'idle' | 'prompt' | 'granted' | 'denied' | 'unavailable' | 'unsupported';

export interface AudioPoint {
  time: string;
  db: number;
}

export interface AudioDiagnostics {
  audioContextState: string;
  sampleRate: number;
  channelCount: number;
  autoGainControl: 'OFF' | 'ON' | 'UNSUPPORTED';
  noiseSuppression: 'OFF' | 'ON' | 'UNSUPPORTED';
  echoCancellation: 'OFF' | 'ON' | 'UNSUPPORTED';
  lastSampleTimeDeltaMs: number | null;
  isStale: boolean;
  rawRms: number;
  rawDbFs: number;
  uncalibratedEstimate: number;
  calibrationOffset: number;
}

export interface UseDeviceAudioMonitorReturn {
  // State machine & status
  state: MonitoringState;
  permissionState: MicPermissionState;
  isMonitoring: boolean;
  isPaused: boolean;
  isStale: boolean;
  errorMessage: string | null;

  // Measurements
  currentDb: number;
  averageDb: number;
  peakDb: number;
  recentPeakDb: number;
  uncalibratedDb: number;
  durationSeconds: number;
  history: AudioPoint[];

  // Calibration
  calibrationOffset: number;
  updateCalibrationOffset: (offset: number) => void;
  resetCalibration: () => void;

  // Diagnostics
  diagnostics: AudioDiagnostics;

  // Controls
  startMonitoring: () => Promise<void>;
  pauseMonitoring: () => void;
  resumeMonitoring: () => void;
  stopMonitoring: () => void;
  resetSession: () => void;
}

const CALIBRATION_STORAGE_KEY = 'noiseguard_device_calibration_offset_v1';

function getSavedCalibrationOffset(): number {
  if (typeof window === 'undefined') return 0;
  const val = localStorage.getItem(CALIBRATION_STORAGE_KEY);
  if (val !== null) {
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && isFinite(parsed)) return parsed;
  }
  return 0;
}

export function useDeviceAudioMonitor(): UseDeviceAudioMonitorReturn {
  const [state, setState] = useState<MonitoringState>('IDLE');
  const [permissionState, setPermissionState] = useState<MicPermissionState>('idle');
  const [currentDb, setCurrentDb] = useState<number>(0);
  const [uncalibratedDb, setUncalibratedDb] = useState<number>(0);
  const [averageDb, setAverageDb] = useState<number>(0);
  const [peakDb, setPeakDb] = useState<number>(0);
  const [recentPeakDb, setRecentPeakDb] = useState<number>(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [history, setHistory] = useState<AudioPoint[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [calibrationOffset, setCalibrationOffset] = useState<number>(getSavedCalibrationOffset);
  const [isStale, setIsStale] = useState<boolean>(false);

  // Diagnostics state
  const [diagnostics, setDiagnostics] = useState<AudioDiagnostics>({
    audioContextState: 'none',
    sampleRate: 0,
    channelCount: 0,
    autoGainControl: 'UNSUPPORTED',
    noiseSuppression: 'UNSUPPORTED',
    echoCancellation: 'UNSUPPORTED',
    lastSampleTimeDeltaMs: null,
    isStale: false,
    rawRms: 0,
    rawDbFs: -100,
    uncalibratedEstimate: 0,
    calibrationOffset: getSavedCalibrationOffset()
  });

  // Audio nodes and lifecycle references
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const staleCheckIntervalRef = useRef<any>(null);

  // Processing state refs (to avoid stale closures in requestAnimationFrame)
  const isMonitoringRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const calibrationOffsetRef = useRef<number>(calibrationOffset);
  const lastSampleTimestampRef = useRef<number>(0);
  const smoothingWindowRef = useRef<number[]>([]);
  const energyHistoryRef = useRef<number[]>([]);
  const sessionPeakRef = useRef<number>(0);
  const recentWindowRef = useRef<{ timestamp: number; db: number }[]>([]);

  // Update calibration ref when state changes
  useEffect(() => {
    calibrationOffsetRef.current = calibrationOffset;
  }, [calibrationOffset]);

  const updateCalibrationOffset = useCallback((offset: number) => {
    const clamped = Math.max(-30, Math.min(30, Math.round(offset * 10) / 10));
    setCalibrationOffset(clamped);
    calibrationOffsetRef.current = clamped;
    try {
      localStorage.setItem(CALIBRATION_STORAGE_KEY, clamped.toString());
    } catch {
      // ignore storage errors
    }
  }, []);

  const resetCalibration = useCallback(() => {
    updateCalibrationOffset(0);
  }, [updateCalibrationOffset]);

  // Clean up all audio nodes and animation loops
  const cleanup = useCallback(() => {
    isMonitoringRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (staleCheckIntervalRef.current) {
      clearInterval(staleCheckIntervalRef.current);
      staleCheckIntervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
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

  // Stale sample watchdog
  useEffect(() => {
    if (state === 'MONITORING' && !isPausedRef.current) {
      staleCheckIntervalRef.current = setInterval(() => {
        const delta = Date.now() - lastSampleTimestampRef.current;
        if (delta > 2000) {
          setIsStale(true);
          setDiagnostics((prev) => ({
            ...prev,
            isStale: true,
            lastSampleTimeDeltaMs: delta
          }));
        } else {
          setIsStale(false);
          setDiagnostics((prev) => ({
            ...prev,
            isStale: false,
            lastSampleTimeDeltaMs: delta
          }));
        }
      }, 500);
    } else {
      if (staleCheckIntervalRef.current) {
        clearInterval(staleCheckIntervalRef.current);
        staleCheckIntervalRef.current = null;
      }
    }
    return () => {
      if (staleCheckIntervalRef.current) {
        clearInterval(staleCheckIntervalRef.current);
        staleCheckIntervalRef.current = null;
      }
    };
  }, [state]);

  const startMonitoring = async () => {
    cleanup();
    setErrorMessage(null);
    setState('REQUESTING_PERMISSION');
    setPermissionState('prompt');

    // 1. Check navigator.mediaDevices support
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setState('ERROR');
      setPermissionState('unsupported');
      setErrorMessage(
        'Your browser does not support live microphone monitoring. Please try Chrome, Firefox, Safari, or Edge.'
      );
      return;
    }

    try {
      // 2. Discover supported constraints gracefully (Requirement #4)
      const supportedConstraints =
        navigator.mediaDevices.getSupportedConstraints?.() || {};

      const audioConstraints: MediaTrackConstraints = {};

      if (supportedConstraints.echoCancellation) {
        audioConstraints.echoCancellation = false;
      }
      if (supportedConstraints.noiseSuppression) {
        audioConstraints.noiseSuppression = false;
      }
      if (supportedConstraints.autoGainControl) {
        audioConstraints.autoGainControl = false;
      }

      // Request stream with graceful degradation
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints
        });
      } catch {
        // Fallback to basic audio constraint if strict request fails
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
      }

      mediaStreamRef.current = stream;
      setPermissionState('granted');
      setState('INITIALIZING');

      // Inspect actual track settings
      const audioTrack = stream.getAudioTracks()[0];
      const actualSettings = audioTrack?.getSettings?.() || {};

      const agcActual: 'OFF' | 'ON' | 'UNSUPPORTED' =
        !supportedConstraints.autoGainControl
          ? 'UNSUPPORTED'
          : actualSettings.autoGainControl === false
          ? 'OFF'
          : 'ON';

      const nsActual: 'OFF' | 'ON' | 'UNSUPPORTED' =
        !supportedConstraints.noiseSuppression
          ? 'UNSUPPORTED'
          : actualSettings.noiseSuppression === false
          ? 'OFF'
          : 'ON';

      const ecActual: 'OFF' | 'ON' | 'UNSUPPORTED' =
        !supportedConstraints.echoCancellation
          ? 'UNSUPPORTED'
          : actualSettings.echoCancellation === false
          ? 'OFF'
          : 'ON';

      // 3. AudioContext initialization
      const AudioCtxClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) {
        setState('ERROR');
        setPermissionState('unsupported');
        setErrorMessage('Web Audio API is not supported on this browser.');
        return;
      }

      const audioCtx = new AudioCtxClass();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      audioContextRef.current = audioCtx;

      // Analyser Node configuration
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.25; // Responsive yet controlled
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      // Reset measurement buffers
      smoothingWindowRef.current = [];
      energyHistoryRef.current = [];
      sessionPeakRef.current = 0;
      recentWindowRef.current = [];
      lastSampleTimestampRef.current = Date.now();

      setCurrentDb(0);
      setAverageDb(0);
      setPeakDb(0);
      setRecentPeakDb(0);
      setDurationSeconds(0);
      setHistory([]);
      setIsStale(false);

      // Set active flags
      isMonitoringRef.current = true;
      isPausedRef.current = false;
      setState('MONITORING');

      // Update initial diagnostics
      setDiagnostics({
        audioContextState: audioCtx.state,
        sampleRate: audioCtx.sampleRate || 48000,
        channelCount: actualSettings.channelCount || 1,
        autoGainControl: agcActual,
        noiseSuppression: nsActual,
        echoCancellation: ecActual,
        lastSampleTimeDeltaMs: 0,
        isStale: false,
        rawRms: 0,
        rawDbFs: -100,
        uncalibratedEstimate: 0,
        calibrationOffset: calibrationOffsetRef.current
      });

      // Session Duration Timer
      timerIntervalRef.current = setInterval(() => {
        if (!isPausedRef.current && isMonitoringRef.current) {
          setDurationSeconds((d) => d + 1);
        }
      }, 1000);

      // 4. Real-time Audio Sample Loop (using Ref flag to prevent closure stalls)
      const buffer = new Float32Array(analyser.fftSize);
      let lastHistoryPush = Date.now();
      let lastDiagnosticsUpdate = Date.now();

      const processAudio = () => {
        // Break loop if monitoring was stopped or analyser destroyed
        if (!isMonitoringRef.current || !analyserRef.current) {
          return;
        }

        if (!isPausedRef.current) {
          analyserRef.current.getFloatTimeDomainData(buffer);
          const now = Date.now();
          lastSampleTimestampRef.current = now;

          // Step A: DC Offset Removal
          let sumSamples = 0;
          for (let i = 0; i < buffer.length; i++) {
            sumSamples += buffer[i];
          }
          const dcOffset = sumSamples / buffer.length;

          // Step B: Calculate RMS of DC-centered samples
          let sumSquares = 0;
          for (let i = 0; i < buffer.length; i++) {
            const centered = buffer[i] - dcOffset;
            sumSquares += centered * centered;
          }
          const rms = Math.sqrt(sumSquares / buffer.length);

          // Step C: Convert RMS to dBFS then estimate SPL
          // 0 dBFS is digital maximum. Silence floor is capped at 1e-5.
          const effectiveRms = Math.max(rms, 1e-5);
          const dbFs = 20 * Math.log10(effectiveRms);

          // Empirical acoustic transfer function for mobile/laptop mics:
          // Digital full scale ~ 120 dB SPL. Quiet room (-65 dBFS) gives ~35 dB.
          // Loud room (-40 dBFS) gives ~60 dB. Shouting/Traffic (-20 dBFS) gives ~80 dB.
          let rawEstimatedSpl = dbFs + 100;
          // Clamp to realistic physical environmental range (30 dB whisper - 115 dB siren)
          rawEstimatedSpl = Math.max(30, Math.min(115, rawEstimatedSpl));

          // Step D: Rolling Window Smoothing (5 samples, ~80-120ms)
          const windowQueue = smoothingWindowRef.current;
          windowQueue.push(rawEstimatedSpl);
          if (windowQueue.length > 5) {
            windowQueue.shift();
          }
          const smoothedEstimate =
            windowQueue.reduce((a, b) => a + b, 0) / windowQueue.length;

          // Step E: Apply Device Calibration Offset
          const offset = calibrationOffsetRef.current;
          const calibratedFinal = Math.max(
            30,
            Math.min(115, Math.round((smoothedEstimate + offset) * 10) / 10)
          );
          const uncalFinal = Math.round(smoothedEstimate * 10) / 10;

          setCurrentDb(calibratedFinal);
          setUncalibratedDb(uncalFinal);

          // Step F: Session Peak & Short-Window Peak
          if (calibratedFinal > sessionPeakRef.current) {
            sessionPeakRef.current = calibratedFinal;
            setPeakDb(calibratedFinal);
          }

          // Short-window peak (last 3 seconds)
          recentWindowRef.current.push({ timestamp: now, db: calibratedFinal });
          recentWindowRef.current = recentWindowRef.current.filter(
            (item) => now - item.timestamp <= 3000
          );
          const currentRecentPeak = Math.max(
            ...recentWindowRef.current.map((i) => i.db),
            calibratedFinal
          );
          setRecentPeakDb(currentRecentPeak);

          // Step G: Leq Equivalent Energy Average
          const linearEnergy = Math.pow(10, calibratedFinal / 10);
          energyHistoryRef.current.push(linearEnergy);

          // Update running Leq average every 6 frames
          if (energyHistoryRef.current.length % 6 === 0) {
            const sumEnergy = energyHistoryRef.current.reduce((a, b) => a + b, 0);
            const meanEnergy = sumEnergy / energyHistoryRef.current.length;
            const leqAvg = Math.round(10 * Math.log10(meanEnergy) * 10) / 10;
            setAverageDb(Math.max(30, Math.min(115, leqAvg)));
          }

          // Step H: Chart History Append (every ~700ms)
          if (now - lastHistoryPush >= 700) {
            lastHistoryPush = now;
            const timeLabel = new Date(now).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });

            setHistory((prev) => {
              const next = [...prev, { time: timeLabel, db: calibratedFinal }];
              return next.length > 30 ? next.slice(next.length - 30) : next;
            });
          }

          // Step I: Periodic diagnostics update (every 1000ms)
          if (now - lastDiagnosticsUpdate >= 1000) {
            lastDiagnosticsUpdate = now;
            setDiagnostics((prev) => ({
              ...prev,
              audioContextState: audioContextRef.current?.state || 'running',
              rawRms: Math.round(rms * 10000) / 10000,
              rawDbFs: Math.round(dbFs * 10) / 10,
              uncalibratedEstimate: uncalFinal,
              calibrationOffset: offset,
              lastSampleTimeDeltaMs: 0,
              isStale: false
            }));
          }
        }

        // Continue animation frame loop
        animationFrameRef.current = requestAnimationFrame(processAudio);
      };

      // Kick off the loop
      animationFrameRef.current = requestAnimationFrame(processAudio);
    } catch (err: any) {
      cleanup();
      setState('ERROR');

      if (
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError'
      ) {
        setPermissionState('denied');
        setErrorMessage(
          'Microphone permission was denied. Please allow microphone access in your browser to measure sound.'
        );
      } else if (
        err.name === 'NotFoundError' ||
        err.name === 'DevicesNotFoundError'
      ) {
        setPermissionState('unavailable');
        setErrorMessage(
          'No microphone detected on your device. Please connect an audio input.'
        );
      } else if (
        err.name === 'NotReadableError' ||
        err.name === 'TrackStartError'
      ) {
        setPermissionState('unavailable');
        setErrorMessage(
          'Your microphone is currently in use by another application or locked by the system.'
        );
      } else {
        setPermissionState('unavailable');
        setErrorMessage(
          err.message ||
            'Unable to access your microphone. Please check your system audio settings and try again.'
        );
      }
    }
  };

  const pauseMonitoring = useCallback(() => {
    isPausedRef.current = true;
    setState('PAUSED');
  }, []);

  const resumeMonitoring = useCallback(() => {
    isPausedRef.current = false;
    setState('MONITORING');
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }
  }, []);

  const stopMonitoring = useCallback(() => {
    cleanup();
    setState('STOPPED');
  }, [cleanup]);

  const resetSession = useCallback(() => {
    energyHistoryRef.current = [];
    smoothingWindowRef.current = [];
    recentWindowRef.current = [];
    sessionPeakRef.current = currentDb;
    setPeakDb(currentDb);
    setAverageDb(currentDb);
    setDurationSeconds(0);
    setHistory([]);
  }, [currentDb]);

  return {
    state,
    permissionState,
    isMonitoring: state === 'MONITORING' || state === 'PAUSED',
    isPaused: state === 'PAUSED',
    isStale,
    errorMessage,
    currentDb,
    averageDb,
    peakDb,
    recentPeakDb,
    uncalibratedDb,
    durationSeconds,
    history,
    calibrationOffset,
    updateCalibrationOffset,
    resetCalibration,
    diagnostics,
    startMonitoring,
    pauseMonitoring,
    resumeMonitoring,
    stopMonitoring,
    resetSession
  };
}
