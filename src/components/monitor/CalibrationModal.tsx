import React, { useState } from 'react';
import { Sliders, RotateCcw, Check, X, ShieldAlert, Info } from 'lucide-react';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUncalibratedDb: number;
  currentOffset: number;
  onSaveOffset: (newOffset: number) => void;
  onResetOffset: () => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  isOpen,
  onClose,
  currentUncalibratedDb,
  currentOffset,
  onSaveOffset,
  onResetOffset
}) => {
  const [referenceLevel, setReferenceLevel] = useState<number>(70);
  const [customOffset, setCustomOffset] = useState<number>(currentOffset);
  const [mode, setMode] = useState<'reference' | 'manual'>('reference');
  const [savedFeedback, setSavedFeedback] = useState(false);

  if (!isOpen) return null;

  // Calculated offset if using reference level
  const computedOffset =
    currentUncalibratedDb > 0
      ? Math.round((referenceLevel - currentUncalibratedDb) * 10) / 10
      : customOffset;

  const handleApplyReference = () => {
    onSaveOffset(computedOffset);
    setCustomOffset(computedOffset);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 900);
  };

  const handleApplyManual = () => {
    onSaveOffset(customOffset);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    onResetOffset();
    setCustomOffset(0);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Microphone Calibration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Align device readings with a reference source
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live reading overview */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-center">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Device Estimate
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-0.5">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {currentUncalibratedDb > 0 ? currentUncalibratedDb : '—'}
              </span>
              <span className="text-xs text-slate-400">dB</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Current Offset
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-0.5">
              <span className="text-xl font-bold font-mono text-teal-600 dark:text-teal-400">
                {currentOffset > 0 ? `+${currentOffset}` : currentOffset}
              </span>
              <span className="text-xs text-teal-500">dB</span>
            </div>
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('reference')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              mode === 'reference'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Match Reference Meter
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              mode === 'manual'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Manual Offset Slider
          </button>
        </div>

        {mode === 'reference' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reference Level (e.g. from handheld meter or known room volume)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="40"
                  max="110"
                  step="0.5"
                  value={referenceLevel}
                  onChange={(e) => setReferenceLevel(Number(e.target.value))}
                  className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-xs font-bold text-slate-500">dBA</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-xs text-teal-900 dark:text-teal-200 flex items-center justify-between">
              <span>Resulting Offset:</span>
              <span className="font-mono font-bold text-teal-700 dark:text-teal-300">
                {computedOffset > 0 ? `+${computedOffset}` : computedOffset} dB
              </span>
            </div>

            <button
              onClick={handleApplyReference}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              {savedFeedback ? <Check className="w-4 h-4" /> : null}
              <span>{savedFeedback ? 'Saved!' : 'Save Calibration'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Offset Adjustment</span>
                <span className="font-mono text-teal-600 dark:text-teal-400">
                  {customOffset > 0 ? `+${customOffset}` : customOffset} dB
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="0.5"
                value={customOffset}
                onChange={(e) => setCustomOffset(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>-20 dB</span>
                <span>0 dB</span>
                <span>+20 dB</span>
              </div>
            </div>

            <button
              onClick={handleApplyManual}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              {savedFeedback ? <Check className="w-4 h-4" /> : null}
              <span>{savedFeedback ? 'Saved!' : 'Save Calibration'}</span>
            </button>
          </div>
        )}

        {/* Disclaimer / Explanation (Requirement #8) */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
          Calibration improves consistency on this device, but consumer microphones vary between hardware manufacturers. Do not use for legal acoustic disputes.
        </p>

        {currentOffset !== 0 && (
          <button
            onClick={handleReset}
            className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Factory Baseline (0 dB)</span>
          </button>
        )}
      </div>
    </div>
  );
};
