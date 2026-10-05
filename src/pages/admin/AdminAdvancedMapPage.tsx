import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  SensorItem,
  CityItem,
  NoiseSeverity
} from '../../types';
import { NoiseStatusBadge } from '../../components/common/NoiseStatusBadge';
import {
  Search,
  Filter,
  Layers,
  MapPin,
  Calendar,
  X,
  Battery,
  Wifi
} from 'lucide-react';

interface AdminAdvancedMapPageProps {
  sensors: SensorItem[];
  cities: CityItem[];
}

function RecenterMap({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.2 });
  }, [lat, lng, zoom, map]);
  return null;
}

function createAdminMarkerPin(severity: NoiseSeverity, db: number) {
  const colors = {
    Safe: '#10b981',
    Moderate: '#f59e0b',
    High: '#f97316',
    Critical: '#ef4444'
  }[severity];

  const html = `
    <div class="relative flex items-center justify-center">
      <div style="background-color: ${colors};" 
           class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shadow-lg">
        ${Math.round(db)}
      </div>
      <div class="absolute -bottom-1 w-2.5 h-2.5 rotate-45" style="background-color: ${colors};"></div>
    </div>
  `;

  return L.divIcon({
    className: 'admin-marker-pin',
    html,
    iconSize: [40, 40],
    iconAnchor: [20, 22]
  });
}

export const AdminAdvancedMapPage: React.FC<AdminAdvancedMapPageProps> = ({
  sensors,
  cities
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>(cities[0]?.id || 'city-delhi');
  const [severityFilter, setSeverityFilter] = useState<'All' | NoiseSeverity>('All');
  const [timeRange, setTimeRange] = useState<'Today' | '24h' | '7d' | '30d'>('Today');
  const [showRadiusCircles, setShowRadiusCircles] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState<SensorItem | null>(null);

  const currentCity = useMemo(() => {
    return cities.find((c) => c.id === selectedCityId) || cities[0];
  }, [cities, selectedCityId]);

  const displayedSensors = useMemo(() => {
    return sensors.filter((s) => {
      if (s.cityId !== currentCity.id) return false;
      const sev: NoiseSeverity =
        s.currentDb <= 65 ? 'Safe' : s.currentDb <= 75 ? 'Moderate' : s.currentDb <= 85 ? 'High' : 'Critical';
      if (severityFilter !== 'All' && sev !== severityFilter) return false;
      return true;
    });
  }, [sensors, currentCity.id, severityFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Map Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Authority GIS Console
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Advanced Environmental Noise Map
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* City Selector */}
            <select
              value={selectedCityId}
              onChange={(e) => {
                setSelectedCityId(e.target.value);
                setSelectedSensor(null);
              }}
              className="text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>

            {/* Time Window Filter (Requirement #22) */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              {(['Today', '24h', '7d', '30d'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    timeRange === t
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Sound Radius Toggle */}
            <button
              onClick={() => setShowRadiusCircles(!showRadiusCircles)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showRadiusCircles
                  ? 'bg-teal-50 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>Acoustic Contours</span>
            </button>
          </div>
        </div>

        {/* Severity Filter Strip */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Filter Severity:</span>
          {(['All', 'Safe', 'Moderate', 'High', 'Critical'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                severityFilter === s
                  ? 'bg-slate-900 dark:bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
          <span className="ml-auto font-mono text-[11px] text-slate-400">
            Plotting {displayedSensors.length} active stations
          </span>
        </div>
      </div>

      {/* Map View Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md h-[560px] bg-slate-100 dark:bg-slate-950">
        <MapContainer
          center={[currentCity.latitude, currentCity.longitude]}
          zoom={currentCity.defaultZoom}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap
            lat={currentCity.latitude}
            lng={currentCity.longitude}
            zoom={currentCity.defaultZoom}
          />

          {/* Sound propagation circles & Markers */}
          {displayedSensors.map((sensor) => {
            const sev: NoiseSeverity =
              sensor.currentDb <= 65 ? 'Safe' : sensor.currentDb <= 75 ? 'Moderate' : sensor.currentDb <= 85 ? 'High' : 'Critical';

            const circleColor = {
              Safe: '#10b981',
              Moderate: '#f59e0b',
              High: '#f97316',
              Critical: '#ef4444'
            }[sev];

            return (
              <React.Fragment key={sensor.id}>
                {showRadiusCircles && (
                  <Circle
                    center={[sensor.latitude, sensor.longitude]}
                    radius={sev === 'Critical' ? 600 : sev === 'High' ? 450 : 300}
                    pathOptions={{
                      color: circleColor,
                      fillColor: circleColor,
                      fillOpacity: 0.18,
                      weight: 1.5
                    }}
                  />
                )}

                <Marker
                  position={[sensor.latitude, sensor.longitude]}
                  icon={createAdminMarkerPin(sev, sensor.currentDb)}
                  eventHandlers={{
                    click: () => setSelectedSensor(sensor)
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                        <span>{sensor.id}</span>
                        <NoiseStatusBadge severity={sev} size="sm" showIcon={false} />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{sensor.name}</h4>
                      <div className="my-2 flex items-baseline gap-1">
                        <span className="text-xl font-mono font-black">{sensor.currentDb}</span>
                        <span className="text-xs text-slate-500">dB</span>
                      </div>
                      <div className="text-[10px] text-slate-500 space-y-0.5">
                        <div>Avg: {sensor.avgDb} dB • Peak: {sensor.peakDb} dB</div>
                        <div>Source: {sensor.noiseType}</div>
                      </div>
                      <button
                        onClick={() => setSelectedSensor(sensor)}
                        className="mt-2 w-full py-1 text-[11px] font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                      >
                        Technical Diagnostics
                      </button>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Selected Sensor Diagnostics Slide Drawer */}
        {selectedSensor && (
          <div className="absolute top-4 right-4 z-20 w-84 max-w-[calc(100%-2rem)] bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 animate-in slide-in-from-right-3 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                  {selectedSensor.id}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {selectedSensor.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSensor(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Real-time Leq</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {selectedSensor.currentDb}
                  </span>
                  <span className="text-xs text-slate-400">dB</span>
                </div>
              </div>
              <NoiseStatusBadge
                severity={
                  selectedSensor.currentDb <= 65 ? 'Safe' : selectedSensor.currentDb <= 75 ? 'Moderate' : selectedSensor.currentDb <= 85 ? 'High' : 'Critical'
                }
                size="sm"
              />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span className="text-slate-400">Sensor Battery:</span>
                <span className="font-mono font-bold text-emerald-600">{selectedSensor.battery}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Network Link:</span>
                <span className="font-semibold">{selectedSensor.connectivity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Calibration:</span>
                <span className="font-semibold">{selectedSensor.calibrationStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Source:</span>
                <span className="font-semibold truncate max-w-[150px]">{selectedSensor.noiseType}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
