import React from 'react';
import {
  Volume2,
  Activity,
  MapPin,
  BarChart2,
  Bell,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Database,
  ArrowDown
} from 'lucide-react';
import { PageId } from '../components/layout/Sidebar';
import { LocationItem, NoiseReading, ProjectThresholds } from '../types';
import { determineSeverity } from '../services/alertEngine';
import { StatusBadge } from '../components/common/StatusBadge';

interface HomePageProps {
  setActivePage: (page: PageId) => void;
  locations: LocationItem[];
  latestReadingsMap: Map<string, NoiseReading>;
  thresholds: ProjectThresholds;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActivePage,
  locations,
  latestReadingsMap,
  thresholds
}) => {
  return (
    <div className="space-y-12 sm:space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/50 via-white to-slate-50/50 rounded-3xl border border-teal-100/80 p-6 sm:p-10 lg:p-14 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/60 border border-teal-200 text-teal-900 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>EVS Smart City Prototype (Environmental Studies)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Making Cities Quieter, Healthier &amp; Smarter.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            NoiseWatch is a smart urban noise monitoring prototype that helps visualize noise levels, identify hotspots, analyze patterns, and support data-informed noise management.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActivePage('dashboard')}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('map')}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-all"
            >
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>View Noise Map</span>
            </button>
          </div>
        </div>

        {/* Live Mini City Monitoring Status Preview */}
        <div className="mt-10 pt-8 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Monitored Locations Preview
            </span>
            <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-semibold uppercase">
              Simulated Demo Mode
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {locations.slice(0, 4).map((loc) => {
              const r = latestReadingsMap.get(loc.id);
              const db = r ? r.noiseLevelDb : loc.baselineDb;
              const severity = determineSeverity(db, thresholds);

              return (
                <div
                  key={loc.id}
                  onClick={() => setActivePage('dashboard')}
                  className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider line-clamp-1">
                      {loc.locationType}
                    </span>
                    <StatusBadge severity={severity} size="sm" showIcon={false} />
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {loc.name}
                  </h4>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-lg font-bold font-mono text-slate-900">
                      {db}
                    </span>
                    <span className="text-xs font-medium text-slate-400">dB</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Transparency Notice Banner */}
        <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold">Academic Transparency Notice:</strong> Demo mode uses simulated stochastic data. Real-world municipal deployment would require calibrated Class-1/Class-2 noise-monitoring hardware compliant with IEC 61672 standards.
          </p>
        </div>
      </section>

      {/* WHAT IT DOES Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            SYSTEM CAPABILITIES
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            What NoiseWatch Does
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            An end-to-end framework integrating telemetry, spatial analytics, threshold alerting, and rule-based mitigation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              title: 'Monitor',
              desc: 'Tracks equivalent continuous decibels (Leq) continuously across diverse urban zones.',
              icon: <Activity className="w-5 h-5 text-teal-600" />,
              action: () => setActivePage('dashboard')
            },
            {
              title: 'Analyze',
              desc: 'Dissects diurnal noise variations, morning/evening peaks, and zone-to-zone disparities.',
              icon: <BarChart2 className="w-5 h-5 text-blue-600" />,
              action: () => setActivePage('analytics')
            },
            {
              title: 'Visualize',
              desc: 'Renders geospatial status pins and heat indicators on OpenStreetMap tiles.',
              icon: <MapPin className="w-5 h-5 text-emerald-600" />,
              action: () => setActivePage('map')
            },
            {
              title: 'Alert',
              desc: 'Detects threshold violations in real-time, categorizing severity from Safe to Critical.',
              icon: <Bell className="w-5 h-5 text-orange-600" />,
              action: () => setActivePage('alerts')
            },
            {
              title: 'Recommend',
              desc: 'Formulates rule-based situational interventions for civil engineers and city planners.',
              icon: <Lightbulb className="w-5 h-5 text-amber-600" />,
              action: () => setActivePage('recommendations')
            }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={item.action}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-teal-600">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS Pipeline */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            ARCHITECTURE PIPELINE
          </h2>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            How The System Operates
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            From acoustic data ingestion to contextual policy interventions
          </p>
        </div>

        {/* Pipeline Flowchart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
          {[
            { step: '01', title: 'Noise Data', sub: 'Observed or Simulated inputs' },
            { step: '02', title: 'Data Processing', sub: 'Validation & normalization' },
            { step: '03', title: 'Noise Analysis', sub: 'Leq integration & statistics' },
            { step: '04', title: 'Dashboard & Map', sub: 'Spatial & temporal visualization' },
            { step: '05', title: 'Alerts', sub: 'Threshold evaluation' },
            { step: '06', title: 'Recommendations', sub: 'Rule-based interventions' }
          ].map((node, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center relative flex flex-col justify-center min-h-[90px]"
            >
              <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full inline-block mx-auto mb-1">
                {node.step}
              </span>
              <h5 className="text-xs font-bold text-slate-800">{node.title}</h5>
              <p className="text-[10px] text-slate-500 mt-0.5">{node.sub}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={() => setActivePage('methodology')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl transition-colors border border-teal-200/60"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Read Complete Scientific Methodology</span>
          </button>
        </div>
      </section>
    </div>
  );
};
