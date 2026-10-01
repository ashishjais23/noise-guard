import React, { useState, useMemo } from 'react';
import { LocationItem, NoiseReading, ProjectThresholds, DataSource } from '../types';
import { TimeOfDayChart } from '../components/analytics/TimeOfDayChart';
import { LocationComparisonChart } from '../components/analytics/LocationComparisonChart';
import { DailyTrendChart } from '../components/analytics/DailyTrendChart';
import { DynamicInsights } from '../components/analytics/DynamicInsights';
import { BarChart3, Filter, RotateCcw, Sparkles } from 'lucide-react';

interface AnalyticsPageProps {
  locations: LocationItem[];
  readings: NoiseReading[];
  thresholds: ProjectThresholds;
  dataMode: 'SIMULATION' | 'OBSERVED';
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  locations,
  readings,
  thresholds,
  dataMode
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | 'all'>('24h');

  // Filtered dataset for analytics
  const filteredReadings = useMemo(() => {
    return readings.filter((r) => {
      if (selectedLocation !== 'all' && r.locationId !== selectedLocation) {
        return false;
      }
      if (selectedSource !== 'all' && r.dataSource !== selectedSource) {
        return false;
      }
      return true;
    });
  }, [readings, selectedLocation, selectedSource]);

  const resetFilters = () => {
    setSelectedLocation('all');
    setSelectedSource('all');
    setSelectedTimeRange('24h');
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600 border border-teal-200">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Acoustic Analytics &amp; Research Patterns
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empirical investigation into diurnal distributions, zone-level disparity, and peak exceedance frequencies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            {filteredReadings.length} Samples Analyzed
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Filter className="w-4 h-4 text-teal-600" />
          <span>Analytics Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Location Select */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          >
            <option value="all">All Locations ({locations.length})</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>

          {/* Data Source Select */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          >
            <option value="all">All Data Sources</option>
            <option value="SIMULATED">Simulated Data Only</option>
            <option value="OBSERVED">Observed Data Only</option>
            <option value="RESEARCH DATA">Research Data Only</option>
          </select>

          {/* Time Range Select */}
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          >
            <option value="24h">Past 24 Hours</option>
            <option value="7d">Past 7 Days</option>
            <option value="all">Full Dataset</option>
          </select>

          {(selectedLocation !== 'all' || selectedSource !== 'all' || selectedTimeRange !== '24h') && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Academic Insights Section */}
      <DynamicInsights
        locations={locations}
        readings={filteredReadings}
        thresholds={thresholds}
        dataMode={dataMode}
      />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart A: Noise by Time of Day */}
        <TimeOfDayChart readings={filteredReadings} />

        {/* Chart B: Noise by Location Comparison */}
        <LocationComparisonChart
          locations={
            selectedLocation === 'all'
              ? locations
              : locations.filter((l) => l.id === selectedLocation)
          }
          readings={filteredReadings}
        />

        {/* Chart C: 24-Hour Diurnal Progression */}
        <div className="lg:col-span-2">
          <DailyTrendChart readings={filteredReadings} />
        </div>
      </div>
    </div>
  );
};
