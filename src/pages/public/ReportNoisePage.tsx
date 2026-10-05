import React, { useState } from 'react';
import {
  FilePlus2,
  CheckCircle2,
  Upload,
  Camera,
  Music,
  MapPin,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { CityItem, ReportCategory, CitizenReport } from '../../types';
import { PublicPageId } from '../../components/layout/PublicHeader';

interface ReportNoisePageProps {
  cities: CityItem[];
  selectedCity: CityItem;
  setActivePage: (page: PublicPageId) => void;
  onReportSubmitted?: (report: CitizenReport) => void;
}

const CATEGORIES: { label: string; value: ReportCategory; desc: string }[] = [
  { label: 'Traffic & Vehicles', value: 'Traffic', desc: 'Continuous vehicle congestion or highway noise' },
  { label: 'Construction & Demolition', value: 'Construction', desc: 'Piling, drilling, jackhammers, concrete mixers' },
  { label: 'Loudspeaker & PA Systems', value: 'Loudspeaker', desc: 'Concerts, public addresses, amplified sound' },
  { label: 'Air Horns & Honking', value: 'Horns', desc: 'Illegal multi-tone horns or incessant honking' },
  { label: 'Diesel Generators', value: 'Generator', desc: 'Commercial backup generators without acoustic canopy' },
  { label: 'Commercial & Markets', value: 'Commercial', desc: 'Rooftop venues, street auctions, cooling towers' },
  { label: 'Industrial Machinery', value: 'Industrial', desc: 'Fabrication shops, pneumatic tools, heavy presses' },
  { label: 'Public Events & Rallies', value: 'Event', desc: 'Temporary gatherings exceeding permissible decibels' },
  { label: 'Other Acoustic Source', value: 'Other', desc: 'Any other sustained excessive noise issue' }
];

export const ReportNoisePage: React.FC<ReportNoisePageProps> = ({
  cities,
  selectedCity,
  setActivePage,
  onReportSubmitted
}) => {
  const [city, setCity] = useState(selectedCity.name);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<ReportCategory>('Traffic');
  const [approxDb, setApproxDb] = useState<number>(75);
  const [hasDbInput, setHasDbInput] = useState(false);
  const [description, setDescription] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [evidenceName, setEvidenceName] = useState<string | null>(null);

  const [submittedReport, setSubmittedReport] = useState<CitizenReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload simulation / local reading
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
      setErrorMsg('Please specify the street, landmark, or area where the noise is occurring.');
      return;
    }

    if (!description.trim() || description.length < 10) {
      setErrorMsg('Please provide a brief description (at least 10 characters) explaining the noise situation.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReport = dataService.submitReport({
        city,
        location: location.trim(),
        category,
        approxNoiseDb: hasDbInput ? approxDb : undefined,
        description: description.trim(),
        evidenceName: evidenceName || undefined,
        reporterContact: reporterContact.trim() || undefined
      });

      setSubmittedReport(newReport);
      if (onReportSubmitted) {
        onReportSubmitted(newReport);
      }
    } catch (err: any) {
      setErrorMsg('Unable to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedReport(null);
    setLocation('');
    setDescription('');
    setEvidenceName(null);
    setHasDbInput(false);
    setReporterContact('');
    setErrorMsg(null);
  };

  // If report has been submitted, show clear Confirmation Screen (Requirement #16)
  if (submittedReport) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Receipt Acknowledged
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Report Submitted Successfully
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
              Your citizen acoustic report has been registered in the municipal environmental monitoring log.
            </p>
          </div>

          {/* Details Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-left space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">Official Tracking ID</span>
              <span className="text-base font-extrabold font-mono text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
                {submittedReport.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Status</span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  {submittedReport.status}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Category</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {submittedReport.category}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Location</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                  {submittedReport.location}, {submittedReport.city}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Submitted At</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">
                  {new Date(submittedReport.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your report will be reviewed by the municipal noise surveillance team and correlated with nearby IoT telemetry stations.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActivePage('my-reports')}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 rounded-xl shadow-sm transition-all"
            >
              <span>Track in My Reports</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetForm}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Submit Another Report</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300 text-xs font-semibold mb-2">
          <FilePlus2 className="w-3.5 h-3.5" />
          <span>Citizen Acoustic Vigilance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Report Excessive Noise
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Help map noisy violations in your neighborhood. Complete this quick report in under 60 seconds.
        </p>
      </div>

      {/* Error Callout */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Report Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6"
      >
        {/* Step 1: City & Location */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            1. Where is the noise occurring?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Specific Location / Street / Landmark <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Metro Pillar 124, 5th Main Road Market"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Category */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            2. Noise Category <span className="text-rose-500">*</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.value;
              return (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-950 dark:text-teal-200 shadow-2xs font-semibold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <div className="text-xs font-bold">{cat.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {cat.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Approximate Noise Level (Optional) */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              3. Approximate Noise Level (Optional)
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={hasDbInput}
                onChange={(e) => setHasDbInput(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Specify estimated dB</span>
            </label>
          </div>

          {hasDbInput && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Estimated Decibels:</span>
                <span className="font-mono font-extrabold text-teal-700 dark:text-teal-300 text-sm">
                  {approxDb} dB
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="110"
                step="1"
                value={approxDb}
                onChange={(e) => setApproxDb(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>50 dB (Quiet)</span>
                <span>75 dB (Moderate/High)</span>
                <span>110 dB (Extreme)</span>
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Description */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            4. Situation Description <span className="text-rose-500">*</span>
          </h3>
          <textarea
            required
            rows={3}
            placeholder="Describe the noise: what is causing it, how long it has been going on, is it occurring at night, etc."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Step 5: Evidence Upload (Photo / Audio) */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            5. Attach Evidence (Optional Photo or Audio Clip)
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
              <Camera className="w-4 h-4 text-teal-600" />
              <span>{evidenceName ? 'Change File' : 'Upload Photo or Audio'}</span>
              <input
                type="file"
                accept="image/*,audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {evidenceName && (
              <span className="text-xs font-mono text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800">
                Attached: {evidenceName}
              </span>
            )}
          </div>
        </div>

        {/* Step 6: Reporter Contact (Optional) */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Your Email or Phone (Optional, for investigation updates)
          </label>
          <input
            type="text"
            placeholder="e.g. rahul@example.com or 9876543210"
            value={reporterContact}
            onChange={(e) => setReporterContact(e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Submitting report...</span>
            ) : (
              <>
                <span>Submit Citizen Report</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
