import React from 'react';
import { LocationItem, NoiseReading, NoiseAlert, ProjectThresholds, DataSource } from '../types';
import { MetricCard } from '../components/common/MetricCard';
import { SimulationControls } from '../components/dashboard/SimulationControls';
import { LiveNoiseChart } from '../components/dashboard/LiveNoiseChart';
import { LocationQuickList } from '../components/dashboard/LocationQuickList';
import { AlertCard } from '../components/alerts/AlertCard';
import { PageId } from '../components/layout/Sidebar';
import { Activity, Clock, Flame, Bell, MapPin, Sparkles, Eye, ArrowRight } from 'lucide-react';

interface DashboardPageProps {
  locations: LocationItem[];
  readings: NoiseReading[];
  latestReadingsMap: Map<string, NoiseReading>;
  alerts: NoiseAlert[];
  thresholds: ProjectThresholds;
  dataMode: 'SIMULATION' | 'OBSERVED';
  kpis: {
    currentAvgDb: number;
    averageTodayDb: number;
    maxRecordedDb: number;
    maxRecordedLocation: string;
    highNoiseEventsCount: number;
    monitoredCount: number;
  };
  simulation: {
    isRunning: boolean;
    pauseSimulation: () => void;
    resumeSimulation: () => void;
    resetSimulation: () => void;
    stepOnce: () => void;
    secondsAgo: number;
    tickIntervalMs: number;
    setTickIntervalMs: (ms: number) => void;
  };
  setActivePage: (page: PageId) => void;
  onSelectLocationForMap: (loc: LocationItem) => void;
  onAcknowledgeAlert: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  locations,
  readings,
  latestReadingsMap,
  alerts,
  thresholds,
  dataMode,
  kpis,
  simulation,
  setActivePage,
  onSelectLocationForMap,
  onAcknowledgeAlert
}) => {
  const isSimulation = dataMode === 'SIMULATION';
  const currentSource: DataSource = isSimulation ? 'SIMULATED' : 'OBSERVED';

  return (
    <div className="space-y-6">
      {/* Top Banner: Mode Indicator & Simulation Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Data Mode:
            </span>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold ${
                isSimulation
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              }`}
            >
              {isSimulation ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Demo Simulation</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Observed Field Data</span>
                </>
              )}
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Illustrative prototype data</span>
            <span className="text-slate-300">•</span>
            <span className="text-teal-700 font-medium">EVS Academic Project</span>
          </div>
        </div>

        {/* Live Simulation Controls Bar (Shown if in simulation mode) */}
        {isSimulation && (
          <SimulationControls
            isRunning={simulation.isRunning}
            onPause={simulation.pauseSimulation}
            onResume={simulation.resumeSimulation}
            onReset={simulation.resetSimulation}
            onStepOnce={simulation.stepOnce}
            secondsAgo={simulation.secondsAgo}
            tickIntervalMs={simulation.tickIntervalMs}
            setTickIntervalMs={simulation.setTickIntervalMs}
          />
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title="Current Noise Level"
          subtitle="Spatial average"
          value={kpis.currentAvgDb}
          unit="dB"
          icon={<Activity className="w-5 h-5 text-teal-600" />}
          dataSource={currentSource}
          trendText={kpis.currentAvgDb > 70 ? 'Elevated ambient' : 'Normal range'}
          trendColor={kpis.currentAvgDb > 70 ? 'red' : 'green'}
          isSimulated={isSimulation}
        />

        <MetricCard
          title="Average Today"
          subtitle="Cumulative Leq"
          value={kpis.averageTodayDb}
          unit="dB"
          icon={<Clock className="w-5 h-5 text-blue-600" />}
          dataSource={currentSource}
          trendText="24h energy equivalent"
          trendColor="neutral"
          isSimulated={isSimulation}
        />

        <MetricCard
          title="Maximum Recorded"
          subtitle={kpis.maxRecordedLocation}
          value={kpis.maxRecordedDb}
          unit="dB"
          icon={<Flame className="w-5 h-5 text-rose-600" />}
          dataSource={currentSource}
          trendText="Peak Lmax transient"
          trendColor="red"
          isSimulated={isSimulation}
        />

        <MetricCard
          title="High Noise Events"
          subtitle={`> ${thresholds.moderateMax} dB threshold`}
          value={kpis.highNoiseEventsCount}
          icon={<Bell className="w-5 h-5 text-orange-600" />}
          dataSource={currentSource}
          trendText={kpis.highNoiseEventsCount > 10 ? 'Requires attention' : 'Controlled'}
          trendColor={kpis.highNoiseEventsCount > 10 ? 'red' : 'green'}
          isSimulated={isSimulation}
        />

        <MetricCard
          title="Monitored Locations"
          subtitle="Active sensor nodes"
          value={kpis.monitoredCount}
          icon={<MapPin className="w-5 h-5 text-teal-600" />}
          dataSource={currentSource}
          trendText="All nodes reporting"
          trendColor="green"
          isSimulated={isSimulation}
        />
      </div>

      {/* Live Trend Chart */}
      <LiveNoiseChart
        readings={readings}
        thresholds={thresholds}
      />

      {/* Location Quick List */}
      <LocationQuickList
        locations={locations}
        latestReadingsMap={latestReadingsMap}
        thresholds={thresholds}
        onSelectLocation={(loc) => {
          onSelectLocationForMap(loc);
          setActivePage('map');
        }}
        setActivePage={setActivePage}
      />

      {/* Recent Alerts Quick Drawer Preview */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Active Noise Exceedance Alerts
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live notifications triggered when noise exceeds configured project limits
            </p>
          </div>
          <button
            onClick={() => setActivePage('alerts')}
            className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <span>View All Alerts ({alerts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {alerts.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-500">
            No active threshold alerts detected. Ambient sound pressure levels are within acceptable project limits.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.slice(0, 4).map((alert, idx) => (
              <AlertCard
                key={`${alert.id}-${idx}`}
                alert={alert}
                onAcknowledge={onAcknowledgeAlert}
                onViewLocation={() => {
                  const loc = locations.find((l) => l.id === alert.locationId);
                  if (loc) onSelectLocationForMap(loc);
                  setActivePage('map');
                }}
                setActivePage={setActivePage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
