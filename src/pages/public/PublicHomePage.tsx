import React from 'react';
import {
  Mic,
  MapPin,
  FilePlus2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Activity,
  Volume2,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { PublicPageId } from '../../components/layout/PublicHeader';
import { CityItem, SensorItem, NoiseSeverity } from '../../types';
import { InfoButton } from '../../components/common/InfoButton';

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
  // Curated showcase cities (Requirement #16)
  const targetCityNames = ['Delhi', 'Mumbai', 'Chennai', 'Jalandhar'];
  const showcaseCities = targetCityNames
    .map((name) => cities.find((c) => c.name.toLowerCase() === name.toLowerCase()))
    .filter(Boolean) as CityItem[];

  // Fallback to first 4 cities if names not found
  const displayCities = showcaseCities.length >= 4 ? showcaseCities : cities.slice(0, 4);

  // Helper to determine severity dot and label
  const getSeverityInfo = (db: number): { label: NoiseSeverity; dot: string } => {
    if (db <= 65) return { label: 'Safe', dot: 'bg-emerald-500' };
    if (db <= 75) return { label: 'Moderate', dot: 'bg-amber-500' };
    if (db <= 85) return { label: 'High', dot: 'bg-orange-500' };
    return { label: 'Critical', dot: 'bg-rose-500' };
  };

  // Nearest / sample baseline estimate for hero
  const heroEstimateDb = selectedCity ? Math.round(selectedCity.baselineAvgDb) : 68;
  const heroSeverity = getSeverityInfo(heroEstimateDb);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-8 space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section (Requirement #15 & #35) */}
      <section className="text-center space-y-6 pt-2">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Know Your Noise.
          </h1>
          <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
            Measure. Understand. Report.
          </p>
        </div>

        {/* Hero Measurement Circle / Card */}
        <div className="py-2 flex flex-col items-center justify-center">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-amber-200 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col items-center justify-center shadow-inner relative transition-transform">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {heroEstimateDb}
              </span>
              <span className="text-lg font-bold text-slate-400">dB</span>
              <InfoButton
                title="What does this mean?"
                content={`${heroEstimateDb} dB means the ambient sound is currently moderately loud, typical of active daytime traffic or normal neighborhood activity.`}
                size="sm"
                className="absolute top-8 right-10"
              />
            </div>

            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 shadow-2xs border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
              <span className={`w-2 h-2 rounded-full ${heroSeverity.dot}`} />
              <span>{heroSeverity.label} Noise</span>
            </div>

            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <MapPin className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span>{selectedCity ? selectedCity.name : 'Near You'}</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div>
          <button
            onClick={() => setActivePage('monitor')}
            className="w-full sm:w-auto min-w-[240px] px-8 py-4 text-base font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-2xl shadow-lg shadow-teal-600/20 active:scale-98 transition-all inline-flex items-center justify-center gap-2"
          >
            <Mic className="w-5 h-5 fill-white" />
            <span>Start Monitoring</span>
          </button>
        </div>

        {/* Three Small Actions */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 pt-2">
          <button
            onClick={() => setActivePage('map')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-all flex items-center justify-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Map</span>
          </button>

          <button
            onClick={() => setActivePage('report')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-all flex items-center justify-center gap-1.5"
          >
            <FilePlus2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>Report</span>
          </button>

          <button
            onClick={() => setActivePage('learn')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-all flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Learn</span>
          </button>
        </div>
      </section>

      {/* 2. Noise Around You (Requirement #16) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Noise Around You
            </h2>
            <InfoButton
              title="City Noise Data"
              content="Readings represent ambient sound averages from city monitoring nodes and calibrated baseline telemetry."
              size="xs"
            />
          </div>

          <button
            onClick={() => setActivePage('map')}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>Explore Full Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {displayCities.map((city) => {
            const citySensors = sensors.filter((s) => s.cityId === city.id);
            const avgDb = citySensors.length > 0
              ? Math.round(citySensors.reduce((a, b) => a + b.currentDb, 0) / citySensors.length)
              : Math.round(city.baselineAvgDb);
            const severity = getSeverityInfo(avgDb);

            return (
              <div
                key={city.id}
                onClick={() => {
                  setSelectedCity(city);
                  setActivePage('map');
                }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    {city.name}
                  </h3>
                  <span className={`w-2 h-2 rounded-full ${severity.dot}`} />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {avgDb}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">dB</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {severity.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. How NoiseGuard Works (Requirement #16) */}
      <section className="space-y-4 pt-2">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white text-center sm:text-left">
          How NoiseGuard Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Measure
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Estimate real-time decibels using your browser microphone with zero data sent to external servers.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Understand
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Explore noise severity across residential, commercial, and healthcare silence corridors.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Report
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Flag excessive sound violations with optional photo or audio evidence in 60 seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why NoiseGuard? (Requirement #16) */}
      <section className="space-y-4 pt-2">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white text-center sm:text-left">
          Why NoiseGuard?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Privacy First
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Live microphone audio is processed locally in your browser. We never record or store conversations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Honest Data
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              We distinguish physical IoT sensors from device estimates, always transparent about data origins.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Civic Action
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering citizens and municipal officers to make neighborhoods quieter, healthier, and safer.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
