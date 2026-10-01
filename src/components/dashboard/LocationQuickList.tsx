import React from 'react';
import { LocationItem, NoiseReading, ProjectThresholds } from '../../types';
import { determineSeverity } from '../../services/alertEngine';
import { StatusBadge } from '../common/StatusBadge';
import { DataSourceBadge } from '../common/DataSourceBadge';
import { MapPin, ArrowRight, Activity } from 'lucide-react';
import { PageId } from '../layout/Sidebar';

interface LocationQuickListProps {
  locations: LocationItem[];
  latestReadingsMap: Map<string, NoiseReading>;
  thresholds: ProjectThresholds;
  onSelectLocation: (loc: LocationItem) => void;
  setActivePage: (page: PageId) => void;
}

export const LocationQuickList: React.FC<LocationQuickListProps> = ({
  locations,
  latestReadingsMap,
  thresholds,
  onSelectLocation,
  setActivePage
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Monitored Urban Points
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time acoustic state across monitored sectors
          </p>
        </div>
        <button
          onClick={() => setActivePage('map')}
          className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
        >
          <span>Open Full Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {locations.map((loc) => {
          const reading = latestReadingsMap.get(loc.id);
          const currentDb = reading ? reading.noiseLevelDb : loc.baselineDb;
          const severity = determineSeverity(currentDb, thresholds);
          const source = reading ? reading.dataSource : 'SIMULATED';

          return (
            <div
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              className="group p-3.5 rounded-xl border border-slate-200/70 hover:border-teal-300 hover:shadow-xs transition-all cursor-pointer bg-slate-50/50 hover:bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider line-clamp-1">
                    {loc.locationType}
                  </span>
                  <StatusBadge severity={severity} size="sm" />
                </div>

                <h4 className="font-semibold text-slate-900 text-sm line-clamp-1 group-hover:text-teal-700 transition-colors">
                  {loc.name}
                </h4>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="line-clamp-1">{loc.address}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Current Level
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-slate-900">
                      {currentDb}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      dB
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <DataSourceBadge source={source} size="sm" />
                  <span className="text-[10px] text-slate-400">
                    Base: {loc.baselineDb} dB
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
