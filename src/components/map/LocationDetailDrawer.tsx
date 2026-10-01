import React from 'react';
import { LocationItem, NoiseReading, ProjectThresholds } from '../../types';
import { determineSeverity } from '../../services/alertEngine';
import { StatusBadge } from '../common/StatusBadge';
import { DataSourceBadge } from '../common/DataSourceBadge';
import { X, MapPin, Clock, Activity, Lightbulb, Compass } from 'lucide-react';
import { PageId } from '../layout/Sidebar';

interface LocationDetailDrawerProps {
  location: LocationItem | null;
  latestReading?: NoiseReading;
  allReadings: NoiseReading[];
  thresholds: ProjectThresholds;
  onClose: () => void;
  setActivePage: (page: PageId) => void;
}

export const LocationDetailDrawer: React.FC<LocationDetailDrawerProps> = ({
  location,
  latestReading,
  allReadings,
  thresholds,
  onClose,
  setActivePage
}) => {
  if (!location) return null;

  const currentDb = latestReading ? latestReading.noiseLevelDb : location.baselineDb;
  const severity = determineSeverity(currentDb, thresholds);
  const dataSource = latestReading ? latestReading.dataSource : 'SIMULATED';

  // Compute location-specific stats from history
  const locReadings = allReadings.filter((r) => r.locationId === location.id);
  const avgDb = locReadings.length > 0
    ? Math.round(
        (locReadings.reduce((sum, r) => sum + r.noiseLevelDb, 0) / locReadings.length) * 10
      ) / 10
    : location.baselineDb;

  let peakDb = currentDb;
  for (const r of locReadings) {
    if (r.noiseLevelDb > peakDb) peakDb = r.noiseLevelDb;
  }

  return (
    <div className="absolute top-4 right-4 z-500 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-5 overflow-hidden animate-in slide-in-from-right-5 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            LOCATION DETAILS
          </span>
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {location.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="line-clamp-1">{location.address}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close detail panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Status & Metrics */}
      <div className="py-4 space-y-4">
        {/* Status Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Status:</span>
            <StatusBadge severity={severity} size="md" />
          </div>
          <DataSourceBadge source={dataSource} size="sm" />
        </div>

        {/* Primary Noise Level Gauge */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block font-medium">Current Level</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono text-slate-900">
                {currentDb}
              </span>
              <span className="text-sm font-semibold text-slate-500">dB(A)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block font-medium">Baseline</span>
            <span className="text-base font-bold font-mono text-slate-700">
              {location.baselineDb} dB
            </span>
          </div>
        </div>

        {/* 3-Col Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] text-slate-500 block">Average Today</span>
            <span className="text-base font-bold font-mono text-slate-800">
              {avgDb} dB
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] text-slate-500 block">Peak Recorded</span>
            <span className="text-base font-bold font-mono text-rose-700">
              {peakDb} dB
            </span>
          </div>
        </div>

        {/* Peak Period & Zone Details */}
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-700">Peak Period: </span>
              <span>{location.peakPeriod}</span>
            </div>
          </div>
          <div className="flex items-start gap-2 text-slate-600">
            <Compass className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-700">Zone Type: </span>
              <span>{location.locationType}</span>
            </div>
          </div>

          {/* Acoustic Context & Percentiles */}
          {latestReading && (
            <div className="p-2.5 rounded-lg bg-teal-50/60 border border-teal-100 text-teal-950 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span>L10 (Peaks): <strong>{latestReading.l10 || Math.round((currentDb + 2.5) * 10) / 10} dB</strong></span>
                <span>L90 (Floor): <strong>{latestReading.l90 || Math.round((currentDb - 4.0) * 10) / 10} dB</strong></span>
              </div>
              {latestReading.acousticContext && (
                <div className="text-[11px] text-teal-800 italic pt-0.5 border-t border-teal-200/50">
                  &ldquo;{latestReading.acousticContext}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/50 leading-relaxed">
          {location.description}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => setActivePage('recommendations')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Interventions</span>
        </button>
        <button
          onClick={() => setActivePage('analytics')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Activity className="w-3.5 h-3.5 text-slate-500" />
          <span>Analytics</span>
        </button>
      </div>
    </div>
  );
};
