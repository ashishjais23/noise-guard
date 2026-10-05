import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Power,
  MapPin,
  CheckCircle2,
  XCircle,
  X,
  Search
} from 'lucide-react';
import { CityItem, SensorItem } from '../../types';

interface AdminCitiesPageProps {
  cities: CityItem[];
  sensors: SensorItem[];
  onAddCity: (city: Omit<CityItem, 'id'>) => void;
  onToggleCityStatus: (cityId: string) => void;
}

export const AdminCitiesPage: React.FC<AdminCitiesPageProps> = ({
  cities,
  sensors,
  onAddCity,
  onToggleCityStatus
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [latitude, setLatitude] = useState(20.0);
  const [longitude, setLongitude] = useState(78.0);
  const [baselineAvgDb, setBaselineAvgDb] = useState(65.0);
  const [description, setDescription] = useState('');

  const handleCreateCity = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCity({
      name: name.trim(),
      state: state.trim(),
      latitude,
      longitude,
      defaultZoom: 12,
      enabled: true,
      baselineAvgDb,
      description: description.trim() || `${name} metropolitan area monitoring network.`
    });

    setIsAddModalOpen(false);
    setName('');
    setState('');
    setDescription('');
  };

  const filteredCities = cities.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(term) || c.state.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Metropolitan City Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure covered municipalities, target coordinates, and active surveillance zones.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 rounded-xl shadow-xs transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Municipality</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by city name or state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCities.map((city) => {
          const count = sensors.filter((s) => s.cityId === city.id).length;
          return (
            <div
              key={city.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {city.name}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    city.enabled
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {city.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                  {city.state}
                </span>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {city.description}
                </p>

                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Active Sensors</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {count} nodes
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Baseline Average</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {city.baselineAvgDb} dB
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[10px] font-mono text-slate-400">
                  Center: {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onToggleCityStatus(city.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    city.enabled
                      ? 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950 dark:text-rose-300'
                      : 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{city.enabled ? 'Deactivate' : 'Activate'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add City Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Add Metropolitan City
                </h3>
                <p className="text-xs text-slate-400">
                  Register a new urban municipal region for acoustic monitoring
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCity} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  City Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chandigarh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  State / Territory <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Punjab"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl"
                />
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

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Baseline Ambient Average (dB)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={baselineAvgDb}
                  onChange={(e) => setBaselineAvgDb(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
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
                  Save City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
