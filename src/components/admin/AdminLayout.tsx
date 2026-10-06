import React, { useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  MapPin,
  FileSpreadsheet,
  Bell,
  Cpu,
  Building2,
  BarChart3,
  LogOut,
  Sun,
  Moon,
  ExternalLink,
  Shield,
  Menu,
  X,
  Volume2
} from 'lucide-react';
import { AdminUser } from '../../types';
import { useTheme } from '../../hooks/useTheme';

export type AdminPageId =
  | 'dashboard'
  | 'monitoring'
  | 'map'
  | 'reports'
  | 'alerts'
  | 'sensors'
  | 'cities'
  | 'analytics';

interface AdminLayoutProps {
  adminUser: AdminUser;
  activePage: AdminPageId;
  setActivePage: (page: AdminPageId) => void;
  onLogout: () => void;
  onExitToPublic: () => void;
  pendingReportsCount: number;
  activeAlertsCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  adminUser,
  activePage,
  setActivePage,
  onLogout,
  onExitToPublic,
  pendingReportsCount,
  activeAlertsCount,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Define all available navigation tabs
  const allNavItems = [
    { id: 'dashboard' as AdminPageId, label: 'Overview Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'monitoring' as AdminPageId, label: 'Live Sensor Telemetry', icon: <Activity className="w-4 h-4" /> },
    { id: 'map' as AdminPageId, label: 'Advanced GIS Map', icon: <MapPin className="w-4 h-4" /> },
    {
      id: 'reports' as AdminPageId,
      label: 'Citizen Reports',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined
    },
    {
      id: 'alerts' as AdminPageId,
      label: 'Threshold Alerts',
      icon: <Bell className="w-4 h-4" />,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      badgeColor: 'rose'
    },
    { id: 'sensors' as AdminPageId, label: 'Sensor Network', icon: <Cpu className="w-4 h-4" /> },
    { id: 'cities' as AdminPageId, label: 'City Management', icon: <Building2 className="w-4 h-4" /> },
    { id: 'analytics' as AdminPageId, label: 'Analytics & Comparison', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  // RBAC Navigation filtering
  const navItems = allNavItems.filter((item) => {
    if (adminUser.role === 'Super Admin') return true;
    if (adminUser.role === 'Environmental Officer') {
      return ['dashboard', 'monitoring', 'map', 'reports', 'alerts'].includes(item.id);
    }
    if (adminUser.role === 'Acoustic Researcher') {
      return ['dashboard', 'monitoring', 'map', 'analytics', 'reports'].includes(item.id);
    }
    return true;
  });

  const handleNavSelect = (id: AdminPageId) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Brand + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-teal-600 flex items-center justify-center text-white shadow-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                      NoiseGuard Admin
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      Authority Console
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block -mt-0.5">
                    Municipal Environmental Surveillance
                  </span>
                </div>
              </div>
            </div>

            {/* Right Admin Controls & User Info */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* User Identity Chip */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <div className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[11px] text-white ${
                  adminUser.role === 'Super Admin'
                    ? 'bg-purple-600'
                    : adminUser.role === 'Environmental Officer'
                    ? 'bg-emerald-600'
                    : 'bg-blue-600'
                }`}>
                  {adminUser.name.charAt(0)}
                </div>
                <div className="text-left">
                  <span className="font-bold text-slate-900 dark:text-white block leading-tight">
                    {adminUser.name}
                  </span>
                  <span className={`text-[10px] font-bold block leading-tight ${
                    adminUser.role === 'Super Admin'
                      ? 'text-purple-600 dark:text-purple-400'
                      : adminUser.role === 'Environmental Officer'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {adminUser.role}
                  </span>
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {/* Exit to Public Portal */}
              <button
                onClick={onExitToPublic}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="View public website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Public Portal</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-colors"
                title="Sign out of admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Body with Left Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Fixed Navigation Sidebar */}
        <aside
          className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } flex flex-col justify-between overflow-y-auto`}
        >
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Control Center
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-slate-900 dark:bg-teal-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-teal-400 dark:text-white' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.badgeColor === 'rose'
                            ? 'bg-rose-500 text-white'
                            : 'bg-teal-500 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-700 dark:text-slate-300">CPCB Acoustic Network</div>
            <p className="text-[10px] leading-tight text-slate-500">
              System health: 99.8% Online. Calibration compliant.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
