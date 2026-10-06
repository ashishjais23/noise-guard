import React, { useState } from 'react';
import {
  CheckCircle2,
  Camera,
  MapPin,
  ArrowRight,
  AlertCircle,
  Navigation,
  Search,
  Loader2,
  X
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { locationService, LocationSearchResult } from '../../services/locationService';
import { CityItem, ReportCategory, CitizenReport } from '../../types';
import { PublicPageId } from '../../components/layout/PublicHeader';

interface ReportNoisePageProps {
  cities: CityItem[];
  selectedCity: CityItem;
  setActivePage: (page: PublicPageId) => void;
  onReportSubmitted?: (report: CitizenReport) => void;
}

const CATEGORIES: { label: string; value: ReportCategory }[] = [
  { label: 'Traffic', value: 'Traffic' },
  { label: 'Construction', value: 'Construction' },
  { label: 'Loudspeaker', value: 'Loudspeaker' },
  { label: 'Event', value: 'Event' },
  { label: 'Industrial', value: 'Industrial' },
  { label: 'Horns', value: 'Horns' },
  { label: 'Other', value: 'Other' }
];

export const ReportNoisePage: React.FC<ReportNoisePageProps> = ({
  cities,
  selectedCity,
  setActivePage,
  onReportSubmitted
}) => {
  const [category, setCategory] = useState<ReportCategory>('Traffic');
  const [city, setCity] = useState(selectedCity ? selectedCity.name : 'Delhi');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [accuracy, setAccuracy] = useState<number | undefined>(undefined);
  const [isLocating, setIsLocating] = useState(false);
  const [description, setDescription] = useState('');
  const [evidenceName, setEvidenceName] = useState<string | null>(null);

  // Address search autocompletion
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [submittedReport, setSubmittedReport] = useState<CitizenReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Request genuine browser geolocation with high accuracy + reverse geocode
  const handleUseCurrentLocation = async () => {
    setErrorMsg(null);
    setIsLocating(true);
    try {
      const pos = await locationService.getCurrentPosition();
      setLatitude(pos.latitude);
      setLongitude(pos.longitude);
      setAccuracy(pos.accuracy);

      // Perform genuine reverse geocode via OSM Nominatim
      const geocoded = await locationService.reverseGeocode(pos.latitude, pos.longitude);
      if (geocoded.city && geocoded.city !== 'Local Area') {
        setCity(geocoded.city);
      }
      setLocation(geocoded.formattedAddress);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to retrieve genuine GPS position.');
    } finally {
      setIsLocating(false);
    }
  };

  // Perform open address query
  const handleSearchAddress = async () => {
    if (!location.trim() || location.trim().length < 3) return;
    setIsSearching(true);
    try {
      const results = await locationService.searchAddress(location.trim());
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: LocationSearchResult) => {
    setLocation(result.displayName);
    if (result.city && result.city !== 'Local Area') {
      setCity(result.city);
    }
    setLatitude(result.latitude);
    setLongitude(result.longitude);
    setSearchResults([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEvidenceName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!location.trim()) {
      setErrorMsg('Please specify the location or landmark.');
      return;
    }

    if (!city.trim()) {
      setErrorMsg('Please specify the city or locality.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReport = dataService.submitReport({
        city: city.trim(),
        location: location.trim(),
        latitude,
        longitude,
        category,
        description: description.trim() || 'No additional description provided.',
        evidenceName: evidenceName || undefined
      });

      setSubmittedReport(newReport);
      if (onReportSubmitted) {
        onReportSubmitted(newReport);
      }
    } catch {
      setErrorMsg('Unable to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedReport(null);
    setLocation('');
    setLatitude(undefined);
    setLongitude(undefined);
    setAccuracy(undefined);
    setDescription('');
    setEvidenceName(null);
    setErrorMsg(null);
    setSearchResults([]);
  };

  // Receipt view upon submission
  if (submittedReport) {
    return (
      <div className="max-w-md mx-auto py-8 px-4 space-y-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md text-center space-y-5 animate-in zoom-in-95 duration-150">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Report Submitted
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your acoustic complaint has been registered in the municipal surveillance database.
            </p>
          </div>

          {/* Minimal receipt details */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400">Tracking ID:</span>
              <span className="font-mono font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded">
                {submittedReport.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Category:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedReport.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                {submittedReport.location}, {submittedReport.city}
              </span>
            </div>
            {submittedReport.latitude && submittedReport.longitude && (
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">GPS Coordinates:</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">
                  {submittedReport.latitude.toFixed(4)}, {submittedReport.longitude.toFixed(4)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Lifecycle Status:</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">Submitted</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => setActivePage('my-reports')}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/20"
            >
              <span>Track in My Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleResetForm}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-4 sm:py-8 px-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Report Excessive Noise
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Notify environmental monitoring of urban noise disturbances anywhere
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5"
      >
        {/* Question: What is causing it? */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            What is causing it?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.value;
              return (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Location
            </label>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              {isLocating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Navigation className="w-3 h-3" />
              )}
              <span>{isLocating ? 'Acquiring GPS...' : 'Use Current GPS'}</span>
            </button>
          </div>

          {/* Genuine GPS Accuracy Indicator */}
          {accuracy !== undefined && latitude !== undefined && longitude !== undefined && (
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-[11px] text-teal-800 dark:text-teal-300 flex items-center justify-between">
              <span className="font-semibold">
                GPS Fixed: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </span>
              <span className="font-mono text-[10px] bg-teal-100 dark:bg-teal-900 px-1.5 py-0.5 rounded">
                ±{accuracy}m accuracy
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Open / Editable City Input with Datalist */}
            <div className="col-span-1">
              <input
                type="text"
                required
                list="popular-cities"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City / Area"
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <datalist id="popular-cities">
                {cities.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>

            {/* Address / Landmark Input with Search Option */}
            <div className="col-span-1 sm:col-span-2 relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Street / area / landmark..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-8 pr-16 py-2 text-xs bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleSearchAddress}
                disabled={isSearching || !location.trim()}
                title="Search address via OpenStreetMap"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-200 dark:bg-slate-700 hover:bg-teal-600 hover:text-white transition-colors"
              >
                {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Search suggestions dropdown */}
          {searchResults.length > 0 && (
            <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-1 text-xs">
              <div className="flex justify-between items-center px-1 text-[10px] font-bold text-slate-400 uppercase">
                <span>Suggested Addresses</span>
                <button
                  type="button"
                  onClick={() => setSearchResults([])}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              {searchResults.map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 truncate block text-[11px] text-slate-700 dark:text-slate-200"
                >
                  <span className="font-semibold">{item.city}: </span>
                  {item.displayName}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description: Optional */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Description <span className="text-[10px] font-normal lowercase text-slate-400">(Optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Brief details about the noise disturbance (e.g. night-time loudspeaker, heavy machinery)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Evidence: Add photo */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Evidence <span className="text-[10px] font-normal lowercase text-slate-400">(Optional)</span>
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs font-semibold">
              <Camera className="w-3.5 h-3.5 text-teal-600" />
              <span>Add photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {evidenceName && (
              <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-400 font-medium bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-lg">
                <span>{evidenceName}</span>
                <button
                  type="button"
                  onClick={() => setEvidenceName(null)}
                  className="hover:text-rose-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 rounded-2xl shadow-lg shadow-teal-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isSubmitting ? (
            <span>Registering complaint...</span>
          ) : (
            <>
              <span>Submit Noise Report</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
