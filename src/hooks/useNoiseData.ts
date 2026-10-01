import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LocationItem,
  NoiseReading,
  NoiseAlert,
  ProjectThresholds,
  DataSource
} from '../types';
import { dataService } from '../services/dataService';

// Helper: True Logarithmic Equivalent Sound Level (Leq) per ISO 1996
function calculateAcousticLeq(levels: number[]): number {
  if (levels.length === 0) return 0;
  const energySum = levels.reduce((acc, db) => acc + Math.pow(10, db / 10), 0);
  const meanEnergy = energySum / levels.length;
  const leq = 10 * Math.log10(meanEnergy);
  return Math.round(leq * 10) / 10;
}

export function useNoiseData() {
  const [locations, setLocations] = useState<LocationItem[]>(() => dataService.getLocations());
  const [readings, setReadings] = useState<NoiseReading[]>(() => dataService.getReadings());
  const [alerts, setAlerts] = useState<NoiseAlert[]>(() => dataService.getAlerts());
  const [thresholds, setThresholds] = useState<ProjectThresholds>(() => dataService.getThresholds());
  const [dataMode, setDataModeState] = useState<'SIMULATION' | 'OBSERVED'>(() => dataService.getDataMode());

  // Refresh state from dataService
  const refresh = useCallback(() => {
    setLocations(dataService.getLocations());
    setReadings(dataService.getReadings());
    setAlerts(dataService.getAlerts());
    setThresholds(dataService.getThresholds());
    setDataModeState(dataService.getDataMode());
  }, []);

  const setDataMode = useCallback((mode: 'SIMULATION' | 'OBSERVED') => {
    dataService.setDataMode(mode);
    setDataModeState(mode);
    refresh();
  }, [refresh]);

  const updateThresholds = useCallback((newThresholds: ProjectThresholds) => {
    dataService.updateThresholds(newThresholds);
    setThresholds(newThresholds);
    refresh();
  }, [refresh]);

  const resetThresholds = useCallback(() => {
    dataService.resetThresholds();
    setThresholds(dataService.getThresholds());
    refresh();
  }, [refresh]);

  const resetAllData = useCallback(() => {
    dataService.resetToDefaultSeed();
    refresh();
  }, [refresh]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    dataService.dismissAlert(alertId);
    setAlerts(dataService.getAlerts());
  }, []);

  // Filtered readings based on current active data mode
  const currentSourceFilter: DataSource | undefined = dataMode === 'SIMULATION' ? 'SIMULATED' : 'OBSERVED';
  
  const activeReadings = useMemo(() => {
    const filtered = readings.filter((r) => r.dataSource === currentSourceFilter);
    // If user switched to observed mode and there are none yet, fallback to all or empty
    return filtered.length > 0 ? filtered : (dataMode === 'SIMULATION' ? readings : []);
  }, [readings, currentSourceFilter, dataMode]);

  // Latest reading map by location
  const latestReadingsMap = useMemo(() => {
    const map = new Map<string, NoiseReading>();
    for (let i = activeReadings.length - 1; i >= 0; i--) {
      const r = activeReadings[i];
      if (!map.has(r.locationId)) {
        map.set(r.locationId, r);
      }
      if (map.size === locations.length) break;
    }
    return map;
  }, [activeReadings, locations.length]);

  // Key KPI Metrics computed over active dataset
  const kpis = useMemo(() => {
    if (activeReadings.length === 0) {
      return {
        currentAvgDb: 0,
        averageTodayDb: 0,
        maxRecordedDb: 0,
        maxRecordedLocation: 'N/A',
        highNoiseEventsCount: 0,
        monitoredCount: locations.length
      };
    }

    // 1. Current spatial equivalent level across active monitored points
    const currentValues = Array.from(latestReadingsMap.values()).map((r) => r.noiseLevelDb);
    const currentAvgDb = calculateAcousticLeq(currentValues);

    // 2. Average Today (Cumulative energy equivalent sound level Leq)
    const today = new Date().toDateString();
    const todayReadings = activeReadings.filter(
      (r) => new Date(r.timestamp).toDateString() === today
    );
    const todayList = todayReadings.length > 0 ? todayReadings : activeReadings.slice(-120);
    const averageTodayDb = calculateAcousticLeq(todayList.map((r) => r.noiseLevelDb));

    // 3. Maximum Recorded
    let maxDb = 0;
    let maxLoc = 'N/A';
    for (const r of activeReadings) {
      if (r.noiseLevelDb > maxDb) {
        maxDb = r.noiseLevelDb;
        maxLoc = r.locationName || 'Monitored Point';
      }
    }

    // 4. High Noise Events (readings exceeding thresholds.moderateMax)
    const highEventsCount = activeReadings.filter(
      (r) => r.noiseLevelDb > thresholds.moderateMax
    ).length;

    return {
      currentAvgDb,
      averageTodayDb,
      maxRecordedDb: maxDb,
      maxRecordedLocation: maxLoc,
      highNoiseEventsCount: highEventsCount,
      monitoredCount: locations.length
    };
  }, [activeReadings, latestReadingsMap, locations.length, thresholds.moderateMax]);

  return {
    locations,
    readings: activeReadings,
    allReadings: readings,
    alerts,
    thresholds,
    dataMode,
    setDataMode,
    latestReadingsMap,
    kpis,
    updateThresholds,
    resetThresholds,
    resetAllData,
    acknowledgeAlert,
    refresh
  };
}
