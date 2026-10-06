import React, { useState } from 'react';
import {
  Play,
  Square,
  Pause,
  AlertCircle,
  RotateCcw,
  Sliders,
  ChevronDown,
  ChevronUp,
  MapPin,
  Lock
} from 'lucide-react';
import { useDeviceAudioMonitor } from '../../hooks/useDeviceAudioMonitor';
import { InfoButton } from '../../components/common/InfoButton';
import { CalibrationModal } from '../../components/monitor/CalibrationModal';
import { NoiseSeverity } from '../../types';
import { dataService } from '../../services/dataService';

export const LiveMonitorPage: React.FC = () => {
  const {
    state,
    isMonitoring,
    isPaused,
    isStale,
    errorMessage,
    currentDb,
    averageDb,
    peakDb,
    uncalibratedDb,
    history,
    calibrationOffset,
    updateCalibrationOffset,
    resetCalibration,
    startMonitoring,
    pauseMonitoring,
    resumeMonitoring,
    stopMonitoring,
    resetSession
  } = useDeviceAudioMonitor();

  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [hasContributed, setHasContributed] = useState(false);
  const [contributionMsg, setContributionMsg] = useState<string | null>(null);

  // Compute severity based on current dB
  const severity: NoiseSeverity =
    currentDb <= 65 ? 'Safe' : currentDb <= 75 ? 'Moderate' : currentDb <= 85 ? 'High' : 'Critical';

  const severityPill = {
    Safe: { label: 'Safe', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' },
    Moderate: { label: 'Moderate', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800' },
    High: { label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border-orange-300 dark:border-orange-800' },
    Critical: { label: 'Critical', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800' }
  }[severity];

  const severityExplanation = {
    Safe: 'Sound is within safe, comfortable levels. Ideal for concentration and sleep.',
    Moderate: 'Normal ambient volume like busy street traffic or marketplace murmur.',
    High: 'Loud environment like heavy vehicle transit or construction activity.',
    Critical: 'Potentially harmful sound. Prolonged exposure can stress ears.'
  }[severity];

  // Optional contribution of measurement (Requirement #28 & #29)
  const handleContributeReading = () => {
    if (currentDb <= 0) return;
    try {
      dataService.addReading({
        id: `meas-${Date.now()}`,
        timestamp: new Date().toISOString(),
        locationId: 'user-loc-live',
        locationName: 'Citizen Live Measurement',
        cityName: 'Local Area',
        noiseLevelDb: currentDb,
        dataSource: 'DEVICE_ESTIMATE',
        measurementMethod: 'Web Audio RMS Ingestion',
        timeWeighting: 'Fast (125ms)'
      });
      setHasContributed(true);
      setContributionMsg('Measurement anonymously shared with local map.');
      setTimeout(() => setContributionMsg(null), 4000);
    } catch {
      setContributionMsg('Could not save measurement.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-2 py-4 sm:py-8 space-y-6">
      {/* 1. Header (Ultra-minimal) */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Live Noise Monitor
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Measure real-time acoustic loudness using your device microphone
        </p>
      </div>

      {/* 2. Permission / Error Notice */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <p className="leading-relaxed font-medium">{errorMessage}</p>
            <button
              onClick={startMonitoring}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-rose-800 dark:text-rose-200 font-bold border border-rose-300 dark:border-rose-700 shadow-2xs hover:bg-rose-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. The Minimalist Monitor Card (Requirement #12) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center relative overflow-hidden transition-all">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
          <div className="flex items-center gap-1 font-medium">
            <span>Estimated reading</span>
            <InfoButton
              title="Estimated reading"
              content="This measurement uses your device microphone and may vary between phone and computer models. It is processed entirely inside your browser."
              size="xs"
            />
          </div>

          <div className="flex items-center gap-2">
            {isMonitoring && !isPaused && !isStale && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>LIVE</span>
              </span>
            )}
            {isPaused && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                PAUSED
              </span>
            )}
            {isStale && isMonitoring && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                WAITING DATA
              </span>
            )}
            {state === 'STOPPED' && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                STOPPED
              </span>
            )}
            {!isMonitoring && state === 'IDLE' && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-850 dark:text-slate-400">
                STANDBY
              </span>
            )}
          </div>
        </div>

        {/* ONE Primary Number Display */}
        <div className="my-6 flex flex-col items-center justify-center">
          {state === 'REQUESTING_PERMISSION' || state === 'INITIALIZING' ? (
            <div className="py-12 space-y-3">
              <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-500">
                {state === 'REQUESTING_PERMISSION'
                  ? 'Waiting for microphone permission...'
                  : 'Starting audio pipeline...'}
              </p>
            </div>
          ) : isStale && isMonitoring ? (
            <div className="py-10 space-y-2">
              <span className="text-5xl font-mono font-bold text-slate-300 dark:text-slate-700 animate-pulse">
                --
              </span>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                Waiting for microphone data...
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-7xl sm:text-8xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                  {currentDb > 0 ? Math.round(currentDb) : '--'}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-slate-400">
                  dB
                </span>
                <InfoButton
                  title="What does this mean?"
                  content={`${Math.round(currentDb || 45)} dB means ${severityExplanation}`}
                  size="sm"
                  className="translate-y-[-10px]"
                />
              </div>

              {/* Severity Pill */}
              {currentDb > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs">
                  <span className={`w-2 h-2 rounded-full ${
                    severity === 'Safe' ? 'bg-emerald-500' :
                    severity === 'Moderate' ? 'bg-amber-500' :
                    severity === 'High' ? 'bg-orange-500' : 'bg-rose-500'
                  }`} />
                  <span className={severityPill.color.split(' ')[1]}>
                    {severity} Sound
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Mini Graph (Waveform/history) */}
        {isMonitoring && history.length > 2 && (
          <div className="my-6 p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>LIVE TREND</span>
              <span>{history.length} pts</span>
            </div>
            <div className="h-20 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={history
                    .map((p, idx) => {
                      const x = (idx / (history.length - 1 || 1)) * 300;
                      const clamped = Math.max(30, Math.min(105, p.db));
                      const y = 55 - ((clamped - 30) / 75) * 50;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
              </svg>
            </div>
          </div>
        )}

        {/* Average and Peak row */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400">
              <span>Average</span>
              <InfoButton
                title="Average Level"
                content="The equivalent energy average (Leq) sound level calculated over this monitoring session."
                size="xs"
              />
            </div>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {averageDb > 0 ? averageDb : '--'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">dB</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400">
              <span>Peak</span>
              <InfoButton
                title="Peak Level"
                content="The highest instantaneous decibel spike recorded during this session."
                size="xs"
              />
            </div>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {peakDb > 0 ? peakDb : '--'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">dB</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          {!isMonitoring ? (
            <button
              onClick={startMonitoring}
              className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 rounded-2xl shadow-lg shadow-teal-600/20 active:scale-98 transition-all"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Monitoring</span>
            </button>
          ) : (
            <div className="w-full flex items-center justify-center gap-3">
              {isPaused ? (
                <button
                  onClick={resumeMonitoring}
                  className="flex-1 sm:flex-none px-6 py-3 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 rounded-xl border border-teal-200 dark:border-teal-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  onClick={pauseMonitoring}
                  className="flex-1 sm:flex-none px-6 py-3 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 rounded-xl border border-amber-200 dark:border-amber-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={stopMonitoring}
                className="flex-1 sm:flex-none px-6 py-3 text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-800 transition-colors flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop</span>
              </button>

              <button
                onClick={resetSession}
                title="Reset session peak and average"
                className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Optional: Add this measurement to my location (Requirement #28 & #29) */}
        {isMonitoring && currentDb > 0 && !hasContributed && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleContributeReading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Add this measurement to my location</span>
            </button>
          </div>
        )}

        {contributionMsg && (
          <div className="mt-3 p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-[11px] font-semibold text-teal-700 dark:text-teal-300 animate-in fade-in">
            {contributionMsg}
          </div>
        )}
      </div>

      {/* 4. More details toggle & Calibration access (Requirement #8 & #12) */}
      <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
        <button
          type="button"
          onClick={() => setShowMoreDetails((prev) => !prev)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-teal-600"
        >
          <span>More details &amp; Calibration</span>
          {showMoreDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showMoreDetails && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
            {/* Calibration trigger button (Requirement #8) */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-850">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Device Calibration
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Current offset: {calibrationOffset > 0 ? `+${calibrationOffset}` : calibrationOffset} dB
                </span>
              </div>
              <button
                onClick={() => setShowCalibrationModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Calibrate</span>
              </button>
            </div>

            {/* Privacy Guarantee (Requirement #29) */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Privacy Guaranteed:</strong> Audio processing is executed strictly inside your browser. No speech or raw audio is ever recorded or uploaded.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 5. Calibration Modal */}
      <CalibrationModal
        isOpen={showCalibrationModal}
        onClose={() => setShowCalibrationModal(false)}
        currentUncalibratedDb={uncalibratedDb}
        currentOffset={calibrationOffset}
        onSaveOffset={updateCalibrationOffset}
        onResetOffset={resetCalibration}
      />
    </div>
  );
};
