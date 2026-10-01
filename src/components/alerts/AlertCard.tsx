import React from 'react';
import { NoiseAlert } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { DataSourceBadge } from '../common/DataSourceBadge';
import { Clock, MapPin, ArrowRight, Lightbulb, Check } from 'lucide-react';
import { PageId } from '../layout/Sidebar';

interface AlertCardProps {
  alert: NoiseAlert;
  onAcknowledge: (id: string) => void;
  onViewLocation: (locId: string) => void;
  setActivePage: (page: PageId) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onAcknowledge,
  onViewLocation,
  setActivePage
}) => {
  const dateStr = new Date(alert.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div
      className={`p-4 rounded-xl border transition-all bg-white shadow-xs hover:shadow-md ${
        alert.severity === 'Critical'
          ? 'border-rose-300 ring-1 ring-rose-200'
          : 'border-slate-200/80'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <StatusBadge severity={alert.severity} size="md" />
          <h4 className="font-bold text-slate-900 text-sm">{alert.locationName}</h4>
        </div>
        <div className="flex items-center gap-2">
          <DataSourceBadge source={alert.dataSource} size="sm" />
          <span className="text-xs text-slate-400 font-mono">{dateStr}</span>
        </div>
      </div>

      <div className="my-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Measured Sound Level
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono text-slate-900">
              {alert.noiseLevelDb}
            </span>
            <span className="text-xs font-semibold text-slate-500">dB</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Exceedance Duration
          </span>
          <div className="flex items-center gap-1 text-slate-700 font-mono text-sm font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>~{alert.durationMinutes} minutes</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Incident State
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
              alert.status === 'Active'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {alert.status}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewLocation(alert.locationId)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200/60"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>View Location</span>
          </button>

          <button
            onClick={() => setActivePage('recommendations')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>View Interventions</span>
          </button>
        </div>

        {alert.status === 'Active' && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Acknowledge this alert"
          >
            <Check className="w-3.5 h-3.5 text-slate-400" />
            <span>Acknowledge</span>
          </button>
        )}
      </div>
    </div>
  );
};
