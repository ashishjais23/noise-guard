import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { NoiseAlert, ProjectThresholds } from '../../types';
import { NoiseStatusBadge } from '../../components/common/NoiseStatusBadge';

interface AdminAlertsPageProps {
  alerts: NoiseAlert[];
  thresholds: ProjectThresholds;
  onAcknowledgeAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
  onUpdateThresholds: (thresholds: ProjectThresholds) => void;
  onResetThresholds: () => void;
}

export const AdminAlertsPage: React.FC<AdminAlertsPageProps> = ({
  alerts,
  thresholds,
  onAcknowledgeAlert,
  onResolveAlert,
  onUpdateThresholds,
  onResetThresholds
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Form states for thresholds configuration modal
  const [safeMax, setSafeMax] = useState(thresholds.safeMax);
  const [moderateMax, setModerateMax] = useState(thresholds.moderateMax);
  const [highMax, setHighMax] = useState(thresholds.highMax);
  const [durationTrigger, setDurationTrigger] = useState(thresholds.durationMinutesTrigger || 5);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      return true;
    });
  }, [alerts, filterSeverity, filterStatus]);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateThresholds({
      safeMax,
      moderateMax,
      highMax,
      durationMinutesTrigger: durationTrigger
    });
    setIsConfigModalOpen(false);
  };

  const handleResetToDefault = () => {
    onResetThresholds();
    setSafeMax(65);
    setModerateMax(75);
    setHighMax(85);
    setDurationTrigger(5);
    setIsConfigModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Threshold Config Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Threshold Alert Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Intelligent threshold surveillance detecting sustained acoustic excursions across sensor nodes.
          </p>
        </div>

        <button
          onClick={() => setIsConfigModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 rounded-xl shadow-xs transition-all self-start sm:self-center"
        >
          <SlidersHorizontal className="w-4 h-4 text-teal-400 dark:text-white" />
          <span>Configure Thresholds &amp; Timers</span>
        </button>
      </div>

      {/* Filter Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400 uppercase text-[11px]">Severity:</span>
          {(['all', 'High', 'Critical'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterSeverity === sev
                  ? 'bg-slate-900 dark:bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {sev === 'all' ? 'All Severities' : sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400 uppercase text-[11px]">Status:</span>
          {(['all', 'Active', 'Acknowledged', 'Resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-slate-900 dark:bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Sensor / Node</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Noise Level</th>
                <th className="py-3 px-4">Trigger Threshold</th>
                <th className="py-3 px-4">Sustained Duration</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No active threshold alerts match your filters.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                      {a.sensorId || 'Station'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {a.locationName}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-rose-600 text-sm">
                      {a.noiseLevelDb} dB
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      &gt; {a.thresholdDb} dB
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {a.durationMinutes} mins
                    </td>
                    <td className="py-3.5 px-4">
                      <NoiseStatusBadge severity={a.severity} size="sm" showIcon={false} />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        a.status === 'Active'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : a.status === 'Acknowledged'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {a.status === 'Active' && (
                          <button
                            onClick={() => onAcknowledgeAlert(a.id)}
                            className="px-2 py-1 text-[11px] font-bold text-amber-800 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-100 rounded-lg border border-amber-300"
                          >
                            Acknowledge
                          </button>
                        )}
                        {a.status !== 'Resolved' && (
                          <button
                            onClick={() => onResolveAlert(a.id)}
                            className="px-2 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 rounded-lg border border-emerald-300"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Thresholds & Duration Configuration Modal (Requirement #26 & #40) */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Configure Safety Thresholds
                </h3>
                <p className="text-xs text-slate-400">
                  Centralized acoustic triggers per CPCB &amp; WHO standards
                </p>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Safe Ceiling Limit (dB)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={safeMax}
                  onChange={(e) => setSafeMax(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">Default: 65.0 dB</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Moderate Ceiling Limit (dB)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={moderateMax}
                  onChange={(e) => setModerateMax(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">Default: 75.0 dB</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  High Ceiling Limit (Critical Threshold) (dB)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={highMax}
                  onChange={(e) => setHighMax(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">Default: 85.0 dB</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sustained Duration Trigger (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={durationTrigger}
                  onChange={(e) => setDurationTrigger(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">
                  Noise must remain above threshold for this duration to generate alert.
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Reset Defaults
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsConfigModalOpen(false)}
                    className="px-3 py-2 font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 rounded-xl shadow-xs"
                  >
                    Save Thresholds
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
