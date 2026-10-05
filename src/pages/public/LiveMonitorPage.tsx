import React, { useState } from 'react';
import {
  Mic,
  Play,
  Pause,
  Square,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Volume2,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useDeviceAudioMonitor } from '../../hooks/useDeviceAudioMonitor';
import { NoiseStatusBadge } from '../../components/common/NoiseStatusBadge';
import { NoiseLevelExplanation } from '../../components/common/NoiseLevelExplanation';
import { NoiseSeverity } from '../../types';

export const LiveMonitorPage: React.FC = () => {
  const {
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
  } = useDeviceAudioMonitor();

  const [hasPromptAccepted, setHasPromptAccepted] = useState(false);

  // Determine severity
  const severity: NoiseSeverity =
    currentDb <= 65 ? 'Safe' : currentDb <= 75 ? 'Moderate' : currentDb <= 85 ? 'High' : 'Critical';

  // Format mm:ss
  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Severity colors for dominant circle
  const severityColorStyles = {
    Safe: 'text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20',
    Moderate: 'text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20',
    High: 'text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-950/20',
    Critical: 'text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-950/20'
  }[severity];

  const handleStart = async () => {
    setHasPromptAccepted(true);
    await startMonitoring();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-2">
          <Mic className="w-3.5 h-3.5" />
          <span>Real-Time Device Acoustic Ingestion</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Live Noise Monitor
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Measure the acoustic sound level in your immediate surroundings using your device microphone.
        </p>
      </div>

      {/* Permission Explanation Modal / Callout if not started yet */}
      {!isMonitoring && permissionState !== 'denied' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                How Live Noise Monitoring Works
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                When you click <strong>Start Monitoring</strong>, your browser will prompt for microphone permission.
                We only sample ambient audio volume levels locally in your browser to calculate decibels.
                <strong> No speech, conversation, or audio is ever recorded or transmitted to any server.</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Monitoring Now</span>
            </button>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Requires 1-click microphone permission
            </span>
          </div>
        </div>
      )}

      {/* Error / Denied Callout */}
      {errorMessage && (
        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 flex items-start gap-3 text-xs text-rose-900 dark:text-rose-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-rose-950 dark:text-rose-100">Microphone Access Error</h4>
            <p className="leading-relaxed">{errorMessage}</p>
            <div className="pt-2">
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-rose-800 dark:text-rose-200 font-semibold border border-rose-300 dark:border-rose-700 hover:bg-rose-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Permission</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dominant Real-Time Meter Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center relative overflow-hidden transition-colors">
        {/* Status Pill & Location */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>📍 Your Location (Device Microphone)</span>
          </div>

          <div className="flex items-center gap-2">
            <NoiseStatusBadge severity={severity} size="md" />
            {isMonitoring && !isPaused && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>LIVE</span>
              </span>
            )}
            {isPaused && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                PAUSED
              </span>
            )}
          </div>
        </div>

        {/* The Dominant dB Value Display */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div
            className={`w-52 h-52 sm:w-60 sm:h-60 rounded-full border-4 flex flex-col items-center justify-center shadow-inner transition-all duration-300 ${severityColorStyles}`}
          >
            <span className="text-6xl sm:text-7xl font-black font-mono tracking-tight">
              {Math.round(currentDb)}
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mt-1">
              DECIBELS (dB)
            </span>
            <span className="text-xs font-semibold mt-2 px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-2xs">
              {severity} Noise
            </span>
          </div>
        </div>

        {/* 4 Metrics Row */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block">
              Current Level
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {currentDb}
              </span>
              <span className="text-xs text-slate-400">dB</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block">
              Average Level
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {averageDb}
              </span>
              <span className="text-xs text-slate-400">dB</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block">
              Peak Level
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {peakDb}
              </span>
              <span className="text-xs text-slate-400">dB</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block">
              Monitoring Duration
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {formatDuration(durationSeconds)}
              </span>
              <span className="text-xs text-slate-400">min</span>
            </div>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {!isMonitoring ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-xl shadow-md shadow-teal-600/20 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Monitoring</span>
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  onClick={resumeMonitoring}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Monitoring</span>
                </button>
              ) : (
                <button
                  onClick={pauseMonitoring}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 border border-amber-300 rounded-xl transition-all"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={stopMonitoring}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-300 rounded-xl transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Real-Time Waveform / History Graph */}
      {isMonitoring && history.length > 1 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Noise Variation Over Time
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Samples taken every ~800ms
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-teal-600 dark:text-teal-400">
              {history.length} points
            </span>
          </div>

          {/* SVG Waveform Line Chart */}
          <div className="h-44 w-full bg-slate-50 dark:bg-slate-850 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
            {/* Grid threshold guide lines */}
            <div className="absolute inset-x-4 top-1/4 border-b border-rose-200 dark:border-rose-900/40 border-dashed flex justify-between text-[10px] text-rose-500 font-mono">
              <span>85 dB (Critical)</span>
            </div>
            <div className="absolute inset-x-4 top-1/2 border-b border-orange-200 dark:border-orange-900/40 border-dashed flex justify-between text-[10px] text-orange-500 font-mono">
              <span>75 dB (High)</span>
            </div>
            <div className="absolute inset-x-4 top-3/4 border-b border-emerald-200 dark:border-emerald-900/40 border-dashed flex justify-between text-[10px] text-emerald-500 font-mono">
              <span>65 dB (Safe)</span>
            </div>

            {/* SVG line */}
            <svg className="w-full h-full relative z-10" viewBox="0 0 500 120" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#0d9488"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={history
                  .map((p, idx) => {
                    const x = (idx / (history.length - 1 || 1)) * 500;
                    // Scale 30 dB (bottom, y=110) to 100 dB (top, y=10)
                    const clamped = Math.max(30, Math.min(100, p.db));
                    const y = 110 - ((clamped - 30) / 70) * 100;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            </svg>

            {/* Time labels */}
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono pt-1">
              <span>{history[0]?.time}</span>
              <span>{history[history.length - 1]?.time}</span>
            </div>
          </div>
        </div>
      )}

      {/* Non-technical "What does this mean?" Explanation */}
      <NoiseLevelExplanation
        severity={severity}
        db={currentDb}
        averageDb={averageDb}
        peakDb={peakDb}
        mostNoisyPeriod="Measured just now"
        likelySource="Immediate ambient room / street sound"
      />

      {/* Transparent Methodology & Hardware Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Device Calibration Disclosure</span>
        </div>
        <p>
          Microphone measurements displayed here are <strong>device-based estimates</strong> computed via browser Web Audio API root-mean-square (RMS) energy. Standard smartphone and computer microphones are not factory-calibrated sound level meters (Type 1/Type 2 IEC 61672). They provide indicative situational estimates rather than legal evidence.
        </p>
      </div>
    </div>
  );
};
