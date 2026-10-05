import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Flame
} from 'lucide-react';
import { CityItem, SensorItem, CitizenReport, NoiseAlert } from '../../types';

interface AdminAnalyticsPageProps {
  cities: CityItem[];
  sensors: SensorItem[];
  reports: CitizenReport[];
  alerts: NoiseAlert[];
}

export const AdminAnalyticsPage: React.FC<AdminAnalyticsPageProps> = ({
  cities,
  sensors,
  reports,
  alerts
}) => {
  const [timeSpan, setTimeSpan] = useState<'24h' | '7d' | '30d'>('7d');

  // Overall system metrics
  const systemAvgDb = useMemo(() => {
    if (sensors.length === 0) return 68.0;
    const sum = sensors.reduce((acc, s) => acc + s.currentDb, 0);
    return Math.round((sum / sensors.length) * 10) / 10;
  }, [sensors]);

  const systemMaxDb = useMemo(() => {
    if (sensors.length === 0) return 85;
    return Math.max(...sensors.map((s) => s.peakDb));
  }, [sensors]);

  const violationsCount = useMemo(() => {
    return sensors.filter((s) => s.currentDb > 75).length;
  }, [sensors]);

  // City Comparison Stats (Requirement #24)
  const cityComparisonData = useMemo(() => {
    return cities.map((c) => {
      const citySensors = sensors.filter((s) => s.cityId === c.id);
      const avg = citySensors.length > 0
        ? Math.round((citySensors.reduce((acc, s) => acc + s.currentDb, 0) / citySensors.length) * 10) / 10
        : c.baselineAvgDb;
      const peak = citySensors.length > 0 ? Math.max(...citySensors.map((s) => s.peakDb)) : 80;
      const cityAlerts = alerts.filter((a) => a.cityName?.toLowerCase() === c.name.toLowerCase()).length;
      const cityReports = reports.filter((r) => r.city.toLowerCase() === c.name.toLowerCase()).length;

      return {
        id: c.id,
        name: c.name,
        state: c.state,
        avgDb: avg,
        peakDb: peak,
        alerts: cityAlerts,
        reports: cityReports,
        sensorsCount: citySensors.length
      };
    });
  }, [cities, sensors, alerts, reports]);

  // Diurnal Progression Data
  const diurnalData = [
    { period: 'Morning (06:00 - 12:00)', avg: 66.8, peak: 79.4, desc: 'School & office commute influx' },
    { period: 'Afternoon (12:00 - 18:00)', avg: 69.2, peak: 82.1, desc: 'Commercial transit & logistics' },
    { period: 'Evening (18:00 - 22:00)', avg: 76.5, peak: 89.8, desc: 'Peak traffic rush & markets' },
    { period: 'Night (22:00 - 06:00)', avg: 53.4, peak: 68.2, desc: 'Quiet background floor & freight' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Historical Analytics &amp; City Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Correlate longitudinal decibel trends, diurnal acoustic shifts, and inter-city environmental benchmarks.
          </p>
        </div>

        {/* Time Span Filter */}
        <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs text-xs font-semibold self-start sm:self-center">
          {(['24h', '7d', '30d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeSpan(t)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeSpan === t
                  ? 'bg-slate-900 dark:bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t === '24h' ? 'Last 24 Hours' : t === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Summary Metric Cards (Requirement #23) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">National Average Leq</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {systemAvgDb}
            </span>
            <span className="text-xs text-slate-400">dB</span>
          </div>
          <span className="text-[11px] text-teal-600 font-semibold block mt-1">
            Across 10 Monitored Metros
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Maximum Recorded Peak</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-rose-600">
              {systemMaxDb}
            </span>
            <span className="text-xs text-slate-400">dB</span>
          </div>
          <span className="text-[11px] text-rose-500 font-semibold block mt-1">
            Anand Vihar Flyover (Delhi)
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Threshold Breaches</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-orange-600">
              {violationsCount}
            </span>
            <span className="text-xs text-slate-400">nodes</span>
          </div>
          <span className="text-[11px] text-orange-500 font-semibold block mt-1">
            &gt; 75 dB Moderate Limit
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Peak Environmental Window</span>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
            6:00 PM – 9:30 PM
          </div>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            Diurnal Rush Hour
          </span>
        </div>
      </div>

      {/* Diurnal Time-of-Day Progression */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Diurnal Noise Distribution (Time-of-Day Progression)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Equivalent continuous sound levels categorized by circadian activity periods.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {diurnalData.map((d, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-2"
            >
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {d.period}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {d.avg} dB
                </span>
                <span className="text-[11px] font-mono text-rose-500 font-bold">
                  Peak: {d.peak} dB
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* City Comparison Table & Benchmarks (Requirement #24) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              City-to-City Environmental Benchmark
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparative acoustic indicators across covered Indian cities.
            </p>
          </div>
          <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-semibold">
            10 Metros Indexed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Average Leq</th>
                <th className="py-3 px-4">Peak Recorded</th>
                <th className="py-3 px-4">Active Alerts</th>
                <th className="py-3 px-4">Citizen Reports</th>
                <th className="py-3 px-4">Sensor Nodes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
              {cityComparisonData.map((city) => (
                <tr key={city.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {city.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{city.state}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    <span className={city.avgDb > 72 ? 'text-orange-600' : 'text-slate-900 dark:text-white'}>
                      {city.avgDb} dB
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {city.peakDb} dB
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className={city.alerts > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                      {city.alerts}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {city.reports}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                    {city.sensorsCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
