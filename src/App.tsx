import React, { useState, useEffect, useCallback } from 'react';
import { PublicHeader, PublicPageId } from './components/layout/PublicHeader';
import { PublicFooter } from './components/layout/PublicFooter';
import { PublicHomePage } from './pages/public/PublicHomePage';
import { LiveMonitorPage } from './pages/public/LiveMonitorPage';
import { PublicNoiseMapPage } from './pages/public/PublicNoiseMapPage';
import { ReportNoisePage } from './pages/public/ReportNoisePage';
import { MyReportsPage } from './pages/public/MyReportsPage';
import { LearnPage } from './pages/public/LearnPage';

// Admin Portal imports
import { AdminLayout, AdminPageId } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLiveMonitoringPage } from './pages/admin/AdminLiveMonitoringPage';
import { AdminAdvancedMapPage } from './pages/admin/AdminAdvancedMapPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminAlertsPage } from './pages/admin/AdminAlertsPage';
import { AdminSensorsPage } from './pages/admin/AdminSensorsPage';
import { AdminCitiesPage } from './pages/admin/AdminCitiesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

import { dataService } from './services/dataService';
import {
  CityItem,
  SensorItem,
  CitizenReport,
  NoiseAlert,
  ProjectThresholds,
  AdminUser,
  ReportStatus
} from './types';

