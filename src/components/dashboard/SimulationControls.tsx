import React from 'react';
import { Play, Pause, RotateCcw, StepForward, Clock, Sparkles } from 'lucide-react';
import { InfoTooltip } from '../common/InfoTooltip';

interface SimulationControlsProps {
  isRunning: boolean;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onStepOnce: () => void;
  secondsAgo: number;
  tickIntervalMs: number;
  setTickIntervalMs: (ms: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  onPause,
  onResume,
  onReset,
  onStepOnce,
  secondsAgo,
  tickIntervalMs,
  setTickIntervalMs
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
      {/* Left Status */}
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
            isRunning
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>{isRunning ? 'Simulation Running' : 'Simulation Paused'}</span>
          {isRunning && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Updated {secondsAgo === 0 ? 'just now' : `${secondsAgo}s ago`}
          </span>
          <InfoTooltip content="These readings are simulated for demonstration purposes using autoregressive Markovian acoustic drift." />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Play/Pause Button */}
        {isRunning ? (
          <button
            onClick={onPause}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Pause className="w-3.5 h-3.5 text-slate-700" />
            <span>Pause Simulation</span>
          </button>
        ) : (
          <button
            onClick={onResume}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-white" />
            <span>Resume Simulation</span>
          </button>
        )}

        {/* Step Once Button (useful when paused) */}
        {!isRunning && (
          <button
            onClick={onStepOnce}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
            title="Advance one simulation tick"
          >
            <StepForward className="w-3.5 h-3.5 text-slate-500" />
            <span>Step Once</span>
          </button>
        )}

        {/* Speed Selector */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <span className="text-[11px] text-slate-500 px-2 font-medium">Rate:</span>
          {[1000, 3000, 5000].map((ms) => (
            <button
              key={ms}
              onClick={() => setTickIntervalMs(ms)}
              className={`px-2 py-1 rounded font-medium text-[11px] transition-all ${
                tickIntervalMs === ms
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {ms / 1000}s
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
          title="Reset simulation to initial seed state"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
