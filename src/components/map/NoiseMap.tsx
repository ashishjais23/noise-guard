import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocationItem, NoiseReading, ProjectThresholds, NoiseSeverity } from '../../types';
import { determineSeverity } from '../../services/alertEngine';
import { MapLegend } from './MapLegend';
import { LocationDetailDrawer } from './LocationDetailDrawer';
import { StatusBadge } from '../common/StatusBadge';
import { DataSourceBadge } from '../common/DataSourceBadge';
import { Filter, Search, RotateCcw, Volume2 } from 'lucide-react';
import { PageId } from '../layout/Sidebar';

interface NoiseMapProps {
  locations: LocationItem[];
  latestReadingsMap: Map<string, NoiseReading>;
  allReadings: NoiseReading[];
  thresholds: ProjectThresholds;
  setActivePage: (page: PageId) => void;
  selectedLocationId?: string | null;
  onClearSelectedLocation?: () => void;
}

// Helper to center the map when a specific location is targeted
function MapRecenter({ lat, lng, zoom }: { lat: number; lng: number; zoom?: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView([lat, lng], zoom || 14, { animate: true });
  }, [lat, lng, zoom, map]);
  return null;
}

// Generate dynamic SVG divIcon for each status
function createCustomPin(severity: NoiseSeverity, db: number) {
  const colors = {
    Safe: { bg: '#10b981', border: '#059669', ping: false },
    Moderate: { bg: '#f59e0b', border: '#d97706', ping: false },
    High: { bg: '#f97316', border: '#ea580c', ping: true },
    Critical: { bg: '#ef4444', border: '#dc2626', ping: true }
  }[severity];

  const html = `
    <div class="relative flex items-center justify-center custom-noise-pin">
      ${
        colors.ping
          ? `<span class="absolute w-10 h-10 rounded-full ping-animation" style="background-color: ${colors.bg}; opacity: 0.35;"></span>`
          : ''
      }
      <div style="background-color: ${colors.bg}; border-color: ${colors.border};" 
           class="relative z-10 w-9 h-9 rounded-full border-2 text-white font-bold font-mono text-[11px] flex items-center justify-center shadow-md">
        ${Math.round(db)}
      </div>
      <div class="absolute -bottom-1 w-2 h-2 rotate-45" style="background-color: ${colors.border};"></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 20]
  });
}

export const NoiseMap: React.FC<NoiseMapProps> = ({
  locations,
  latestReadingsMap,
  allReadings,
  thresholds,
  setActivePage,
  selectedLocationId,
  onClearSelectedLocation
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | NoiseSeverity>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLocation, setActiveLocation] = useState<LocationItem | null>(null);

  // Initialize selected location if passed via props
  React.useEffect(() => {
    if (selectedLocationId) {
      const loc = locations.find((l) => l.id === selectedLocationId);
      if (loc) {
        setActiveLocation(loc);
      }
    }
  }, [selectedLocationId, locations]);

  // Center coordinate of our monitoring region (Bangalore Urban Central Cluster)
  const defaultCenter: [number, number] = [12.973, 77.598];

  // Filtered locations
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const reading = latestReadingsMap.get(loc.id);
      const currentDb = reading ? reading.noiseLevelDb : loc.baselineDb;
      const severity = determineSeverity(currentDb, thresholds);

      if (statusFilter !== 'All' && severity !== statusFilter) {
        return false;
      }
      if (
        searchTerm &&
        !loc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !loc.locationType.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [locations, latestReadingsMap, thresholds, statusFilter, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search location or zone type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        {/* Severity Filter Buttons */}
        <div className="flex items-center flex-wrap gap-1 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mr-1 hidden sm:inline">
            Status:
          </span>
          {(['All', 'Safe', 'Moderate', 'High', 'Critical'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === s
                  ? 'bg-teal-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}

          {(statusFilter !== 'All' || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setSearchTerm('');
                if (onClearSelectedLocation) onClearSelectedLocation();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              title="Reset filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[580px] sm:h-[640px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs bg-slate-100">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          {/* Free OpenStreetMap tiles without any API keys */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Smooth recenter if active location is selected */}
          {activeLocation && (
            <MapRecenter
              lat={activeLocation.latitude}
              lng={activeLocation.longitude}
              zoom={15}
            />
          )}

          {/* Render Location Markers */}
          {filteredLocations.map((loc) => {
            const reading = latestReadingsMap.get(loc.id);
            const currentDb = reading ? reading.noiseLevelDb : loc.baselineDb;
            const severity = determineSeverity(currentDb, thresholds);
            const icon = createCustomPin(severity, currentDb);

            return (
              <Marker
                key={loc.id}
                position={[loc.latitude, loc.longitude]}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    setActiveLocation(loc);
                  }
                }}
              >
                <Popup>
                  <div className="p-1 text-slate-800">
                    <h4 className="font-bold text-xs">{loc.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{loc.locationType}</p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-base font-bold font-mono text-slate-900">
                        {currentDb}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">dB</span>
                      <span className="ml-2">
                        <StatusBadge severity={severity} size="sm" />
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend (Bottom-Left) */}
        <div className="absolute bottom-4 left-4 z-500 max-w-xs">
          <MapLegend thresholds={thresholds} />
        </div>

        {/* Active Marker Detail Drawer (Slide-over) */}
        {activeLocation && (
          <LocationDetailDrawer
            location={activeLocation}
            latestReading={latestReadingsMap.get(activeLocation.id)}
            allReadings={allReadings}
            thresholds={thresholds}
            onClose={() => {
              setActiveLocation(null);
              if (onClearSelectedLocation) onClearSelectedLocation();
            }}
            setActivePage={setActivePage}
          />
        )}
      </div>
    </div>
  );
};
