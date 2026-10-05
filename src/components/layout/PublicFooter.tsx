import React from 'react';
import { Volume2, ShieldCheck, Heart, ExternalLink, Lock } from 'lucide-react';
import { PublicPageId } from './PublicHeader';

interface PublicFooterProps {
  setActivePage: (page: PublicPageId) => void;
  onNavigateToAdmin: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  setActivePage,
  onNavigateToAdmin
}) => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
                <Volume2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-lg">
                NoiseGuard
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              NoiseGuard is a civic acoustic monitoring and citizen reporting initiative. Empowering citizens to track urban soundscapes, report threshold violations, and advocate for quieter, healthier communities.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Aligned with Central Pollution Control Board (CPCB) Noise Rules, 2000</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Public Portal
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => setActivePage('home')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('monitor')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Live Noise Monitor
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('map')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  City Noise Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('report')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Report Excessive Noise
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('my-reports')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Track My Reports
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('learn')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Learn &amp; FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Standards & Administration */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Standards &amp; Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <span className="text-slate-500 dark:text-slate-400">Day Commercial: 65 dB(A)</span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400">Night Residential: 45 dB(A)</span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400">Hospital Silence: 50 dB(A)</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={onNavigateToAdmin}
                  className="inline-flex items-center gap-1.5 font-semibold text-teal-700 dark:text-teal-400 hover:underline"
                >
                  <Lock className="w-3 h-3" />
                  <span>Authority Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} NoiseGuard Platform. Dedicated to Urban Acoustic Health.</p>
          <p className="flex items-center gap-1">
            Built for civic well-being &amp; academic transparency
          </p>
        </div>
      </div>
    </footer>
  );
};
