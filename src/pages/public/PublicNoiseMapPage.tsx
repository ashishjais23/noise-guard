import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import {
  CityItem,
  SensorItem,
  NoiseSeverity,
  NoiseAlert
} from '../../types';
import { NoiseStatusBadge } from '../../components/common/NoiseStatusBadge';
import {
  Search,
  MapPin,
  Compass,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  X,
  Volume2,
  Navigation
} from 'lucide-react';

interface PublicNoiseMapPageProps {
  cities: CityItem[];
  sensors: SensorItem[];
  alerts: NoiseAlert[];
  selectedCity: CityItem;
  setSelectedCity: (city: CityItem) => void;
}

// Map center transition helper
function RecenterMap({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.2 });
  }, [lat, lng, zoom, map]);
  return null;
}

// Generate dynamic SVG divIcon for public map
function createPublicPin(severity: NoiseSeverity, db: number) {
  const colors = {
    Safe: { bg: '#10b981', border: '#059669', ping: false },
    Moderate: { bg: '#f59e0b', border: '#d97706', ping: false },
    High: { bg: '#f97316', border: '#ea580c', ping: true },
    Critical: { bg: '#ef4444', border: '#dc2626', ping: true }
  }[severity];

  const html = `
    <div class="relative flex items-center justify-center custom-public-pin">
      ${
        colors.ping
          ? `<span class="absolute w-10 h-10 rounded-full ping-animation" style="background-color: ${colors.bg}; opacity: 0.4;"></span>`
          : ''
      }
      <div style="background-color: ${colors.bg}; border-color: ${colors.border};" 
           class="relative z-10 w-9 h-9 rounded-full border-2 text-white font-bold font-mono text-xs flex items-center justify-center shadow-lg">
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

export const PublicNoiseMapPage: React.FC<PublicNoiseMapPageProps> = ({
  cities,
  sensors,
  alerts,
  selectedCity,
  setSelectedCity
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'All' | NoiseSeverity>('All');
  const [selectedSensor, setSelectedSensor] = useState<SensorItem | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'granted' | 'denied'>('idle');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Filter sensors belonging to the selected city
  const citySensors = useMemo(() => {
    return sensors.filter((s) => s.cityId === selectedCity.id);
  }, [sensors, selectedCity.id]);

  // City-level metrics
  const cityAvgDb = useMemo(() => {
    if (citySensors.length === 0) return selectedCity.baselineAvgDb;
    const sum = citySensors.reduce((acc, s) => acc + s.currentDb, 0);
    return Math.round((sum / citySensors.length) * 10) / 10;
  }, [citySensors, selectedCity.baselineAvgDb]);

  const citySeverity: NoiseSeverity =
    cityAvgDb <= 65 ? 'Safe' : cityAvgDb <= 75 ? 'Moderate' : cityAvgDb <= 85 ? 'High' : 'Critical';

  const mostNoisySensor = useMemo(() => {
    if (citySensors.length === 0) return null;
    return [...citySensors].sort((a, b) => b.currentDb - a.currentDb)[0];
  }, [citySensors]);

  const cityAlertsCount = useMemo(() => {
    return alerts.filter(
      (a) => a.cityName?.toLowerCase() === selectedCity.name.toLowerCase() && a.status === 'Active'
    ).length;
  }, [alerts, selectedCity.name]);

  // Filtered displayed sensors
  const displayedSensors = useMemo(() => {
    return citySensors.filter((s) => {
      const severity: NoiseSeverity =
        s.currentDb <= 65 ? 'Safe' : s.currentDb <= 75 ? 'Moderate' : s.currentDb <= 85 ? 'High' : 'Critical';

      if (severityFilter !== 'All' && severity !== severityFilter) {
        return false;
      }
      if (
        searchTerm &&
        !s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !s.locationType.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [citySensors, severityFilter, searchTerm]);

  // Request browser GPS position
  const requestGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus('denied');
      return;
    }
    setGpsStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsStatus('granted');
      },
      () => {
        setGpsStatus('denied');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls: City Selector & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Interactive Acoustic Map
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              City Noise Map
            </h1>
          </div>

          {/* City Selector & GPS Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={selectedCity.id}
                onChange={(e) => {
                  const c = cities.find((item) => item.id === e.target.value);
                  if (c) {
                    setSelectedCity(c);
                    setSelectedSensor(null);
                  }
                }}
                className="appearance-none pl-3.5 pr-8 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Locate Me (GPS) */}
            <button
              onClick={requestGps}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                gpsStatus === 'granted'
                  ? 'bg-teal-50 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
              title="Locate me via device GPS"
            >
              <Navigation className="w-3.5 h-3.5 text-teal-600" />
              <span>{gpsStatus === 'locating' ? 'Locating...' : 'Near Me'}</span>
            </button>
          </div>
        </div>

        {/* City Summary Banner (Requirement #13) */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Selected City</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedCity.name}</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Average Noise</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                {cityAvgDb} dB
              </span>
              <NoiseStatusBadge severity={citySeverity} size="sm" showIcon={false} />
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Monitoring Points</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {citySensors.length} active
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Active Alerts</span>
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {cityAlertsCount} alerts
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Most Noisy Area</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
              {mostNoisySensor ? mostNoisySensor.name : 'Corridor'}
            </span>
          </div>
        </div>

        {/* Search & Severity Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search locations in ${selectedCity.name}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            {(['All', 'Safe', 'Moderate', 'High', 'Critical'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  severityFilter === s
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {gpsStatus === 'denied' && (
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>Location access is disabled. Please select your city manually from the menu above.</span>
            <button
              onClick={() => setGpsStatus('idle')}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Map Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md h-[550px] bg-slate-100 dark:bg-slate-950">
        <MapContainer
          center={[selectedCity.latitude, selectedCity.longitude]}
          zoom={selectedCity.defaultZoom}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap
            lat={selectedCity.latitude}
            lng={selectedCity.longitude}
            zoom={selectedCity.defaultZoom}
          />

          {/* User GPS point if available */}
          {userCoords && (
            <Circle
              center={[userCoords.lat, userCoords.lng]}
              radius={350}
              pathOptions={{ color: '#0d9488', fillColor: '#14b8a6', fillOpacity: 0.3 }}
            />
          )}

          {/* Sensor Pins */}
          {displayedSensors.map((sensor) => {
            const severity: NoiseSeverity =
              sensor.currentDb <= 65
                ? 'Safe'
                : sensor.currentDb <= 75
                ? 'Moderate'
                : sensor.currentDb <= 85
                ? 'High'
                : 'Critical';

            return (
              <Marker
                key={sensor.id}
                position={[sensor.latitude, sensor.longitude]}
                icon={createPublicPin(severity, sensor.currentDb)}
                eventHandlers={{
                  click: () => setSelectedSensor(sensor)
                }}
              >
                <Popup className="public-map-popup">
                  <div className="p-2 min-w-[180px]">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {sensor.locationType}
                      </span>
                      <NoiseStatusBadge severity={severity} size="sm" showIcon={false} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{sensor.name}</h4>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-xl font-black font-mono text-slate-900">
                        {sensor.currentDb}
                      </span>
                      <span className="text-xs text-slate-500">dB</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{sensor.noiseType}</p>
                    <button
                      onClick={() => setSelectedSensor(sensor)}
                      className="mt-2 w-full py-1 text-[11px] font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg text-[11px] space-y-1.5">
          <span className="font-bold text-slate-800 dark:text-slate-200 block text-[10px] uppercase">
            Acoustic Legend
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Safe (&lt;65 dB)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-300">Moderate (65–75 dB)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-600 dark:text-slate-300">High (75–85 dB)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-300">Critical (&gt;85 dB)</span>
          </div>
        </div>

        {/* Selected Sensor Slide Drawer */}
        {selectedSensor && (
          <div className="absolute top-4 right-4 z-20 w-80 max-w-[calc(100%-2rem)] bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 animate-in slide-in-from-right-3 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {selectedSensor.locationType}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedSensor.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSensor(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reading details */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Current dB</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {selectedSensor.currentDb}
                  </span>
                  <span className="text-xs text-slate-400">dB</span>
                </div>
              </div>
              <NoiseStatusBadge
                severity={
                  selectedSensor.currentDb <= 65
                    ? 'Safe'
                    : selectedSensor.currentDb <= 75
                    ? 'Moderate'
                    : selectedSensor.currentDb <= 85
                    ? 'High'
                    : 'Critical'
                }
                size="sm"
              />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span className="text-slate-400">Average Level:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedSensor.avgDb} dB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Peak Level:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedSensor.peakDb} dB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Noise Source:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px] text-right">
                  {selectedSensor.noiseType}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
