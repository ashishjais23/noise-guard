import React, { useState } from 'react';
import {
  Info,
  Scale,
  Smartphone,
  Copy,
  Check,
  GraduationCap,
  FileCode
} from 'lucide-react';

export const AboutProjectPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const sampleSqlSnippet = `-- NoiseGuard PostgreSQL Schema (Excerpts)
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location_type VARCHAR(50) NOT NULL,
    baseline_db NUMERIC(5, 2) DEFAULT 55.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.noise_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    noise_level_db NUMERIC(5, 2) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    data_source VARCHAR(30) NOT NULL CHECK (data_source IN ('SIMULATED', 'OBSERVED', 'RESEARCH DATA')),
    measurement_method VARCHAR(80)
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sampleSqlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600 border border-teal-200">
              <Info className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              About NoiseGuard &amp; Acoustic Physics
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fundamental acoustic science, calibration requirements, smartphone sensor limitations, and academic project context
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Environmental Studies (EVS) Academic Project</span>
          </span>
        </div>
      </div>

      {/* SECTION 1: Fundamental Acoustic Science */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            ACOUSTIC PHYSICS
          </h2>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            What is a Decibel (dB) &amp; Sound Pressure Level?
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Logarithmic scaling of human auditory perception
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              The Decibel (dB) Logarithmic Scale
            </h4>
            <p>
              The human ear exhibits an enormous dynamic range, perceiving sounds spanning from 20 micropascals (20 &mu;Pa, the threshold of hearing) to over 100 pascals (jet engines, threshold of pain)—a factor of more than 5,000,000 in physical pressure.
            </p>
            <p>
              To manage this vast scale, acoustic science utilizes the logarithmic decibel formula:
            </p>
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-center font-mono font-semibold text-slate-800">
              Lp = 20 &times; log10(P / P0) dB
            </div>
            <p className="text-[11px] text-slate-500">
              Where P is the Root Mean Square (RMS) sound pressure and P0 = 20 &mu;Pa in air. Consequently, an increase of <strong>3 dB</strong> represents a doubling of acoustic sound energy, and an increase of <strong>10 dB</strong> is perceived by human listeners as roughly twice as loud.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              A-Weighting (dB(A)) &amp; Equivalent Continuous Sound Level (Leq)
            </h4>
            <p>
              Human auditory sensitivity is not uniform across frequencies: we are far less sensitive to deep bass (below 100 Hz) and high treble (above 10 kHz) than to speech frequencies (1 kHz to 4 kHz).
            </p>
            <p>
              <strong>A-Weighting (dB(A)):</strong> An electronic filtering curve that mimics the equal-loudness contours (Fletcher-Munson curves) of the human ear. It attenuates low frequencies to reflect true human annoyance and health risks.
            </p>
            <p>
              <strong>Equivalent Sound Level (Leq):</strong> Because environmental noise is constantly fluctuating, Leq calculates the constant steady sound pressure level that contains the identical total acoustic energy over a specified measurement duration.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Why Calibration Matters & Smartphone Microphone Pitfalls */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            MEASUREMENT INTEGRITY
          </h2>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Calibration &amp; Why Smartphones Are Not Certified Noise Meters
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Understanding instrumental standards for municipal and environmental enforcement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Calibration */}
          <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-teal-50 text-teal-600 border border-teal-200">
                <Scale className="w-5 h-5" />
              </span>
              <h4 className="font-bold text-slate-900 text-sm">
                Why Acoustic Calibration is Essential
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Precision microphones are sensitive electro-mechanical transducers whose diaphragm compliance fluctuates with temperature, relative humidity, and barometric pressure. Professional environmental sound surveys mandate field calibration using a certified acoustic calibrator (producing a standard 94.0 dB or 114.0 dB reference tone at 1000 Hz) immediately before and after every field measurement session (IEC 61672-1).
            </p>
            <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4 marker:text-teal-600">
              <li>Class 1 Meters: Precision field laboratory standard (tolerance &plusmn;1.1 dB)</li>
              <li>Class 2 Meters: General field environmental standard (tolerance &plusmn;1.4 dB)</li>
            </ul>
          </div>

          {/* Card 2: Smartphone Limitations */}
          <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-100 text-amber-700 border border-amber-200">
                <Smartphone className="w-5 h-5" />
              </span>
              <h4 className="font-bold text-slate-900 text-sm">
                Why Smartphone Apps Are Not Legal Environmental Instruments
              </h4>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              While smartphone decibel apps are educational and useful for qualitative curiosity, they should <strong>never</strong> be presented as certified environmental measurements for regulatory or legal compliance due to hardware design constraints:
            </p>
            <ul className="text-xs text-amber-900 space-y-1.5 list-disc pl-4 marker:text-amber-500">
              <li>
                <strong>Automatic Gain Control (AGC):</strong> Phone operating systems dynamically compress and amplify audio streams to prioritize voice intelligibility, skewing raw decibel calculations.
              </li>
              <li>
                <strong>Acoustic Port Occlusion:</strong> Microphone port geometry and protective phone cases cause severe high-frequency attenuation and resonance peaks.
              </li>
              <li>
                <strong>Clipping at High SPL:</strong> Smartphone MEMS capsules are optimized for speech (60-80 dB) and typically distort or clip above 95-100 dB.
              </li>
              <li>
                <strong>Lack of Traceable Calibration:</strong> Factory variations mean two identical phones running the same app often diverge by 6-12 dB.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: Supabase Data Model & SQL Schema */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              DATABASE ARCHITECTURE
            </h2>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Supabase / PostgreSQL Data Schema
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Production-ready DDL definitions for cloud synchronization
            </p>
          </div>

          <button
            onClick={copySql}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied SQL' : 'Copy DDL Schema'}</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 text-slate-200 p-4 font-mono text-xs overflow-x-auto">
          <pre>{sampleSqlSnippet}</pre>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 text-xs text-slate-500 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            Full schema file located at <code className="font-mono text-slate-700">supabase/schema.sql</code>, ready for one-click deployment in the Supabase SQL Editor.
          </span>
        </div>
      </section>
    </div>
  );
};
