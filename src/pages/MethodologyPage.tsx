import React from 'react';
import {
  GitBranch,
  Layers,
  Cpu,
  Wifi,
  Database,
  Monitor,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  Sparkles,
  Eye,
  ShieldCheck
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const pipelineSteps = [
    {
      num: '01',
      title: 'Literature & Regulatory Research',
      desc: 'Investigating WHO Environmental Noise Guidelines (2018), CPCB Noise Pollution Rules (2000), and ISO 1996 acoustics standards to establish baseline noise thresholds and zoning categories.'
    },
    {
      num: '02',
      title: 'Data Collection Ingestion',
      desc: 'Acquiring acoustic inputs via three distinct channels: manual calibrated sound meter observations, structured research CSV datasets, and stochastic Markovian simulation models.'
    },
    {
      num: '03',
      title: 'Data Cleaning & Validation',
      desc: 'Filtering out acoustic anomalies, missing timestamps, format violations, and bounding dB values strictly between 20.0 dB and 140.0 dB.'
    },
    {
      num: '04',
      title: 'Acoustic Data Analysis',
      desc: 'Computing energy-equivalent continuous sound levels (Leq), peak maximums (Lmax), diurnal distributions, and hourly exceedance frequencies.'
    },
    {
      num: '05',
      title: 'Geospatial & Time Visualization',
      desc: 'Rendering real-time responsive Leaflet maps with status pins and interactive Recharts time-series trends tracking diurnal patterns.'
    },
    {
      num: '06',
      title: 'Threshold Alert Detection',
      desc: 'Continuously evaluating sound levels against project thresholds (Safe, Moderate, High, Critical) with temporal deduplication to prevent notification fatigue.'
    },
    {
      num: '07',
      title: 'Rule-Based Recommendations',
      desc: 'Mapping location zoning attributes, decibel intensity, and peak diurnal windows to suggested civil engineering and traffic management interventions.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600 border border-teal-200">
              <GitBranch className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Project Methodology &amp; Engineering Pipeline
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end scientific methodology governing data collection, statistical processing, alerting logic, and architectural boundaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
            EVS Environmental Methodology
          </span>
        </div>
      </div>

      {/* Explicit "Current Prototype" Section */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              Current Prototype Implementation
            </h2>
            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-950 leading-relaxed space-y-1">
              <p className="font-semibold">
                &ldquo;The current prototype does not use physical noise-monitoring hardware. It demonstrates the software architecture using observed and/or simulated data.&rdquo;
              </p>
              <p className="text-purple-800">
                This academic prototype focuses on data structures, real-time state synchronization, geographic visualization, threshold evaluation engines, and rule-based decision support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Data Sources Explained */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            DATA TAXONOMY
          </h2>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Three Supported Data Paradigms
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Clear delineation of measurement modalities to guarantee academic integrity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Paradigm 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Eye className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                  Observed
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                1. Observed Measurements
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Field measurements recorded manually by student researchers using calibrated Type-2 decibel meters at designated campus and city points. Imported into the platform via standard CSV upload with row-by-row validation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              Badge: OBSERVED
            </div>
          </div>

          {/* Paradigm 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                  <FileSpreadsheet className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase">
                  Research
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                2. Research Datasets
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Open-access research datasets from urban sound monitoring studies and municipal ambient noise monitoring networks (e.g. CPCB NANMN data bulletins), utilized to establish historical baselines and zone models.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              Badge: RESEARCH DATA
            </div>
          </div>

          {/* Paradigm 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                  <Sparkles className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 uppercase">
                  Simulated
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                3. Simulated Demonstration Data
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Real-time stochastic data generated using an autoregressive Markov model with diurnal rush-hour modifiers, mean reversion, and occasional acoustic burst events. Enables continuous UI validation without hardware.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              Badge: SIMULATED
            </div>
          </div>
        </div>
      </section>

      {/* 7-Step Methodological Flowchart */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            STEP-BY-STEP PROCESS
          </h2>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Data Processing Pipeline
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Flow from primary acoustic data input to actionable civic recommendations
          </p>
        </div>

        <div className="space-y-3">
          {pipelineSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex flex-col sm:flex-row sm:items-start gap-4"
            >
              <span className="w-9 h-9 rounded-xl bg-teal-600 text-white font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                {step.num}
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Future IoT Deployment Architectural Block Diagram */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 uppercase tracking-wider">
              Future Concept • Not Connected in Current Prototype
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-2">
              Future IoT Deployment Architecture
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Envisioned hardware pipeline for post-prototype deployment
            </p>
          </div>
        </div>

        {/* Diagram Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {[
            {
              title: 'Calibrated Noise Sensor',
              sub: 'INMP441 / MEMS Microphone with A-weighting analog front-end',
              icon: <Cpu className="w-5 h-5 text-teal-600" />
            },
            {
              title: 'ESP32 Microcontroller',
              sub: 'Edge processing: Onboard FFT, SPL integration & calibration curve',
              icon: <Cpu className="w-5 h-5 text-blue-600" />
            },
            {
              title: 'Wi-Fi / 4G Cellular',
              sub: 'TLS-encrypted MQTT / REST telemetry streaming packets',
              icon: <Wifi className="w-5 h-5 text-indigo-600" />
            },
            {
              title: 'Supabase PostgreSQL',
              sub: 'Time-series storage with schema.sql and automated triggers',
              icon: <Database className="w-5 h-5 text-emerald-600" />
            },
            {
              title: 'NoiseWatch Live UI',
              sub: 'Real-time Leaflet GIS mapping, dynamic alerts & Recharts',
              icon: <Monitor className="w-5 h-5 text-teal-600" />
            }
          ].map((block, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between text-center relative"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
                  {block.icon}
                </div>
                <h5 className="text-xs font-bold text-slate-900">{block.title}</h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{block.sub}</p>
              </div>
              <div className="mt-3 text-[10px] text-slate-400 font-mono font-medium">
                Stage {idx + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-700">Hardware Independence:</strong> The current project evaluates purely on client and database software layers. No physical ESP32 or microphone hardware is required to run the full application.
        </div>
      </section>
    </div>
  );
};
