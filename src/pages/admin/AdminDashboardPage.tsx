import React from 'react';
import {
  Cpu,
  MapPin,
  Bell,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Flame,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2
} from 'lucide-react';
import {
  SensorItem,
  CitizenReport,
  NoiseAlert,
  CityItem,
  NoiseSeverity,
  AdminUser
} from '../../types';
import { NoiseStatusBadge } from '../../components/common/NoiseStatusBadge';
import { AdminPageId } from '../../components/admin/AdminLayout';

interface AdminDashboardPageProps {
  sensors: SensorItem[];
  reports: CitizenReport[];
  alerts: NoiseAlert[];
  cities: CityItem[];
  adminUser?: AdminUser | null;
  setActiveAdminPage: (page: AdminPageId) => void;
  onAcknowledgeAlert: (alertId: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  sensors,
  reports,
  alerts,
  cities,
  adminUser,
  setActiveAdminPage,
  onAcknowledgeAlert
}) => {
  const activeSensors = sensors.filter((s) => s.status === 'ONLINE').length;
  const activeAlerts = alerts.filter((a) => a.status === 'Active');
  const pendingReports = reports.filter(
    (r) => r.status === 'Submitted' || r.status === 'Under Review'
  );
  const criticalSensors = sensors.filter((s) => s.currentDb > 85);
  const highSensors = sensors.filter((s) => s.currentDb > 75 && s.currentDb <= 85);

  const role = adminUser?.role || 'Super Admin';

  const roleHeader = {
    'Super Admin': {
      title: 'Executive Telemetry & Municipal Authority Dashboard',
      subtitle: 'Complete system administration, hardware sensor fleet oversight, and statutory controls.'
    },
    'Environmental Officer': {
      title: 'Field Enforcement & Acoustic Violation Triage',
      subtitle: 'Active incident response, complaint verification, and municipal noise enforcement operations.'
    },
    'Acoustic Researcher': {
      title: 'Acoustic Research & Environmental Science Console',
      subtitle: 'Sound pressure distributions, continuous equivalent level (Leq) analytics, and exportable datasets.'
    }
  }[role] || {
    title: 'Executive Telemetry Dashboard',
    subtitle: 'Real-time municipal acoustic monitoring network and alert tracking.'
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            role === 'Super Admin'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300'
              : role === 'Environmental Officer'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
          }`}>
            {role} Portal
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {roleHeader.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {roleHeader.subtitle}
        </p>
      </div>

      {/* Top 7 KPI Cards (Requirement #20) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Active Sensors</span>
            <Cpu className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {activeSensors}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {sensors.length}</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
            100% Online
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Cities</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white">
            {cities.filter((c) => c.enabled).length}
          </div>
          <span className="text-[10px] text-slate-400 font-medium block mt-1">
            Indian Metros
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Active Alerts</span>
            <Bell className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            {activeAlerts.length}
          </div>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block mt-1">
            Threshold breaches
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Reports Today</span>
            <FileSpreadsheet className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white">
            {reports.length}
          </div>
          <span className="text-[10px] text-slate-400 font-medium block mt-1">
            Citizen filings
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Pending</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {pendingReports.length}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold block mt-1">
            Awaiting triage
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Hotspot Zones</span>
            <Flame className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-orange-600 dark:text-orange-400">
            {criticalSensors.length + highSensors.length}
          </div>
          <span className="text-[10px] text-orange-600 font-semibold block mt-1">
            &gt; 75 dB Leq
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            99.8%
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
            Nominal mesh
          </span>
        </div>
      </div>

      {/* Live Noise Overview & Quick Telemetry Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Sensor Telemetry Feed (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Sensor Telemetry Feed
              </h3>
            </div>
            <button
              onClick={() => setActiveAdminPage('monitoring')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View All Sensors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="pb-2.5">Sensor ID</th>
                  <th className="pb-2.5">Location</th>
                  <th className="pb-2.5">City</th>
                  <th className="pb-2.5">Current dB</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5">Battery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                {sensors.slice(0, 6).map((s) => {
                  const severity: NoiseSeverity =
                    s.currentDb <= 65
                      ? 'Safe'
                      : s.currentDb <= 75
                      ? 'Moderate'
                      : s.currentDb <= 85
                      ? 'High'
                      : 'Critical';

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/60">
                      <td className="py-2.5 font-mono font-bold text-teal-700 dark:text-teal-400">
                        {s.id}
                      </td>
                      <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200 max-w-[160px] truncate">
                        {s.name}
                      </td>
                      <td className="py-2.5 text-slate-500">{s.cityName}</td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                            {s.currentDb}
                          </span>
                          <NoiseStatusBadge severity={severity} size="sm" showIcon={false} />
                        </div>
                      </td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{s.status}</span>
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-slate-500">{s.battery}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Active Alerts Triage */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Active Alerts ({activeAlerts.length})
                </h3>
              </div>
              <button
                onClick={() => setActiveAdminPage('alerts')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
              >
                Manage
              </button>
            </div>

            {activeAlerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p>All ambient noise levels are within nominal regulatory thresholds.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-rose-900 dark:text-rose-200 truncate">
                        {alert.locationName}
                      </span>
                      <span className="font-mono font-bold text-xs text-rose-700 dark:text-rose-300">
                        {alert.noiseLevelDb} dB
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Threshold: &gt;{alert.thresholdDb} dB ({alert.durationMinutes}m sustained)</span>
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="font-bold text-rose-700 dark:text-rose-300 hover:underline"
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Threshold engine: ISO 1996 Leq</span>
            <button
              onClick={() => setActiveAdminPage('alerts')}
              className="font-bold text-teal-600 dark:text-teal-400"
            >
              Configure Limits →
            </button>
          </div>
        </div>
      </div>

      {/* Citizen Reports Triage Queue */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Citizen Acoustic Reports
            </h3>
          </div>
          <button
            onClick={() => setActiveAdminPage('reports')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>Open Report Management</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {reports.slice(0, 4).map((r) => (
            <div
              key={r.id}
              onClick={() => setActiveAdminPage('reports')}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-2 hover:border-teal-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400">
                  {r.id}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {r.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {r.category} ({r.city})
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                "{r.description}"
              </p>
              <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800 flex justify-between text-[10px] text-slate-400">
                <span>{new Date(r.timestamp).toLocaleDateString()}</span>
                <span className="font-bold text-teal-600">Review →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
