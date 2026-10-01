import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, PageId } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { NoiseMapPage } from './pages/NoiseMapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AlertsPage } from './pages/AlertsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ResearchPage } from './pages/ResearchPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { AboutProjectPage } from './pages/AboutProjectPage';
import { ThresholdModal } from './components/alerts/ThresholdModal';
import { CsvImportModal } from './components/import/CsvImportModal';
import { useNoiseData } from './hooks/useNoiseData';
import { useSimulation } from './hooks/useSimulation';
import { LocationItem } from './types';

export function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [thresholdModalOpen, setThresholdModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  // Core Noise Data State
  const {
    locations,
    readings,
    allReadings,
    alerts,
    thresholds,
    dataMode,
    setDataMode,
    latestReadingsMap,
    kpis,
    updateThresholds,
    resetThresholds,
    acknowledgeAlert,
    refresh
  } = useNoiseData();

  // Stochastic Real-time Simulation Engine Hook
  const simulation = useSimulation(
    locations,
    refresh,
    dataMode === 'SIMULATION'
  );

  const activeAlertCount = alerts.filter((a) => a.status === 'Active').length;

  const handleSelectLocationForMap = (loc: LocationItem) => {
    setSelectedLocationId(loc.id);
    setActivePage('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearSelectedLocation = () => {
    setSelectedLocationId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Fixed Header */}
      <Navbar
        dataMode={dataMode}
        setDataMode={setDataMode}
        onOpenThresholdModal={() => setThresholdModalOpen(true)}
        onOpenCsvModal={() => setCsvModalOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isSimRunning={simulation.isRunning}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Responsive Navigation Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          activeAlertCount={activeAlertCount}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Main Workspace Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 min-w-0">
          {activePage === 'home' && (
            <HomePage
              setActivePage={setActivePage}
              locations={locations}
              latestReadingsMap={latestReadingsMap}
              thresholds={thresholds}
            />
          )}

          {activePage === 'dashboard' && (
            <DashboardPage
              locations={locations}
              readings={readings}
              latestReadingsMap={latestReadingsMap}
              alerts={alerts}
              thresholds={thresholds}
              dataMode={dataMode}
              kpis={kpis}
              simulation={simulation}
              setActivePage={setActivePage}
              onSelectLocationForMap={handleSelectLocationForMap}
              onAcknowledgeAlert={acknowledgeAlert}
            />
          )}

          {activePage === 'map' && (
            <NoiseMapPage
              locations={locations}
              latestReadingsMap={latestReadingsMap}
              allReadings={allReadings}
              thresholds={thresholds}
              setActivePage={setActivePage}
              selectedLocationId={selectedLocationId}
              onClearSelectedLocation={handleClearSelectedLocation}
            />
          )}

          {activePage === 'analytics' && (
            <AnalyticsPage
              locations={locations}
              readings={readings}
              thresholds={thresholds}
              dataMode={dataMode}
            />
          )}

          {activePage === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              locations={locations}
              thresholds={thresholds}
              onOpenThresholdModal={() => setThresholdModalOpen(true)}
              onAcknowledgeAlert={acknowledgeAlert}
              onSelectLocationForMap={handleSelectLocationForMap}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'recommendations' && <RecommendationsPage />}

          {activePage === 'research' && <ResearchPage />}

          {activePage === 'methodology' && <MethodologyPage />}

          {activePage === 'about' && <AboutProjectPage />}

          {/* Academic Footer */}
          <Footer setActivePage={setActivePage} />
        </main>
      </div>

      {/* Thresholds Configuration Modal */}
      <ThresholdModal
        isOpen={thresholdModalOpen}
        onClose={() => setThresholdModalOpen(false)}
        thresholds={thresholds}
        onSave={updateThresholds}
        onReset={resetThresholds}
      />

      {/* CSV File Import Modal */}
      <CsvImportModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onImportComplete={() => {
          refresh();
          setDataMode('OBSERVED');
        }}
      />
    </div>
  );
}

export default App;
