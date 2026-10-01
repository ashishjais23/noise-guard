import React, { useState, useMemo } from 'react';
import { RecommendationCard } from '../components/recommendations/RecommendationCard';
import { BASE_RECOMMENDATIONS } from '../services/recommendationEngine';
import { LocationType } from '../types';
import { Lightbulb, Info, Filter, ShieldAlert } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const zoneCategories = [
    { value: 'all', label: 'All Urban Scenarios' },
    { value: 'Traffic Corridor', label: 'Traffic & Transport' },
    { value: 'Construction Zone', label: 'Construction Works' },
    { value: 'Commercial / Market', label: 'Commercial & Markets' },
    { value: 'Silence / Healthcare', label: 'Silence Zones' },
    { value: 'Industrial', label: 'Industrial Facilities' }
  ];

  const filteredRecommendations = useMemo(() => {
    if (selectedZone === 'all') return BASE_RECOMMENDATIONS;
    return BASE_RECOMMENDATIONS.filter(
      (r) => r.targetLocationType === selectedZone || r.targetLocationType === 'General'
    );
  }, [selectedZone]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
              <Lightbulb className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Acoustic Interventions &amp; Mitigation Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rule-based decision support proposing potential contributing factors and suggested noise mitigation measures
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-semibold border border-slate-200">
            Rule-Based Logic
          </span>
        </div>
      </div>

      {/* Prudence & Scientific Integrity Notice */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-900">
            Methodological Notice on Recommendations:
          </span>
          <p className="leading-relaxed text-amber-800">
            The recommendations presented below are rule-based engineering guidelines and pedagogical demonstrations. They represent <em>potential contributing factors</em> and <em>suggested interventions</em> based on acoustic science and municipal guidelines (e.g. CPCB Noise Rules 2000, WHO Guidelines). The system does not claim to have automatically proven source classification or definitive municipal causality without on-site physical inspection.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {zoneCategories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedZone(cat.value)}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              selectedZone === cat.value
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRecommendations.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </div>
    </div>
  );
};
