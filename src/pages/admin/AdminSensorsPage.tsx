import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Battery,
  Wifi,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  Search,
  ShieldCheck,
  Power
} from 'lucide-react';
import { SensorItem, CityItem, LocationType } from '../../types';

interface AdminSensorsPageProps {
  sensors: SensorItem[];
  cities: CityItem[];
  onAddSensor: (sensorData: Omit<SensorItem, 'id' | 'lastUpdated'>) => void;
  onUpdateSensor: (sensorId: string, updates: Partial<SensorItem>) => void;
  onDeleteSensor: (sensorId: string) => void;
}

const LOCATION_TYPES: LocationType[] = [
  'Traffic Corridor',
  'Commercial / Market',
  'Residential',
  'Silence / Healthcare',
  'Institutional',
  'Construction Zone',
  'Industrial'
];

export const AdminSensorsPage: React.FC<AdminSensorsPageProps> = ({
  sensors,
  cities,
  onAddSensor,
  onUpdateSensor,
  onDeleteSensor
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSensor, setEditingSensor] = useState<SensorItem | null>(null);

  // New Sensor form state
  const [name, setName] = useState('');
  const [cityId, setCityId] = useState(cities[0]?.id || 'city-delhi');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.2090);
  const [locationType, setLocationType] = useState<LocationType>('Traffic Corridor');
  const [connectivity, setConnectivity] = useState<SensorItem['connectivity']>('4G LTE');
  const [noiseType, setNoiseType] = useState('Traffic & Vehicular Flow');

  const handleCreateSensor = (e: React.FormEvent) => {
    e.preventDefault();
    const city = cities.find((c) => c.id === cityId);
    onAddSensor({
      name: name.trim(),
      cityId,
      cityName: city ? city.name : 'Metro',
      locationName: locationName.trim() || name.trim(),
      latitude,
      longitude,
      locationType,
      status: 'ONLINE',
      battery: 100,
      connectivity,
      calibrationStatus: 'Calibrated',
      lastCalibrationDate: new Date().toISOString().split('T')[0],
      installationDate: new Date().toISOString().split('T')[0],
      currentDb: 68.0,
      avgDb: 65.0,
      peakDb: 74.0,
      noiseType
    });

    setIsAddModalOpen(false);
    setName('');
    setLocationName('');
  };

  const handleToggleSensorStatus = (sensor: SensorItem) => {
    const nextStatus = sensor.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    onUpdateSensor(sensor.id, { status: nextStatus });
  };

  const filteredSensors = sensors.filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.id.toLowerCase().includes(term) ||
      s.name.toLowerCase().includes(term) ||
      s.cityName.toLowerCase().includes(term) ||
      s.locationType.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Add Sensor Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sensor Hardware Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Provision, monitor battery health, calibrate, and manage automated acoustic nodes.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 rounded-xl shadow-xs transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Sensor Node</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by Sensor ID, location, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSensors.map((sensor) => (
          <div
            key={sensor.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                  {sensor.id}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  sensor.status === 'ONLINE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sensor.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span>{sensor.status}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                {sensor.name}
              </h3>
              <p className="text-[11px] text-slate-400">
                {sensor.cityName} • {sensor.locationType}
              </p>

              <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Current Leq</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
                      {sensor.currentDb}
                    </span>
                    <span className="text-[10px] text-slate-400">dB</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">Average / Peak</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 text-xs">
                    {sensor.avgDb} / {sensor.peakDb} dB
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Battery Reserve:</span>
                  <span className="font-mono font-bold text-emerald-600">{sensor.battery}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Telemetry Link:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{sensor.connectivity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Calibration:</span>
                  <span>{sensor.calibrationStatus}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleToggleSensorStatus(sensor)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  sensor.status === 'ONLINE'
                    ? 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950 dark:text-rose-300'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                <Power className="w-3 h-3" />
                <span>{sensor.status === 'ONLINE' ? 'Disable' : 'Enable'}</span>
              </button>

              <button
                onClick={() => onDeleteSensor(sensor.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Delete sensor node"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Sensor Modal (Requirement #27) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Provision New Sensor Node
                </h3>
                <p className="text-xs text-slate-400">
                  Deploy an IoT Class-2 acoustic telemetry unit
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSensor} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sensor / Landmark Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Vihar Metro Exit 2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Zone Classification
                  </label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value as LocationType)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    {LOCATION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Uplink Technology
                  </label>
                  <select
                    value={connectivity}
                    onChange={(e) => setConnectivity(e.target.value as SensorItem['connectivity'])}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    <option value="4G LTE">4G LTE Cellular</option>
                    <option value="LoRaWAN">LoRaWAN Long-range</option>
                    <option value="Wi-Fi">Municipal Wi-Fi</option>
                    <option value="NB-IoT">Narrowband IoT</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Sound Pattern
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Arterial Traffic"
                    value={noiseType}
                    onChange={(e) => setNoiseType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 rounded-xl shadow-xs"
                >
                  Save &amp; Deploy Sensor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
