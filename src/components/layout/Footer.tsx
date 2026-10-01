import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { PageId } from './Sidebar';

interface FooterProps {
  setActivePage: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Notice */}
        <div className="flex items-start gap-2.5 max-w-xl">
          <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-700">Academic &amp; Research Prototype</p>
            <p className="mt-0.5 text-slate-500 leading-relaxed">
              NoiseGuard is developed as an Environmental Studies (EVS) academic project. Demo mode uses simulated stochastic data; real-world deployment requires calibrated acoustic hardware compliant with IEC 61672 standards.
            </p>
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setActivePage('methodology')}
            className="text-slate-600 hover:text-teal-700 transition-colors"
          >
            Methodology
          </button>
          <button
            onClick={() => setActivePage('research')}
            className="text-slate-600 hover:text-teal-700 transition-colors"
          >
            Scientific Research
          </button>
          <button
            onClick={() => setActivePage('about')}
            className="text-slate-600 hover:text-teal-700 transition-colors flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Acoustics Guide
          </button>
        </div>
      </div>
    </footer>
  );
};
