import {
  LocationItem,
  NoiseReading,
  NoiseAlert,
  ProjectThresholds,
  DataSource
} from '../types';
import { INITIAL_LOCATIONS } from '../data/initialLocations';
import { generateSeedHistoricalReadings, SAMPLE_OBSERVED_READINGS } from '../data/seedReadings';
import { DEFAULT_THRESHOLDS } from '../data/defaultThresholds';
import { evaluateReadingForAlert } from './alertEngine';

const STORAGE_KEYS = {
  LOCATIONS: 'noiseguard_locations_v2',
  READINGS: 'noiseguard_readings_v2',
  ALERTS: 'noiseguard_alerts_v2',
  THRESHOLDS: 'noiseguard_thresholds_v2',
  DATA_MODE: 'noiseguard_datamode_v2'
};

class DataService {
  private locations: LocationItem[] = [];
  private readings: NoiseReading[] = [];
  private alerts: NoiseAlert[] = [];
  private thresholds: ProjectThresholds = DEFAULT_THRESHOLDS;
  private dataMode: 'SIMULATION' | 'OBSERVED' = 'SIMULATION';

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // 1. Locations
    const savedLocs = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    if (savedLocs) {
      try {
        this.locations = JSON.parse(savedLocs);
      } catch {
        this.locations = INITIAL_LOCATIONS;
      }
    } else {
      this.locations = INITIAL_LOCATIONS;
      this.saveLocations();
    }

    // 2. Thresholds
    const savedThresholds = localStorage.getItem(STORAGE_KEYS.THRESHOLDS);
    if (savedThresholds) {
      try {
        this.thresholds = JSON.parse(savedThresholds);
      } catch {
        this.thresholds = DEFAULT_THRESHOLDS;
      }
    }

    // 3. Readings
    const savedReadings = localStorage.getItem(STORAGE_KEYS.READINGS);
    if (savedReadings) {
      try {
        const parsed = JSON.parse(savedReadings);
        if (Array.isArray(parsed) && parsed.length >= 200) {
          this.readings = parsed;
        } else {
          this.readings = generateSeedHistoricalReadings();
          this.saveReadings();
        }
      } catch {
        this.readings = generateSeedHistoricalReadings();
        this.saveReadings();
      }
    } else {
      this.readings = generateSeedHistoricalReadings();
      this.saveReadings();
    }

    // 4. Alerts
    const savedAlerts = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (savedAlerts) {
      try {
        this.alerts = JSON.parse(savedAlerts);
      } catch {
        this.generateInitialAlerts();
      }
    } else {
      this.generateInitialAlerts();
    }
  }

  private generateInitialAlerts(): void {
    this.alerts = [];
    // Evaluate recent seed readings against thresholds
    const recentReadings = this.readings.slice(-60);
    for (const r of recentReadings) {
      const alert = evaluateReadingForAlert(r, this.thresholds, this.alerts);
      if (alert) {
        const existingIdx = this.alerts.findIndex((a) => a.id === alert.id);
        if (existingIdx >= 0) {
          this.alerts[existingIdx] = alert;
        } else {
          this.alerts.unshift(alert);
        }
      }
    }
    // Limit to latest 30 alerts
    this.alerts = this.alerts.slice(0, 30);
    this.saveAlerts();
  }

  private saveLocations(): void {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(this.locations));
  }

  private saveReadings(): void {
    // Keep max 1500 readings in localStorage to prevent storage bloat
    if (this.readings.length > 1500) {
      this.readings = this.readings.slice(this.readings.length - 1500);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify(this.readings));
    } catch {
      // Storage quota safety
      this.readings = this.readings.slice(this.readings.length - 500);
      localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify(this.readings));
    }
  }

  private saveAlerts(): void {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(this.alerts));
  }

  public getLocations(): LocationItem[] {
    return [...this.locations];
  }

  public getThresholds(): ProjectThresholds {
    return { ...this.thresholds };
  }

  public updateThresholds(newThresholds: ProjectThresholds): void {
    this.thresholds = newThresholds;
    localStorage.setItem(STORAGE_KEYS.THRESHOLDS, JSON.stringify(newThresholds));
  }

  public resetThresholds(): void {
    this.thresholds = DEFAULT_THRESHOLDS;
    localStorage.setItem(STORAGE_KEYS.THRESHOLDS, JSON.stringify(DEFAULT_THRESHOLDS));
  }

  public getDataMode(): 'SIMULATION' | 'OBSERVED' {
    return this.dataMode;
  }

  public setDataMode(mode: 'SIMULATION' | 'OBSERVED'): void {
    this.dataMode = mode;
    localStorage.setItem(STORAGE_KEYS.DATA_MODE, mode);
  }

  public getReadings(sourceFilter?: DataSource): NoiseReading[] {
    if (sourceFilter) {
      return this.readings.filter((r) => r.dataSource === sourceFilter);
    }
    return [...this.readings];
  }

  public getLatestReadingsPerLocation(source?: DataSource): Map<string, NoiseReading> {
    const map = new Map<string, NoiseReading>();
    const list = source ? this.readings.filter((r) => r.dataSource === source) : this.readings;

    // Iterate backwards
    for (let i = list.length - 1; i >= 0; i--) {
      const r = list[i];
      if (!map.has(r.locationId)) {
        map.set(r.locationId, r);
      }
      if (map.size === this.locations.length) break;
    }
    return map;
  }

  public addReading(reading: NoiseReading): NoiseAlert | null {
    this.readings.push(reading);
    this.saveReadings();

    // Check alert
    const evaluatedAlert = evaluateReadingForAlert(reading, this.thresholds, this.alerts);
    if (evaluatedAlert) {
      const existingIndex = this.alerts.findIndex((a) => a.id === evaluatedAlert.id);
      if (existingIndex >= 0) {
        this.alerts[existingIndex] = evaluatedAlert;
      } else {
        this.alerts.unshift(evaluatedAlert);
      }
      this.alerts = this.alerts.slice(0, 50);
      this.saveAlerts();
      return evaluatedAlert;
    }
    return null;
  }

  public getAlerts(): NoiseAlert[] {
    return [...this.alerts];
  }

  public dismissAlert(alertId: string): void {
    this.alerts = this.alerts.map((a) =>
      a.id === alertId ? { ...a, status: 'Acknowledged' } : a
    );
    this.saveAlerts();
  }

  public clearAllAlerts(): void {
    this.alerts = [];
    this.saveAlerts();
  }

  public resetToDefaultSeed(): void {
    this.locations = INITIAL_LOCATIONS;
    this.readings = generateSeedHistoricalReadings();
    this.thresholds = DEFAULT_THRESHOLDS;
    this.generateInitialAlerts();
    this.saveLocations();
    this.saveReadings();
  }

  public importObservedReadings(newReadings: NoiseReading[]): { addedCount: number } {
    this.readings.push(...newReadings);
    this.readings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    this.saveReadings();

    // Also evaluate any alerts for the newly imported data
    newReadings.forEach((r) => {
      const alert = evaluateReadingForAlert(r, this.thresholds, this.alerts);
      if (alert) {
        const existingIdx = this.alerts.findIndex((a) => a.id === alert.id);
        if (existingIdx >= 0) {
          this.alerts[existingIdx] = alert;
        } else {
          this.alerts.unshift(alert);
        }
      }
    });
    this.alerts = this.alerts.slice(0, 50);
    this.saveAlerts();

    return { addedCount: newReadings.length };
  }

  public loadSampleObservedData(): void {
    this.importObservedReadings(SAMPLE_OBSERVED_READINGS);
  }
}

export const dataService = new DataService();
