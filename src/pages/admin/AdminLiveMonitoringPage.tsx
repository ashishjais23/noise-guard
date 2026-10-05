import React, { useState, useMemo } from 'react';
import {
  Activity,
  Cpu,
  Search,
  Filter,
  MapPin,
  Battery,
  Wifi,
  RotateCcw,
  SlidersHorizontal,
  ShieldCheck,
  Radio,
  ExternalLink
} from 'lucide-react';
import { SensorItem, CityItem, NoiseSeverity } from '../../types';
import { NoiseStatusBadge } from '../../components/common/NoiseStatusBadge';

interface AdminLiveMonitoringPageProps {
  sensors: SensorItem[];
  cities: CityItem[];
  onUpdateSensor: (sensorId: string, updates: Partial<SensorItem>) => void;
}

export const AdminLiveMonitoringPage: React.FC<AdminLiveMonitoringPageProps> = ({
  sensors,
  cities,
  onUpdateSensor
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSensor, setSelectedSensor] = useState<SensorItem | null>(null);

  // Filtered sensor list
  const filteredSensors = useMemo(() => {
    return sensors.filter((s) => {
      if (selectedCityId !== 'all' && s.cityId !== selectedCityId) {
        return false;
      }
      if (selectedStatus !== 'all' && s.status !== selectedStatus) {
        return false;
      }
      if (
        searchTerm &&
        !s.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !s.cityName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [sensors, selectedCityId, selectedStatus, searchTerm]);

  // Simulate pinging / refreshing sensor reading
  const handlePingSensor = (sensor: SensorItem) => {
    // Add small stochastic variation (-1.5 to +1.5 dB)
    const delta = (Math.random() - 0.5) * 3;
    const newDb = Math.round((sensor.currentDb + delta) * 10) / 10;
    const clampedDb = Math.max(40, Math.min(98, newDb));

    onUpdateSensor(sensor.id, {
      currentDb: clampedDb,
      lastUpdated: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-teal-600" />
            <span>Active IoT Telemetry Mesh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Live Sensor Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time calibrated acoustic stations streaming continuous Leq decibel telemetry.
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs self-start sm:self-center">
          Active Feed: {filteredSensors.length} Stations
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Sensor ID, name, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* City Filter */}
        <select
          value={selectedCityId}
          onChange={(e) => setSelectedCityId(e.target.value)}
          className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Cities ({cities.length})</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Statuses</option>
          <option value="ONLINE">ONLINE</option>
          <option value="OFFLINE">OFFLINE</option>
          <option value="STALE">STALE</option>
        </select>
      </div>

      {/* Main Technical Table (Requirement #21) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Sensor ID</th>
                <th className="py-3 px-4">City &amp; Location</th>
                <th className="py-3 px-4">Coordinates</th>
                <th className="py-3 px-4">Current Leq</th>
                <th className="py-3 px-4">Average</th>
                <th className="py-3 px-4">Peak</th>
                <th className="py-3 px-4">Battery</th>
                <th className="py-3 px-4">Link</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
              {filteredSensors.map((sensor) => {
                const severity: NoiseSeverity =
                  sensor.currentDb <= 65
                    ? 'Safe'
                    : sensor.currentDb <= 75
                    ? 'Moderate'
                    : sensor.currentDb <= 85
                    ? 'High'
                    : 'Critical';

                return (
                  <tr
                    key={sensor.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                      {sensor.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{sensor.name}</div>
                      <div className="text-[11px] text-slate-400">{sensor.cityName} • {sensor.locationType}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {sensor.latitude.toFixed(4)}, {sensor.longitude.toFixed(4)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-slate-900 dark:text-white text-sm">
                          {sensor.currentDb}
                        </span>
                        <span className="text-[10px] text-slate-400">dB</span>
                        <NoiseStatusBadge severity={severity} size="sm" showIcon={false} />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {sensor.avgDb} dB
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {sensor.peakDb} dB
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        <Battery className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{sensor.battery}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-teal-600" />
                        <span>{sensor.connectivity}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{sensor.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handlePingSensor(sensor)}
                          title="Simulate telemetry polling ping"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedSensor(sensor)}
                          className="px-2.5 py-1 text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 rounded-lg border border-teal-200 dark:border-teal-800 transition-colors"
                        >
                          Inspect
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sensor Inspector Modal */}
      {selectedSensor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                  {selectedSensor.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {selectedSensor.name}
                </h3>
                <span className="text-xs text-slate-400">{selectedSensor.cityName} • {selectedSensor.locationType}</span>
              </div>
              <button
                onClick={() => setSelectedSensor(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Current dB</span>
                <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {selectedSensor.currentDb}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Average</span>
                <span className="text-xl font-bold font-mono text-slate-700 dark:text-slate-300">
                  {selectedSensor.avgDb}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Peak</span>
                <span className="text-xl font-bold font-mono text-rose-600">
                  {selectedSensor.peakDb}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Calibration Standard:</span>
                <span className="font-semibold">{selectedSensor.calibrationStatus} ({selectedSensor.lastCalibrationDate})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Installation Date:</span>
                <span className="font-mono">{selectedSensor.installationDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Network Uplink:</span>
                <span className="font-semibold">{selectedSensor.connectivity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Primary Sound Source:</span>
                <span className="font-semibold">{selectedSensor.noiseType}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedSensor(null)}
                className="w-full py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
