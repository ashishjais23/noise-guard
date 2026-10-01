import { useState, useEffect, useRef, useCallback } from 'react';
import { LocationItem } from '../types';
import { calculateNextSimulatedReading } from '../services/simulationEngine';
import { dataService } from '../services/dataService';

export function useSimulation(
  locations: LocationItem[],
  onNewReadingAdded?: () => void,
  isSimulationModeActive: boolean = true
) {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [tickIntervalMs, setTickIntervalMs] = useState<number>(3000); // 3 seconds default
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState<number>(0);

  const timerRef = useRef<number | null>(null);
  const secondsTimerRef = useRef<number | null>(null);

  // Single simulation step execution
  const executeSimulationStep = useCallback(() => {
    if (locations.length === 0) return;

    // Pick 2 to 4 locations each tick to simulate natural staggered reporting
    const countToUpdate = Math.min(locations.length, Math.floor(Math.random() * 3) + 2);
    // Shuffle and pick
    const shuffled = [...locations].sort(() => 0.5 - Math.random()).slice(0, countToUpdate);

    const latestMap = dataService.getLatestReadingsPerLocation('SIMULATED');
    const now = new Date();

    shuffled.forEach((loc) => {
      const prev = latestMap.get(loc.id);
      const currentDb = prev ? prev.noiseLevelDb : loc.baselineDb;
      const nextReading = calculateNextSimulatedReading(loc, currentDb, now);
      dataService.addReading(nextReading);
    });

    setLastUpdated(now);
    setSecondsAgo(0);

    if (onNewReadingAdded) {
      onNewReadingAdded();
    }
  }, [locations, onNewReadingAdded]);

  // Main simulation ticker
  useEffect(() => {
    if (!isRunning || !isSimulationModeActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      executeSimulationStep();
    }, tickIntervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, tickIntervalMs, isSimulationModeActive, executeSimulationStep]);

  // Second-counter for "Last updated: X seconds ago"
  useEffect(() => {
    secondsTimerRef.current = window.setInterval(() => {
      const diffSec = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      setSecondsAgo(diffSec);
    }, 1000);

    return () => {
      if (secondsTimerRef.current) clearInterval(secondsTimerRef.current);
    };
  }, [lastUpdated]);

  const pauseSimulation = () => setIsRunning(false);
  const resumeSimulation = () => setIsRunning(true);
  const toggleSimulation = () => setIsRunning((prev) => !prev);
  
  const resetSimulation = () => {
    dataService.resetToDefaultSeed();
    setLastUpdated(new Date());
    setSecondsAgo(0);
    if (onNewReadingAdded) {
      onNewReadingAdded();
    }
  };

  const stepOnce = () => {
    executeSimulationStep();
  };

  return {
    isRunning,
    tickIntervalMs,
    setTickIntervalMs,
    lastUpdated,
    secondsAgo,
    pauseSimulation,
    resumeSimulation,
    toggleSimulation,
    resetSimulation,
    stepOnce
  };
}
