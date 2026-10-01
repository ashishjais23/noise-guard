import React, { useMemo } from 'react';
import { LocationItem, NoiseReading, ProjectThresholds } from '../../types';
import { Sparkles, Info, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DynamicInsightsProps {
  locations: LocationItem[];
  readings: NoiseReading[];
  thresholds: ProjectThresholds;
  dataMode: 'SIMULATION' | 'OBSERVED';
}

export const DynamicInsights: React.FC<DynamicInsightsProps> = ({
  locations,
  readings,
  thresholds,
  dataMode
}) => {
  const insights = useMemo(() => {
    if (readings.length === 0) return [];

    const isSim = dataMode === 'SIMULATION';
    const prefix = isSim
      ? 'Based on the current simulated demonstration dataset, '
      : 'Based on the uploaded observed field measurements, ';

    const result: { title: string; text: string; icon: React.ReactNode; tag: string }[] = [];

    // 1. Peak Time Period Analysis
    const hourlyCounts: Record<number, number> = {};
    readings.forEach((r) => {
      const h = new Date(r.timestamp).getHours();
      if (r.noiseLevelDb > thresholds.moderateMax) {
        hourlyCounts[h] = (hourlyCounts[h] || 0) + 1;
      }
    });

    let peakHour = 18;
    let maxHighEvents = 0;
    Object.entries(hourlyCounts).forEach(([h, count]) => {
      if (count > maxHighEvents) {
        maxHighEvents = count;
        peakHour = parseInt(h, 10);
      }
    });

    const peakPeriodName =
      peakHour >= 6 && peakHour < 12
        ? 'morning interval (08:00 - 11:30)'
        : peakHour >= 12 && peakHour < 17
        ? 'afternoon interval (12:00 - 15:30)'
        : peakHour >= 17 && peakHour < 22
        ? 'evening commute interval (17:30 - 20:30)'
        : 'nighttime interval (22:00 - 06:00)';

    result.push({
      title: 'Diurnal Concentration Pattern',
      text: `${prefix}elevated sound levels most frequently occur during the ${peakPeriodName}, mirroring urban mobility and traffic congestion peaks.`,
      icon: <TrendingUp className="w-4 h-4 text-teal-600" />,
      tag: isSim ? 'Simulated Observation' : 'Observed Observation'
    });

    // 2. Highest Noise Location Analysis
    const locAverages = locations.map((loc) => {
      const locReadings = readings.filter((r) => r.locationId === loc.id);
      const avg = locReadings.length > 0
        ? locReadings.reduce((sum, r) => sum + r.noiseLevelDb, 0) / locReadings.length
        : loc.baselineDb;
      return { loc, avg };
    });

    locAverages.sort((a, b) => b.avg - a.avg);
    const topHotspot = locAverages[0];

    if (topHotspot) {
      result.push({
        title: 'Primary Acoustic Hotspot',
        text: `${prefix}the highest average equivalent sound levels are concentrated around "${topHotspot.loc.name}" (${Math.round(topHotspot.avg * 10) / 10} dB average), primarily driven by ${topHotspot.loc.locationType.toLowerCase()} acoustic characteristics.`,
        icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
        tag: 'Spatial Correlation'
      });
    }

    // 3. Sensitive / Quiet Zone Compliance
    const silenceLoc = locations.find((l) => l.locationType === 'Silence / Healthcare' || l.locationType === 'Residential');
    if (silenceLoc) {
      const sReadings = readings.filter((r) => r.locationId === silenceLoc.id);
      const violations = sReadings.filter((r) => r.noiseLevelDb > 55).length;
      result.push({
        title: 'Sensitive Zone Status',
        text: `${prefix}the ${silenceLoc.name} registered ${violations} threshold exceedance event(s) above standard peaceful baseline levels, indicating potential need for localized acoustic buffer interventions.`,
        icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
        tag: 'Compliance Note'
      });
    }

    return result;
  }, [locations, readings, thresholds, dataMode]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Automated Research Insights
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamically synthesized observations based on active data patterns
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Non-Scientific Demonstration</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((ins, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-white border border-slate-200/80">
                    {ins.icon}
                  </div>
                  <h4 className="font-semibold text-slate-900 text-xs">{ins.title}</h4>
                </div>
                <span className="text-[10px] font-medium text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {ins.tag}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                {ins.text}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/50 text-[10px] text-slate-400 italic">
              Demonstration heuristic — not peer-reviewed scientific deduction.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
