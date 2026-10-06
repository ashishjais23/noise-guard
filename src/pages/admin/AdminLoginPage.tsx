import React, { useState } from 'react';
import {
  Lock,
  Shield,
  Volume2,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Building2
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { AdminUser } from '../../types';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  onExitToPublic: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onExitToPublic
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('noiseguard2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await dataService.loginAdmin(username, password);
      setIsLoading(false);

      if (result.success) {
        const user = dataService.getAdminUser();
        if (user) {
          onLoginSuccess(user);
        }
      } else {
        setErrorMsg(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('Authentication error. Please check credentials and try again.');
    }
  };

  const handleQuickFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-teal-600 dark:bg-teal-500 items-center justify-center text-white shadow-md shadow-teal-600/30">
          <Volume2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          NoiseGuard Administration
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Municipal Acoustic Surveillance &amp; Technical Management Gateway
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Admin Username / Officer ID
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or officer"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span>Authenticating officer...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Secure Officer Login</span>
                </>
              )}
            </button>
          </form>

          {/* Preset Demo Credentials for Quick Testing */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Authorized Test Credentials (Click to fill)
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'noiseguard2026')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors"
              >
                <div className="font-bold text-slate-900 dark:text-white">Admin</div>
                <div className="text-[9px] text-slate-400">Super Admin</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('officer', 'cpcb2026')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors"
              >
                <div className="font-bold text-slate-900 dark:text-white">Officer</div>
                <div className="text-[9px] text-slate-400">CPCB Officer</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('researcher', 'acoustic2026')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors"
              >
                <div className="font-bold text-slate-900 dark:text-white">Researcher</div>
                <div className="text-[9px] text-slate-400">Acoustic Sci</div>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onExitToPublic}
              className="text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors"
            >
              ← Return to Citizen Public Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
