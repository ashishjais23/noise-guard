import React from 'react';
import { NoiseMap } from '../components/map/NoiseMap';
import { LocationItem, NoiseReading, ProjectThresholds } from '../types';
import { PageId } from '../components/layout/Sidebar';
import { MapPin, Info, Sparkles } from 'lucide-react';

interface NoiseMapPageProps {
  locations: LocationItem[];
  latestReadingsMap: Map<string, NoiseReading>;
  allReadings: NoiseReading[];
  thresholds: ProjectThresholds;
  setActivePage: (page: PageId) => void;
  selectedLocationId?: string | null;
  onClearSelectedLocation?: () => void;
}

export const NoiseMapPage: React.FC<NoiseMapPageProps> = ({
  locations,
  latestReadingsMap,
  allReadings,
  thresholds,
  setActivePage,
  selectedLocationId,
  onClearSelectedLocation
}) => {
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600 border border-teal-200">
              <MapPin className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Interactive Geospatial Noise Map
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time spatial visualization of urban acoustic monitoring points powered by OpenStreetMap
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-medium">
            <Sparkles className="w-3 h-3 text-purple-500" />
            <span>Demonstration Locations</span>
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-500 text-[11px] hidden sm:inline">
            Free Leaflet Tiles
          </span>
        </div>
      </div>

      {/* Main Map Component */}
      <NoiseMap
        locations={locations}
        latestReadingsMap={latestReadingsMap}
        allReadings={allReadings}
        thresholds={thresholds}
        setActivePage={setActivePage}
        selectedLocationId={selectedLocationId}
        onClearSelectedLocation={onClearSelectedLocation}
      />

      {/* Bottom Technical Note */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-slate-700">Geospatial Note:</strong> All coordinate points are demonstration positions configured for this academic prototype. Click any colored pin on the map to inspect live sound levels, diurnal peak time windows, and rule-based mitigation strategies.
        </p>
      </div>
    </div>
  );
};
