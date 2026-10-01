import React from 'react';
import {
  Home,
  LayoutDashboard,
  MapPin,
  BarChart3,
  Bell,
  Lightbulb,
  BookOpen,
  GitBranch,
  Info
} from 'lucide-react';

export type PageId =
  | 'home'
  | 'dashboard'
  | 'map'
  | 'analytics'
  | 'alerts'
  | 'recommendations'
  | 'research'
  | 'methodology'
  | 'about';

interface SidebarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  activeAlertCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  activeAlertCount,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'map', label: 'Noise Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <Bell className="w-4 h-4" />,
      badge: activeAlertCount > 0 ? activeAlertCount : undefined
    },
    { id: 'recommendations', label: 'Recommendations', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'research', label: 'Research', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'methodology', label: 'Methodology', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'about', label: 'About Project', icon: <Info className="w-4 h-4" /> }
  ];

  const handleSelect = (id: PageId) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Navigation Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-200 p-4 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between overflow-y-auto`}
      >
        <div>
          <div className="mb-2 px-3 py-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 border border-teal-200/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`${
                        isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        isActive
                          ? 'bg-teal-600 text-white'
                          : 'bg-rose-100 text-rose-700 border border-rose-200'
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

        {/* Bottom Educational Callout */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px] mb-1">
              <span>Academic Prototype</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Environmental Studies (EVS) research project. Demonstrates software architecture without physical sensor attachment.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
