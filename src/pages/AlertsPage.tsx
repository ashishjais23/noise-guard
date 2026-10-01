import React, { useState, useMemo } from 'react';
import { NoiseAlert, LocationItem, ProjectThresholds } from '../types';
import { AlertCard } from '../components/alerts/AlertCard';
import { PageId } from '../components/layout/Sidebar';
import { Bell, SlidersHorizontal, Filter, ShieldCheck, CheckCheck } from 'lucide-react';

interface AlertsPageProps {
  alerts: NoiseAlert[];
  locations: LocationItem[];
  thresholds: ProjectThresholds;
  onOpenThresholdModal: () => void;
  onAcknowledgeAlert: (id: string) => void;
  onSelectLocationForMap: (loc: LocationItem) => void;
  setActivePage: (page: PageId) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  locations,
  thresholds,
  onOpenThresholdModal,
  onAcknowledgeAlert,
  onSelectLocationForMap,
  setActivePage
}) => {
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Moderate' | 'High' | 'Critical'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Acknowledged'>('All');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (severityFilter !== 'All' && a.severity !== severityFilter) return false;
      if (statusFilter !== 'All' && a.status !== statusFilter) return false;
      if (locationFilter !== 'all' && a.locationId !== locationFilter) return false;
      return true;
    });
  }, [alerts, severityFilter, statusFilter, locationFilter]);

  const activeCount = alerts.filter((a) => a.status === 'Active').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600 border border-teal-200">
              <Bell className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Smart Acoustic Alert Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated threshold surveillance classifying ambient acoustic excursions into Moderate, High, and Critical incidents
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenThresholdModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
            <span>Configure Thresholds</span>
          </button>
        </div>
      </div>

      {/* Threshold Explanation Notice Box */}
      <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-teal-800">
            Project Threshold Specification:
          </span>
          <p className="leading-relaxed text-teal-700">
            Threshold values used by this prototype (Safe: &le; {thresholds.safeMax} dB, Moderate: &le; {thresholds.moderateMax} dB, High: &le; {thresholds.highMax} dB, Critical: &gt; {thresholds.highMax} dB) are configurable demonstration limits and should be aligned with applicable local municipal regulations or research standards before physical field deployment.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Filter className="w-4 h-4 text-teal-600" />
          <span>Filter Incidents:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Severity */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Only</option>
            <option value="Moderate">Moderate Only</option>
          </select>

          {/* Incident State */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active ({activeCount})</option>
            <option value="Acknowledged">Acknowledged</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts Grid */}
      {filteredAlerts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
          <CheckCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">
            No matching acoustic alerts
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            All recorded readings conform to the current filter criteria or are within safe project thresholds.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlerts.map((alert, idx) => (
            <AlertCard
              key={`${alert.id}-${idx}`}
              alert={alert}
              onAcknowledge={onAcknowledgeAlert}
              onViewLocation={(locId) => {
                const loc = locations.find((l) => l.id === locId);
                if (loc) onSelectLocationForMap(loc);
                setActivePage('map');
              }}
              setActivePage={setActivePage}
            />
          ))}
        </div>
      )}
    </div>
  );
};
