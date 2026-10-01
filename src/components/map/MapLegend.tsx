import React from 'react';
import { ProjectThresholds } from '../../types';

interface MapLegendProps {
  thresholds: ProjectThresholds;
}

export const MapLegend: React.FC<MapLegendProps> = ({ thresholds }) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-md text-xs">
      <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block mb-2">
        Acoustic Status Legend
      </span>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600 shrink-0" />
          <span className="font-medium text-slate-700">Safe:</span>
          <span className="text-slate-500">&lt; {thresholds.safeMax} dB</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600 shrink-0" />
          <span className="font-medium text-slate-700">Moderate:</span>
          <span className="text-slate-500">
            {thresholds.safeMax} - {thresholds.moderateMax} dB
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 border border-orange-600 shrink-0" />
          <span className="font-medium text-slate-700">High:</span>
          <span className="text-slate-500">
            {thresholds.moderateMax} - {thresholds.highMax} dB
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-600 border border-rose-700 shrink-0 animate-pulse" />
          <span className="font-medium text-slate-700">Critical:</span>
          <span className="text-slate-500">&gt; {thresholds.highMax} dB</span>
        </div>
      </div>
      <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
        Demo locations for illustrative monitoring
      </div>
    </div>
  );
};
