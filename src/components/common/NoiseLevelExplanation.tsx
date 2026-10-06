import React, { useState } from 'react';
import { NoiseSeverity } from '../../types';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, AlertCircle, AlertTriangle, Flame } from 'lucide-react';

interface NoiseLevelExplanationProps {
  severity: NoiseSeverity;
  db: number;
  averageDb?: number;
  peakDb?: number;
  mostNoisyPeriod?: string;
  likelySource?: string;
}

export const NoiseLevelExplanation: React.FC<NoiseLevelExplanationProps> = ({
  severity,
  db,
  averageDb,
  peakDb,
  mostNoisyPeriod,
  likelySource
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getInterpretation = () => {
    switch (severity) {
      case 'Safe':
        return {
          title: 'Comfortable & Calm',
          summary: 'Noise levels are healthy and comfortable for speech, rest, and sleep.',
          details: 'At this decibel range (under 65 dB), ambient sound poses virtually no risk to hearing or sleep quality. Suitable for residential relaxation, libraries, study, and standard indoor conversation.',
          recommendation: 'Ideal acoustic environment. No protection or intervention necessary.'
        };
      case 'Moderate':
        return {
          title: 'Noticeably Elevated',
          summary: 'Noise levels are elevated but currently below critical threshold ranges.',
          details: 'At 65–75 dB, sound is typical of busy markets, bustling office spaces, or regular street traffic. Prolonged continuous exposure during nighttime may disrupt deep sleep cycles or reduce work concentration.',
          recommendation: 'Acceptable for daytime commercial corridors. Consider closing windows if working or studying.'
        };
      case 'High':
        return {
          title: 'Disturbing & Loud',
          summary: 'Significant acoustic pollution likely causing fatigue, stress, or speech interference.',
          details: 'At 75–85 dB, voice conversation requires shouting from 1 meter away. Sounds typically arise from heavy traffic congestion, diesel bus terminals, construction tools, or loudspeakers. Sustained exposure can increase cortisol stress levels.',
          recommendation: 'Avoid prolonged stay without earplugs. If occurring in residential or hospital zones, file a citizen report.'
        };
      case 'Critical':
        return {
          title: 'Potentially Harmful Noise',
          summary: 'Severe acoustic pollution requiring immediate mitigation and caution.',
          details: 'Sound levels exceed 85 dB. Long-term continuous exposure at this level can lead to noise-induced hearing fatigue and permanent tinnitus. Typically produced by un-muffled generators, jackhammers, rock events, or air horns.',
          recommendation: 'Keep distance and protect your ears. Report this excessive noise immediately through NoiseWatch.'
        };
    }
  };

  const interpretation = getInterpretation();

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 p-5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Noise Assessment
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              • {interpretation.title}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            {interpretation.summary}
          </p>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800/80 transition-colors shrink-0 self-start sm:self-center"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>What does this mean?</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Summary stats row if provided */}
      {(averageDb !== undefined || peakDb !== undefined || mostNoisyPeriod || likelySource) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {averageDb !== undefined && (
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Average Level</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                {averageDb} dB
              </span>
            </div>
          )}
          {peakDb !== undefined && (
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Peak Recorded</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                {peakDb} dB
              </span>
            </div>
          )}
          {mostNoisyPeriod && (
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Peak Time Window</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                {mostNoisyPeriod}
              </span>
            </div>
          )}
          {likelySource && (
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Likely Sound Source</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                {likelySource}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Expandable Explanation Drawer */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3 text-xs leading-relaxed animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
            <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Health &amp; Acoustic Context</h5>
            <p>{interpretation.details}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 text-teal-900 dark:text-teal-200">
            <h5 className="font-bold text-teal-950 dark:text-teal-100 mb-1">Recommended Action</h5>
            <p>{interpretation.recommendation}</p>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 italic">
            <span>Reference guidelines: World Health Organization (WHO) &amp; Central Pollution Control Board (CPCB)</span>
          </div>
        </div>
      )}
    </div>
  );
};
