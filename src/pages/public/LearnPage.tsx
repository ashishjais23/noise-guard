import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  HeartPulse,
  Scale,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'What exactly is a decibel (dB)?',
    a: 'A decibel is the standard logarithmic unit used to measure sound pressure levels. Because it is logarithmic rather than linear, an increase of just 10 dB represents a ten-fold increase in sound energy and is perceived by human ears as roughly twice as loud. For example, 70 dB sounds twice as loud as 60 dB.'
  },
  {
    q: 'Why are smartphone microphones considered "device estimates"?',
    a: 'Normal consumer smartphones and laptops contain microphones designed to capture voice frequencies rather than full acoustic pressure spectrums. They apply automatic gain control (AGC) and noise suppression algorithms. Certified environmental meters (Class 1 or Class 2 IEC 61672) cost thousands of dollars and undergo rigorous physical calibration. NoiseWatch uses your phone microphone to provide a helpful situational estimate, clearly distinguished from laboratory instruments.'
  },
  {
    q: 'What are the permissible noise limits in India under CPCB rules?',
    a: 'Under the Noise Pollution (Regulation and Control) Rules, 2000: Industrial areas: 75 dB day / 70 dB night; Commercial areas: 65 dB day / 55 dB night; Residential areas: 55 dB day / 45 dB night; Silence zones (within 100m of hospitals, schools, and courts): 50 dB day / 40 dB night.'
  },
  {
    q: 'How does excessive noise harm human health?',
    a: 'Epidemiological studies by the World Health Organization (WHO) show that chronic exposure to environmental noise above 65 dB stimulates the sympathetic nervous system and triggers cortisol and adrenaline release. Long-term health consequences include sleep disturbance, elevated blood pressure, increased risk of ischemic heart disease, cognitive impairment in children, and chronic tinnitus.'
  },
  {
    q: 'What happens after I submit a citizen report?',
    a: 'When you submit a report on NoiseWatch, an official Tracking ID (NG-XXXXXX) is generated. The report is recorded in the civic registry, categorized by severity, and correlated with nearby automated IoT monitoring stations. Environmental nodal officers can verify the violation, assign patrol squads, or issue municipal notices.'
  }
];

export const LearnPage: React.FC = () => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Acoustic Education &amp; Civic Guidance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Learn About Noise
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Understanding urban acoustic pollution, decibel physics, statutory health standards, and how you can advocate for quieter public spaces.
        </p>
      </div>

      {/* 4 Educational Topic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            1. The Decibel (dB) Logarithmic Scale
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Human hearing perceives sound over a massive pressure range from 20 micropascals (auditory threshold) to 200 pascals (pain threshold). Because a linear scale would require trillions of units, decibels express sound as logarithms:
          </p>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 font-mono text-[11px] text-teal-800 dark:text-teal-300 border border-slate-200/60 dark:border-slate-800">
            L_p = 20 × log₁₀( P / P₀ ) dB
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Each 10 dB increase feels roughly twice as loud to our ears. Two identical 70 dB cars driving together produce 73 dB, not 140 dB!
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            2. Medical &amp; Health Impacts
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Noise pollution is recognized by the World Health Organization as the second-worst environmental health hazard after air particulate pollution:
          </p>
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
            <li><strong>Sleep Fragmentation:</strong> Sound above 45 dB causes micro-awakenings and prevents REM sleep.</li>
            <li><strong>Cardiovascular Strain:</strong> Nighttime noise increases heart rate and blood pressure.</li>
            <li><strong>Cognitive Effects:</strong> Chronic classroom noise reduces reading comprehension in school children.</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            3. Regulatory Standards (CPCB India)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Statutory ambient noise standards under the Noise Pollution Rules, 2000:
          </p>
          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-1">
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="font-semibold">Silence Zone (Hospitals):</span>
              <span className="font-mono">Day: 50 dB | Night: 40 dB</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="font-semibold">Residential Areas:</span>
              <span className="font-mono">Day: 55 dB | Night: 45 dB</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="font-semibold">Commercial Zones:</span>
              <span className="font-mono">Day: 65 dB | Night: 55 dB</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="font-semibold">Industrial Zones:</span>
              <span className="font-mono">Day: 75 dB | Night: 70 dB</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            4. How to Report Effectively
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            To ensure rapid verification by municipal environmental squads:
          </p>
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
            <li><strong>Pinpoint Specifics:</strong> Note landmarks, building numbers, or pole markers.</li>
            <li><strong>Identify Duration:</strong> Specify whether the noise has continued for minutes or hours.</li>
            <li><strong>Attach Media:</strong> Short audio clips or photos of un-muffled generators/speakers speed up official action.</li>
            <li><strong>Check Zones:</strong> Violations occurring in statutory Silence Zones are prioritized automatically.</li>
          </ul>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="space-y-4">
        <div className="max-w-xl">
          <h2 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
            COMMON QUESTIONS
          </h2>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3"
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-teal-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Transparency Academic Notice */}
      <div className="p-6 rounded-3xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2 text-xs text-teal-950 dark:text-teal-200">
        <div className="flex items-center gap-2 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>NoiseWatch Transparency Charter</span>
        </div>
        <p className="leading-relaxed">
          NoiseWatch never falsely claims consumer smartphone microphones are calibrated Class-1 sound level meters. Our architecture clearly partitions live device estimates from municipal IoT sensors, giving citizens practical daily awareness while preserving rigorous scientific standards.
        </p>
      </div>
    </div>
  );
};
