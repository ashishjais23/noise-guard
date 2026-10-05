import React from 'react';
import {
  Mic,
  MapPin,
  FilePlus2,
  Volume2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Info,
  Activity,
  CheckCircle2,
  Radio,
  Search
} from 'lucide-react';
import { PublicPageId } from '../../components/layout/PublicHeader';
import { CityItem, SensorItem, NoiseSeverity } from '../../types';
import { NoiseStatusBadge } from '../../components/common/NoiseStatusBadge';

interface PublicHomePageProps {
  setActivePage: (page: PublicPageId) => void;
  cities: CityItem[];
  sensors: SensorItem[];
  selectedCity: CityItem;
  setSelectedCity: (city: CityItem) => void;
}

export const PublicHomePage: React.FC<PublicHomePageProps> = ({
  setActivePage,
  cities,
  sensors,
  selectedCity,
  setSelectedCity
}) => {
  // Get sensors for the currently selected city
  const citySensors = sensors.filter((s) => s.cityId === selectedCity.id);
  const cityAvgDb = citySensors.length > 0
    ? Math.round((citySensors.reduce((acc, s) => acc + s.currentDb, 0) / citySensors.length) * 10) / 10
    : selectedCity.baselineAvgDb;

  const citySeverity: NoiseSeverity =
    cityAvgDb <= 65 ? 'Safe' : cityAvgDb <= 75 ? 'Moderate' : cityAvgDb <= 85 ? 'High' : 'Critical';

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Section: "Know Your Noise." */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-teal-50/70 via-white to-slate-50 dark:from-slate-800/60 dark:via-slate-900 dark:to-slate-900 border border-teal-100/80 dark:border-slate-800 p-6 sm:p-10 lg:p-14 shadow-xs transition-colors">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-300 text-xs font-semibold mb-6">
            <Radio className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
            <span>Civic Environmental Acoustic Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Know Your Noise.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
            Monitor noise levels around you, explore noisy areas in your city, and report excessive acoustic pollution in your community.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActivePage('monitor')}
              className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-xl shadow-md shadow-teal-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <Mic className="w-4 h-4" />
              <span>Start Monitoring</span>
            </button>

            <button
              onClick={() => setActivePage('map')}
              className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs transition-all"
            >
              <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Explore Noise Map</span>
            </button>

            <button
              onClick={() => setActivePage('report')}
              className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs transition-all"
            >
              <FilePlus2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>Report Noise</span>
            </button>
          </div>
        </div>

        {/* Live City Snapshot Banner */}
        <div className="mt-10 pt-8 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                City Noise Snapshot:
              </span>
              <select
                value={selectedCity.id}
                onChange={(e) => {
                  const found = cities.find((c) => c.id === e.target.value);
                  if (found) setSelectedCity(found);
                }}
                className="text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">City Status:</span>
              <NoiseStatusBadge severity={citySeverity} size="sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block">
                Current Average
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {cityAvgDb}
                </span>
                <span className="text-xs font-medium text-slate-500">dB</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block">
                Monitoring Points
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {citySensors.length}
                </span>
                <span className="text-xs font-medium text-slate-500">sensors</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block">
                Most Noisy Area
              </span>
              <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white truncate">
                {citySensors.length > 0
                  ? [...citySensors].sort((a, b) => b.currentDb - a.currentDb)[0].name
                  : 'Transit Corridor'}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block">
                Peak Noise Window
              </span>
              <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                6:00 PM – 9:30 PM
              </div>
            </div>
          </div>
        </div>

        {/* Device Measurement vs Sensor Transparency Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Measurement Transparency:</strong> Live monitoring uses your smartphone or computer microphone to calculate an <em>estimated decibel level</em>. For calibrated environmental enforcement, city telemetry is cross-referenced with CPCB-standard acoustic monitoring stations.
          </p>
        </div>
      </section>

      {/* 2. Three Simple Questions for Citizens */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
            HOW NOISEGUARD HELPS YOU
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Three Simple Answers
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Engineered to answer the most important acoustic questions in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Question 1 */}
          <div
            onClick={() => setActivePage('monitor')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Question 1
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">
                "How noisy is it here right now?"
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Use your device's microphone to instantly estimate the decibel level in your room, office, or outdoor street with immediate plain-language health context.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
              <span>Start Live Measurement</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Question 2 */}
          <div
            onClick={() => setActivePage('map')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Question 2
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">
                "Where are the noisy areas?"
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Explore an interactive map of Indian cities to locate traffic hotspots, construction zones, calm residential colonies, and hospital silence corridors.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Explore Interactive Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Question 3 */}
          <div
            onClick={() => setActivePage('report')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
                <FilePlus2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Question 3
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">
                "What can I do about excessive noise?"
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Submit a citizen acoustic report in under 60 seconds with photos or audio evidence. Receive an official Report ID and track municipal investigation progress.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
              <span>Report a Noise Problem</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Decibel Scale Guide for Everyday Citizens */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl">
          <h2 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
            UNDERSTANDING DECIBELS
          </h2>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Noise Scale Guide
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Decibels (dB) measure sound intensity on a logarithmic scale. An increase of 10 dB sounds twice as loud to human ears.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">🟢 SAFE</span>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">&lt; 65 dB</span>
            </div>
            <p className="text-xs text-emerald-900 dark:text-emerald-200 font-semibold mt-2">
              Whisper, Library &amp; Living Room
            </p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1 leading-relaxed">
              Normal conversation level. Completely comfortable for continuous work and peaceful sleep.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">🟡 MODERATE</span>
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300">65 – 75 dB</span>
            </div>
            <p className="text-xs text-amber-900 dark:text-amber-200 font-semibold mt-2">
              Busy Market &amp; Normal Street Traffic
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
              Audible background noise. May reduce sleep quality if sustained through night hours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-800 dark:text-orange-300">🟠 HIGH NOISE</span>
              <span className="text-xs font-mono font-bold text-orange-700 dark:text-orange-300">75 – 85 dB</span>
            </div>
            <p className="text-xs text-orange-900 dark:text-orange-200 font-semibold mt-2">
              Heavy Highway Traffic &amp; Buses
            </p>
            <p className="text-[11px] text-orange-700 dark:text-orange-300 mt-1 leading-relaxed">
              Loud. Requires shouting to be heard. Associated with heightened stress and sleep disturbance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300">🔴 CRITICAL</span>
              <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-300">&gt; 85 dB</span>
            </div>
            <p className="text-xs text-rose-900 dark:text-rose-200 font-semibold mt-2">
              Jackhammer, Air Horns &amp; Generators
            </p>
            <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
              Potentially harmful. Sustained exposure can cause auditory fatigue and permanent hearing risk.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Supported Indian Cities Row */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Covered Indian Metropolitan Cities
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any city to view sensor coverage and active acoustic readings
            </p>
          </div>
          <button
            onClick={() => setActivePage('map')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 self-start sm:self-center"
          >
            <span>Open All Cities on Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {cities.slice(0, 10).map((c) => {
            const count = sensors.filter((s) => s.cityId === c.id).length;
            const isSelected = selectedCity.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedCity(c);
                  setActivePage('map');
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-700 shadow-xs'
                    : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 hover:border-teal-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {c.name}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">{c.baselineAvgDb} dB</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                  {c.state}
                </span>
                <span className="mt-2 inline-block text-[10px] font-semibold text-teal-700 dark:text-teal-300">
                  {count} sensor points
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
