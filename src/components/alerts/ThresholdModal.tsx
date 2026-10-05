import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ProjectThresholds } from '../../types';
import { REGULATORY_STANDARDS } from '../../data/defaultThresholds';
import { SlidersHorizontal, Info, RotateCcw, Check } from 'lucide-react';

interface ThresholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  thresholds: ProjectThresholds;
  onSave: (thresholds: ProjectThresholds) => void;
  onReset: () => void;
}

export const ThresholdModal: React.FC<ThresholdModalProps> = ({
  isOpen,
  onClose,
  thresholds,
  onSave,
  onReset
}) => {
  const [safeMax, setSafeMax] = useState(thresholds.safeMax);
  const [moderateMax, setModerateMax] = useState(thresholds.moderateMax);
  const [highMax, setHighMax] = useState(thresholds.highMax);
  const [error, setError] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (safeMax >= moderateMax) {
      setError('Safe maximum threshold must be strictly lower than Moderate threshold.');
      return;
    }
    if (moderateMax >= highMax) {
      setError('Moderate maximum threshold must be strictly lower than High threshold.');
      return;
    }
    setError(null);
    onSave({ safeMax, moderateMax, highMax, durationMinutesTrigger: thresholds.durationMinutesTrigger || 5 });
    onClose();
  };

  const handleReset = () => {
    onReset();
    setSafeMax(65);
    setModerateMax(75);
    setHighMax(85);
    setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Project Threshold Configuration"
      subtitle="Adjust classification boundaries for Safe, Moderate, High, and Critical alerts"
      maxWidth="2xl"
    >
      <form onSubmit={handleSave} className="space-y-6">
        {/* Academic Regulatory Disclaimer Box */}
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-900 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Project Threshold Notice</span>
            <p className="leading-relaxed text-teal-800">
              Threshold values used by this prototype are configurable demonstration parameters and should be aligned with applicable local statutory regulations (e.g. Central Pollution Control Board / WHO) or specific research standards before real-world deployment.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Safe Ceiling (dB)</span>
            </label>
            <input
              type="number"
              step="1"
              min="30"
              max="100"
              value={safeMax}
              onChange={(e) => setSafeMax(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 block">
              Readings &le; {safeMax} dB = Safe
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Moderate Ceiling (dB)</span>
            </label>
            <input
              type="number"
              step="1"
              min="30"
              max="110"
              value={moderateMax}
              onChange={(e) => setModerateMax(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 block">
              {safeMax} - {moderateMax} dB = Moderate
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>High Ceiling (dB)</span>
            </label>
            <input
              type="number"
              step="1"
              min="40"
              max="120"
              value={highMax}
              onChange={(e) => setHighMax(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 block">
              &gt; {highMax} dB triggers Critical
            </span>
          </div>
        </div>

        {/* Regulatory Reference Standards Table */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Statutory Ambient Standards Reference (CPCB &amp; WHO)
          </h4>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="min-w-full text-xs text-left divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-semibold">
                <tr>
                  <th className="px-3 py-2">Zoning Category</th>
                  <th className="px-3 py-2">Day Limit</th>
                  <th className="px-3 py-2">Night Limit</th>
                  <th className="px-3 py-2">Authority / Law</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {REGULATORY_STANDARDS.map((std, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2 font-medium text-slate-800">{std.zone}</td>
                    <td className="px-3 py-2 font-mono text-teal-700">{std.dayLimitDb} dB(A)</td>
                    <td className="px-3 py-2 font-mono text-slate-600">{std.nightLimitDb} dB(A)</td>
                    <td className="px-3 py-2 text-slate-500 text-[11px]">{std.authority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Thresholds</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
