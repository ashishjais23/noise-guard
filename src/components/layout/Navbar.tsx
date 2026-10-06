import React from 'react';
import {
  Volume2,
  Sparkles,
  Eye,
  SlidersHorizontal,
  Upload,
  Database,
  Menu,
  X
} from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabaseClient';

interface NavbarProps {
  dataMode: 'SIMULATION' | 'OBSERVED';
  setDataMode: (mode: 'SIMULATION' | 'OBSERVED') => void;
  onOpenThresholdModal: () => void;
  onOpenCsvModal: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isSimRunning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  dataMode,
  setDataMode,
  onOpenThresholdModal,
  onOpenCsvModal,
  mobileMenuOpen,
  setMobileMenuOpen,
  isSimRunning
}) => {
  const hasSupabase = isSupabaseConfigured();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Academic Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                    NoiseWatch
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    EVS Prototype
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden md:block">
                  Smart Urban Noise Monitoring &amp; Control System
                </p>
              </div>
            </div>
          </div>

          {/* Center / Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setDataMode('SIMULATION')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                  dataMode === 'SIMULATION'
                    ? 'bg-white text-purple-700 shadow-xs border border-purple-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Use realistic stochastic simulation data"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Demo</span>
                <span>Simulation</span>
                {dataMode === 'SIMULATION' && isSimRunning && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                )}
              </button>

              <button
                onClick={() => setDataMode('OBSERVED')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                  dataMode === 'OBSERVED'
                    ? 'bg-white text-emerald-800 shadow-xs border border-emerald-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View observed & manually collected field readings"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>Observed</span>
                <span className="hidden sm:inline">Data</span>
              </button>
            </div>

            {/* CSV Import Button */}
            <button
              onClick={onOpenCsvModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
              title="Import observed field measurements from CSV"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Import CSV</span>
            </button>

            {/* Project Thresholds Config */}
            <button
              onClick={onOpenThresholdModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
              title="Configure project safety thresholds (Safe, Moderate, High, Critical)"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden md:inline">Thresholds</span>
            </button>

            {/* Supabase Indicator */}
            <div
              title={
                hasSupabase
                  ? 'Supabase backend connected (PostgreSQL live)'
                  : 'Local Mode (In-memory/localStorage store active. Supabase ready via schema.sql)'
              }
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600"
            >
              <Database className={`w-3 h-3 ${hasSupabase ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span>{hasSupabase ? 'Supabase Sync' : 'Local Store'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