export function App() {
  // Navigation & View Mode State
  const [portalMode, setPortalMode] = useState<'public' | 'admin'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    return 'public';
  });

  const [publicPage, setPublicPage] = useState<PublicPageId>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '');
      if (['monitor', 'map', 'report', 'my-reports', 'learn'].includes(path)) {
        return path as PublicPageId;
      }
    }
    return 'home';
  });

  const [adminPage, setAdminPage] = useState<AdminPageId>('dashboard');

  // Core Data States from dataService
  const [cities, setCities] = useState<CityItem[]>(() => dataService.getCities());
  const [sensors, setSensors] = useState<SensorItem[]>(() => dataService.getSensors());
  const [reports, setReports] = useState<CitizenReport[]>(() => dataService.getReports());
  const [alerts, setAlerts] = useState<NoiseAlert[]>(() => dataService.getAlerts());
  const [thresholds, setThresholds] = useState<ProjectThresholds>(() => dataService.getThresholds());
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => dataService.getAdminUser());

  // Selected city across public views
  const [selectedCity, setSelectedCity] = useState<CityItem>(() => {
    const list = dataService.getCities();
    return list[0];
  });

  // Synchronize state with dataService
  const refreshData = useCallback(() => {
    setCities(dataService.getCities());
    setSensors(dataService.getSensors());
    setReports(dataService.getReports());
    setAlerts(dataService.getAlerts());
    setThresholds(dataService.getThresholds());
    setAdminUser(dataService.getAdminUser());
  }, []);

  // Real-time sensor telemetry subscription
  useEffect(() => {
    const unsubscribe = dataService.subscribeToSensors((updatedSensors) => {
      setSensors(updatedSensors);
    });
    return () => unsubscribe();
  }, []);

  // Handle URL history state
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setPortalMode('admin');
      } else {
        setPortalMode('public');
        const cleanPath = path.replace(/^\//, '');
        if (['monitor', 'map', 'report', 'my-reports', 'learn'].includes(cleanPath)) {
          setPublicPage(cleanPath as PublicPageId);
        } else {
          setPublicPage('home');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Public Navigation change handler
  const handleSetPublicPage = (page: PublicPageId) => {
    setPublicPage(page);
    const targetUrl = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
  };

  // Switch to Admin Portal
  const handleNavigateToAdmin = () => {
    setPortalMode('admin');
    if (!window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Exit to Public Portal
  const handleExitToPublic = () => {
    setPortalMode('public');
    setPublicPage('home');
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Login success
  const handleAdminLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    refreshData();
  };

  // Admin Logout
  const handleAdminLogout = () => {
    dataService.logoutAdmin();
    setAdminUser(null);
    refreshData();
  };

  // Data update handlers
  const handleUpdateReportStatus = (
    reportId: string,
    status: ReportStatus,
    resolutionNotes?: string,
    rejectionReason?: string,
    assignedTo?: string
  ) => {
    dataService.updateReportStatus(reportId, status, resolutionNotes, rejectionReason, assignedTo);
    refreshData();
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    dataService.acknowledgeAlert(alertId);
    refreshData();
  };

  const handleResolveAlert = (alertId: string) => {
    dataService.resolveAlert(alertId);
    refreshData();
  };

  const handleUpdateThresholds = (newThresholds: ProjectThresholds) => {
    dataService.updateThresholds(newThresholds);
    refreshData();
  };

  const handleResetThresholds = () => {
    dataService.resetThresholds();
    refreshData();
  };

  const handleAddSensor = (sensorData: Omit<SensorItem, 'id' | 'lastUpdated'>) => {
    dataService.addSensor(sensorData);
    refreshData();
  };

  const handleUpdateSensor = (sensorId: string, updates: Partial<SensorItem>) => {
    dataService.updateSensor(sensorId, updates);
    refreshData();
  };

  const handleDeleteSensor = (sensorId: string) => {
    dataService.deleteSensor(sensorId);
    refreshData();
  };

  const handleAddCity = (cityData: Omit<CityItem, 'id'>) => {
    dataService.addCity(cityData);
    refreshData();
  };

  const handleToggleCityStatus = (cityId: string) => {
    dataService.toggleCityStatus(cityId);
    refreshData();
  };

  // ==========================================
  // VIEW MODE: ADMIN PORTAL (/admin)
  // ==========================================
  if (portalMode === 'admin') {
    // Check authentication
    if (!adminUser) {
      return (
        <AdminLoginPage
          onLoginSuccess={handleAdminLoginSuccess}
          onExitToPublic={handleExitToPublic}
        />
      );
    }

    const pendingReportsCount = reports.filter(
      (r) => r.status === 'Submitted' || r.status === 'Under Review'
    ).length;
    const activeAlertsCount = alerts.filter((a) => a.status === 'Active').length;

    return (
      <AdminLayout
        adminUser={adminUser}
        activePage={adminPage}
        setActivePage={setAdminPage}
        onLogout={handleAdminLogout}
        onExitToPublic={handleExitToPublic}
        pendingReportsCount={pendingReportsCount}
        activeAlertsCount={activeAlertsCount}
      >
        {adminPage === 'dashboard' && (
          <AdminDashboardPage
            sensors={sensors}
            reports={reports}
            alerts={alerts}
            cities={cities}
            adminUser={adminUser}
            setActiveAdminPage={setAdminPage}
            onAcknowledgeAlert={handleAcknowledgeAlert}
          />
        )}

        {adminPage === 'monitoring' && (
          <AdminLiveMonitoringPage
            sensors={sensors}
            cities={cities}
            onUpdateSensor={handleUpdateSensor}
          />
        )}

        {adminPage === 'map' && (
          <AdminAdvancedMapPage
            sensors={sensors}
            cities={cities}
          />
        )}

        {adminPage === 'reports' && (
          <AdminReportsPage
            reports={reports}
            onUpdateReportStatus={handleUpdateReportStatus}
          />
        )}

        {adminPage === 'alerts' && (
          <AdminAlertsPage
            alerts={alerts}
            thresholds={thresholds}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onResolveAlert={handleResolveAlert}
            onUpdateThresholds={handleUpdateThresholds}
            onResetThresholds={handleResetThresholds}
          />
        )}

        {adminPage === 'sensors' && (
          <AdminSensorsPage
            sensors={sensors}
            cities={cities}
            onAddSensor={handleAddSensor}
            onUpdateSensor={handleUpdateSensor}
            onDeleteSensor={handleDeleteSensor}
          />
        )}

        {adminPage === 'cities' && (
          <AdminCitiesPage
            cities={cities}
            sensors={sensors}
            onAddCity={handleAddCity}
            onToggleCityStatus={handleToggleCityStatus}
          />
        )}

        {adminPage === 'analytics' && (
          <AdminAnalyticsPage
            cities={cities}
            sensors={sensors}
            reports={reports}
            alerts={alerts}
          />
        )}
      </AdminLayout>
    );
  }

  // ==========================================
  // VIEW MODE: PUBLIC CITIZEN PORTAL
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Public Header */}
      <PublicHeader
        activePage={publicPage}
        setActivePage={handleSetPublicPage}
        onNavigateToAdmin={handleNavigateToAdmin}
        myReportsCount={reports.length}
      />

      {/* Main Public Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {publicPage === 'home' && (
          <PublicHomePage
            setActivePage={handleSetPublicPage}
            cities={cities}
            sensors={sensors}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
        )}

        {publicPage === 'monitor' && <LiveMonitorPage />}

        {publicPage === 'map' && (
          <PublicNoiseMapPage
            cities={cities}
            sensors={sensors}
            alerts={alerts}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
        )}

        {publicPage === 'report' && (
          <ReportNoisePage
            cities={cities}
            selectedCity={selectedCity}
            setActivePage={handleSetPublicPage}
            onReportSubmitted={() => refreshData()}
          />
        )}

        {publicPage === 'my-reports' && (
          <MyReportsPage
            reports={reports}
            setActivePage={handleSetPublicPage}
          />
        )}

        {publicPage === 'learn' && <LearnPage />}
      </main>

      {/* Public Civic Footer */}
      <PublicFooter
        setActivePage={handleSetPublicPage}
        onNavigateToAdmin={handleNavigateToAdmin}
      />
    </div>
  );
}

export default App;
