import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  MapPin,
  FilePlus2,
  Inbox,
  BookOpen,
  Sun,
  Moon,
  Menu,
  X,
  Lock,
  Home
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export type PublicPageId =
  | 'home'
  | 'monitor'
  | 'map'
  | 'report'
  | 'my-reports'
  | 'learn';

interface PublicHeaderProps {
  activePage: PublicPageId;
  setActivePage: (page: PublicPageId) => void;
  onNavigateToAdmin: () => void;
  myReportsCount?: number;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activePage,
  setActivePage,
  onNavigateToAdmin,
  myReportsCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'home' as PublicPageId, label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'monitor' as PublicPageId, label: 'Live Monitor', icon: <Mic className="w-4 h-4" /> },
    { id: 'map' as PublicPageId, label: 'Noise Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'report' as PublicPageId, label: 'Report Noise', icon: <FilePlus2 className="w-4 h-4" /> },
    {
      id: 'my-reports' as PublicPageId,
      label: 'My Reports',
      icon: <Inbox className="w-4 h-4" />,
      badge: myReportsCount > 0 ? myReportsCount : undefined
    },
    { id: 'learn' as PublicPageId, label: 'Learn', icon: <BookOpen className="w-4 h-4" /> }
  ];

  const handleNavClick = (id: PublicPageId) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white shadow-sm shadow-teal-500/30 group-hover:bg-teal-700 transition-colors">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-lg">
                  NoiseGuard
                </span>
                <span className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold block leading-none">
                  Civic Noise Platform
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Utilities & Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle light/dark mode"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Admin Portal Gateway Button */}
            <button
              onClick={onNavigateToAdmin}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
              title="Access administrative portal for environmental officers"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Admin Portal</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-600 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAdmin();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              <span>Admin Portal Access</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
