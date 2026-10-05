import React from 'react';
import { Recommendation } from '../../types';
import { Lightbulb, AlertCircle, CheckCircle, Info, Shield } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-50 text-amber-600 border border-amber-200">
                <Lightbulb className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {recommendation.category}
              </h3>
            </div>
            <span className="inline-block mt-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Zone: {recommendation.targetLocationType}
            </span>
          </div>
        </div>

        {/* Trigger Condition */}
        <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs">
          <span className="font-semibold text-slate-700">Trigger Scenario: </span>
          <span className="text-slate-600">{recommendation.triggerCondition}</span>
        </div>

        {/* Potential Contributing Factors */}
        <div className="mt-4 space-y-1.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
            <span>Potential Contributing Factors</span>
          </h4>
          <ul className="space-y-1 text-xs text-slate-600 pl-4 list-disc marker:text-orange-400">
            {recommendation.potentialFactors.map((factor: string, idx: number) => (
              <li key={idx} className="leading-relaxed">
                {factor}
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Interventions */}
        <div className="mt-4 space-y-1.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Suggested Interventions</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc marker:text-teal-500">
            {recommendation.suggestedInterventions.map((action: string, idx: number) => (
              <li key={idx} className="leading-relaxed font-medium">
                {action}
              </li>
            ))}
          </ul>
        </div>

        {/* Scientific Rationale */}
        <div className="mt-4 p-3 rounded-lg bg-teal-50/50 border border-teal-100 text-xs text-teal-900 leading-relaxed">
          <span className="font-bold flex items-center gap-1 mb-0.5 text-teal-800">
            <Info className="w-3.5 h-3.5 text-teal-600" />
            Acoustic Rationale:
          </span>
          {recommendation.scientificRationale}
        </div>
      </div>

      {/* Academic Disclaimer Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-400 leading-normal">
        <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>{recommendation.disclaimer}</span>
      </div>
    </div>
  );
};
