import {
  LocationItem,
  NoiseReading,
  NoiseAlert,
  ProjectThresholds,
  DataSource,
  CityItem,
  SensorItem,
  CitizenReport,
  AdminUser,
  ReportStatus
} from '../types';
import { INITIAL_LOCATIONS } from '../data/initialLocations';
import { INITIAL_CITIES, INITIAL_SENSORS, INITIAL_CITIZEN_REPORTS } from '../data/citiesAndSensors';
import { generateSeedHistoricalReadings } from '../data/seedReadings';
import { DEFAULT_THRESHOLDS } from '../data/defaultThresholds';
import { evaluateReadingForAlert } from './alertEngine';

const STORAGE_KEYS = {
  LOCATIONS: 'noiseguard_locations_v2',
  READINGS: 'noiseguard_readings_v2',
  ALERTS: 'noiseguard_alerts_v2',
  THRESHOLDS: 'noiseguard_thresholds_v2',
  CITIES: 'noiseguard_cities_v2',
  SENSORS: 'noiseguard_sensors_v2',
  REPORTS: 'noiseguard_reports_v2',
  ADMIN_USER: 'noiseguard_admin_user_v2',
  THEME: 'noiseguard_theme_v2'
};

const PASSWORD_SALT = 'ng_salt_evs_2026';

/**
 * Computes SHA-256 hash using Web Crypto API
 */
async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Deterministic fallback for non-secure test contexts
  let hash = 0;
  const str = password + salt;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
}

// Pre-computed salted SHA-256 hashes for authorized administrative personas
// (Zero plaintext passwords in source code)
const ADMIN_CREDENTIAL_HASHES: Record<
  string,
  { hash: string; name: string; role: AdminUser['role'] }
> = {
  admin: {
    hash: '194c1850c4961d8c330cea76e036516a0bb694955a5b0dd0c62e4b5a26790aa8',
    name: 'Dr. Rajesh Verma',
    role: 'Super Admin'
  },
  officer: {
    hash: '9e4f5adbf79223cad05d360b30d03d47e22f5ab11d978d40b78f768951e242f9',
    name: 'Priya Sundaram',
    role: 'Environmental Officer'
  },
  researcher: {
    hash: 'bef8b118cad03bde6079db48dad53e1c4ed4e906affd27418f6495510aa11bac',
    name: 'Dr. Kevin Roy',
    role: 'Acoustic Researcher'
  }
};

class DataService {
  private cities: CityItem[] = [];
  private sensors: SensorItem[] = [];
  private reports: CitizenReport[] = [];
  private locations: LocationItem[] = [];
  private readings: NoiseReading[] = [];
  private alerts: NoiseAlert[] = [];
  private thresholds: ProjectThresholds = DEFAULT_THRESHOLDS;
  private adminUser: AdminUser | null = null;
  private sensorListeners: Set<(sensors: SensorItem[]) => void> = new Set();
  private telemetryTimer: any = null;

  constructor() {
    this.initializeData();
    this.startTelemetryLoop();
  }

  private initializeData(): void {
    // 1. Cities
    const savedCities = localStorage.getItem(STORAGE_KEYS.CITIES);
    if (savedCities) {
      try {
        this.cities = JSON.parse(savedCities);
      } catch {
        this.cities = INITIAL_CITIES;
      }
    } else {
      this.cities = INITIAL_CITIES;
      this.saveCities();
    }

    // 2. Sensors
    const savedSensors = localStorage.getItem(STORAGE_KEYS.SENSORS);
    if (savedSensors) {
      try {
        this.sensors = JSON.parse(savedSensors);
      } catch {
        this.sensors = INITIAL_SENSORS;
      }
    } else {
      this.sensors = INITIAL_SENSORS;
      this.saveSensors();
    }

    // 3. Citizen Reports
    const savedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (savedReports) {
      try {
        this.reports = JSON.parse(savedReports);
      } catch {
        this.reports = INITIAL_CITIZEN_REPORTS;
      }
    } else {
      this.reports = INITIAL_CITIZEN_REPORTS;
      this.saveReports();
    }

    // 4. Locations
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

    // 5. Thresholds
    const savedThresholds = localStorage.getItem(STORAGE_KEYS.THRESHOLDS);
    if (savedThresholds) {
      try {
        this.thresholds = JSON.parse(savedThresholds);
      } catch {
        this.thresholds = DEFAULT_THRESHOLDS;
      }
    }

    // 6. Readings
    const savedReadings = localStorage.getItem(STORAGE_KEYS.READINGS);
    if (savedReadings) {
      try {
        const parsed = JSON.parse(savedReadings);
        if (Array.isArray(parsed) && parsed.length >= 100) {
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

    // 7. Alerts
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

    // 8. Admin User Session
    const savedAdmin = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
    if (savedAdmin) {
      try {
        this.adminUser = JSON.parse(savedAdmin);
      } catch {
        this.adminUser = null;
      }
    }
  }

  private saveCities(): void {
    localStorage.setItem(STORAGE_KEYS.CITIES, JSON.stringify(this.cities));
  }

  private saveSensors(): void {
    localStorage.setItem(STORAGE_KEYS.SENSORS, JSON.stringify(this.sensors));
  }

  private saveReports(): void {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.reports));
  }

  private saveLocations(): void {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(this.locations));
  }

  private saveReadings(): void {
    localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify(this.readings));
  }

  private saveAlerts(): void {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(this.alerts));
  }

  private generateInitialAlerts(): void {
    this.alerts = [
      {
        id: 'alert-initial-01',
        sensorId: 'NG-DEL-02',
        locationId: 'del-loc-02',
        locationName: 'Connaught Place Outer Circle',
        cityName: 'Delhi',
        noiseLevelDb: 86.4,
        thresholdDb: 75,
        severity: 'Critical',
        durationMinutes: 45,
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        status: 'Active',
        dataSource: 'SENSOR'
      },
      {
        id: 'alert-initial-02',
        sensorId: 'NG-MUM-01',
        locationId: 'mum-loc-01',
        locationName: 'BKC Business Corridor Junction',
        cityName: 'Mumbai',
        noiseLevelDb: 81.2,
        thresholdDb: 75,
        severity: 'High',
        durationMinutes: 20,
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: 'Active',
        dataSource: 'SENSOR'
      },
      {
        id: 'alert-initial-03',
        sensorId: 'NG-CHE-02',
        locationId: 'che-loc-02',
        locationName: 'Anna Salai Gemini Flyover',
        cityName: 'Chennai',
        noiseLevelDb: 79.5,
        thresholdDb: 75,
        severity: 'High',
        durationMinutes: 12,
        timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
        status: 'Acknowledged',
        dataSource: 'SENSOR'
      }
    ];
    this.saveAlerts();
  }

  // --- Role-Based Access Control (RBAC) Guard ---
  public checkPermission(
    allowedRoles: AdminUser['role'][],
    actionDescription: string
  ): { allowed: boolean; error?: string } {
    if (!this.adminUser) {
      return { allowed: false, error: '401 Unauthorized: Administrative session required.' };
    }
    if (!allowedRoles.includes(this.adminUser.role)) {
      return {
        allowed: false,
        error: `403 Forbidden: Role '${this.adminUser.role}' is not authorized to ${actionDescription}.`
      };
    }
    return { allowed: true };
  }

  // --- Sensor Listeners & Real-Time Telemetry Loop ---
  public subscribeToSensors(callback: (sensors: SensorItem[]) => void): () => void {
    this.sensorListeners.add(callback);
    callback(this.getSensors());
    return () => {
      this.sensorListeners.delete(callback);
    };
  }

  private notifySensorsChanged(): void {
    const latest = this.getSensors();
    this.sensorListeners.forEach((fn) => {
      try {
        fn(latest);
      } catch {
        // ignore listener errors
      }
    });
  }

  private startTelemetryLoop(): void {
    if (this.telemetryTimer) return;
    this.telemetryTimer = setInterval(() => {
      const now = Date.now();
      let changed = false;

      // 1. Pick 1 or 2 active sensors to receive realistic ambient fluctuation
      if (this.sensors.length > 0) {
        const randIndex = Math.floor(Math.random() * this.sensors.length);
        const sensor = this.sensors[randIndex];

        if (sensor && sensor.status !== 'OFFLINE') {
          const delta = (Math.random() - 0.5) * 2.4;
          const updatedDb = Math.round(Math.max(42, Math.min(94, sensor.currentDb + delta)) * 10) / 10;
          const updatedPeak = Math.max(sensor.peakDb, updatedDb);

          this.sensors[randIndex] = {
            ...sensor,
            currentDb: updatedDb,
            peakDb: updatedPeak,
            lastUpdated: new Date().toISOString(),
            status: 'ONLINE'
          };
          changed = true;
        }
      }

      // 2. Evaluate status of all sensors based on packet freshness
      this.sensors = this.sensors.map((s) => {
        const packetAgeMs = now - new Date(s.lastUpdated).getTime();
        let targetStatus: 'ONLINE' | 'STALE' | 'OFFLINE' = s.status;
        if (packetAgeMs > 90000) {
          targetStatus = 'OFFLINE';
        } else if (packetAgeMs > 25000) {
          targetStatus = 'STALE';
        } else {
          targetStatus = 'ONLINE';
        }

        if (targetStatus !== s.status) {
          changed = true;
          return { ...s, status: targetStatus };
        }
        return s;
      });

      if (changed) {
        this.saveSensors();
        this.notifySensorsChanged();
      }
    }, 3500);
  }

  // --- City Operations ---
  public getCities(): CityItem[] {
    return [...this.cities];
  }

  public getCityById(id: string): CityItem | undefined {
    return this.cities.find((c) => c.id === id);
  }

  public addCity(city: Omit<CityItem, 'id'>): CityItem {
    const perm = this.checkPermission(['Super Admin'], 'add new municipal monitoring territories');
    if (!perm.allowed) throw new Error(perm.error);

    const newCity: CityItem = {
      ...city,
      id: `city-${city.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`
    };
    this.cities.push(newCity);
    this.saveCities();
    return newCity;
  }

  public toggleCityStatus(cityId: string): void {
    const perm = this.checkPermission(['Super Admin'], 'toggle municipality active status');
    if (!perm.allowed) throw new Error(perm.error);

    this.cities = this.cities.map((c) =>
      c.id === cityId ? { ...c, enabled: !c.enabled } : c
    );
    this.saveCities();
  }

  // --- Sensor Operations ---
  public getSensors(cityId?: string): SensorItem[] {
    if (cityId) {
      return this.sensors.filter((s) => s.cityId === cityId);
    }
    return [...this.sensors];
  }

  public getSensorById(id: string): SensorItem | undefined {
    return this.sensors.find((s) => s.id === id);
  }

  public addSensor(sensorData: Omit<SensorItem, 'id' | 'lastUpdated'>): SensorItem {
    const perm = this.checkPermission(['Super Admin'], 'deploy new hardware sensors');
    if (!perm.allowed) throw new Error(perm.error);

    const city = this.cities.find((c) => c.id === sensorData.cityId);
    const code = city ? city.name.substring(0, 3).toUpperCase() : 'GEN';
    const num = String(this.sensors.filter((s) => s.cityId === sensorData.cityId).length + 1).padStart(2, '0');
    const newSensor: SensorItem = {
      ...sensorData,
      id: `NG-${code}-${num}`,
      lastUpdated: new Date().toISOString()
    };
    this.sensors.unshift(newSensor);
    this.saveSensors();
    this.notifySensorsChanged();
    return newSensor;
  }

  public updateSensor(id: string, updates: Partial<SensorItem>): void {
    const perm = this.checkPermission(['Super Admin', 'Environmental Officer'], 'update sensor configurations');
    if (!perm.allowed) throw new Error(perm.error);

    this.sensors = this.sensors.map((s) =>
      s.id === id ? { ...s, ...updates, lastUpdated: new Date().toISOString() } : s
    );
    this.saveSensors();
    this.notifySensorsChanged();
  }

  public deleteSensor(id: string): void {
    const perm = this.checkPermission(['Super Admin'], 'decommission sensor stations');
    if (!perm.allowed) throw new Error(perm.error);

    this.sensors = this.sensors.filter((s) => s.id !== id);
    this.saveSensors();
    this.notifySensorsChanged();
  }

  // --- Citizen Reports Operations ---
  public getReports(): CitizenReport[] {
    return [...this.reports];
  }

  public getReportById(id: string): CitizenReport | undefined {
    return this.reports.find((r) => r.id === id);
  }

  public submitReport(reportData: {
    city: string;
    location: string;
    latitude?: number;
    longitude?: number;
    category: CitizenReport['category'];
    approxNoiseDb?: number;
    description: string;
    photoUrl?: string;
    audioUrl?: string;
    evidenceName?: string;
    reporterContact?: string;
  }): CitizenReport {
    // Standard format: NG-YYYY-XXXXXX
    const randomHex = Math.floor(100000 + Math.random() * 900000).toString();
    const id = `NG-2026-${randomHex}`;

    const newReport: CitizenReport = {
      id,
      city: reportData.city,
      location: reportData.location,
      latitude: reportData.latitude,
      longitude: reportData.longitude,
      category: reportData.category,
      approxNoiseDb: reportData.approxNoiseDb,
      description: reportData.description,
      photoUrl: reportData.photoUrl,
      audioUrl: reportData.audioUrl,
      evidenceName: reportData.evidenceName,
      timestamp: new Date().toISOString(),
      status: 'Submitted',
      priority: reportData.approxNoiseDb && reportData.approxNoiseDb > 85 ? 'High' : 'Medium',
      updatedAt: new Date().toISOString(),
      reporterContact: reportData.reporterContact
    };

    this.reports.unshift(newReport);
    this.saveReports();
    return newReport;
  }

  public updateReportStatus(
    id: string,
    status: ReportStatus,
    resolutionNotes?: string,
    rejectionReason?: string,
    assignedTo?: string
  ): void {
    const perm = this.checkPermission(
      ['Super Admin', 'Environmental Officer'],
      'update citizen report lifecycle status'
    );
    if (!perm.allowed) throw new Error(perm.error);

    this.reports = this.reports.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status,
          updatedAt: new Date().toISOString(),
          resolutionNotes: resolutionNotes ?? r.resolutionNotes,
          rejectionReason: rejectionReason ?? r.rejectionReason,
          assignedTo: assignedTo ?? r.assignedTo
        };
      }
      return r;
    });
    this.saveReports();
  }

  // --- Smart Alerts Operations ---
  public getAlerts(): NoiseAlert[] {
    return [...this.alerts];
  }

  public acknowledgeAlert(alertId: string): void {
    const perm = this.checkPermission(
      ['Super Admin', 'Environmental Officer'],
      'acknowledge active acoustic violation alerts'
    );
    if (!perm.allowed) throw new Error(perm.error);

    this.alerts = this.alerts.map((a) =>
      a.id === alertId ? { ...a, status: 'Acknowledged' } : a
    );
    this.saveAlerts();
  }

  public resolveAlert(alertId: string): void {
    const perm = this.checkPermission(
      ['Super Admin', 'Environmental Officer'],
      'resolve acoustic violation alerts'
    );
    if (!perm.allowed) throw new Error(perm.error);

    this.alerts = this.alerts.map((a) =>
      a.id === alertId ? { ...a, status: 'Resolved' } : a
    );
    this.saveAlerts();
  }

  public clearAlerts(): void {
    const perm = this.checkPermission(['Super Admin'], 'clear alerts log');
    if (!perm.allowed) throw new Error(perm.error);

    this.alerts = [];
    this.saveAlerts();
  }

  // --- Thresholds Operations ---
  public getThresholds(): ProjectThresholds {
    return { ...this.thresholds };
  }

  public updateThresholds(newThresholds: ProjectThresholds): void {
    const perm = this.checkPermission(['Super Admin'], 'reconfigure global statutory thresholds');
    if (!perm.allowed) throw new Error(perm.error);

    this.thresholds = newThresholds;
    localStorage.setItem(STORAGE_KEYS.THRESHOLDS, JSON.stringify(newThresholds));
  }

  public resetThresholds(): void {
    const perm = this.checkPermission(['Super Admin'], 'reset statutory thresholds to defaults');
    if (!perm.allowed) throw new Error(perm.error);

    this.thresholds = DEFAULT_THRESHOLDS;
    localStorage.setItem(STORAGE_KEYS.THRESHOLDS, JSON.stringify(DEFAULT_THRESHOLDS));
  }

  // --- Readings Operations ---
  public getLocations(): LocationItem[] {
    return [...this.locations];
  }

  public getReadings(sourceFilter?: DataSource): NoiseReading[] {
    if (sourceFilter) {
      return this.readings.filter((r) => r.dataSource === sourceFilter);
    }
    return [...this.readings];
  }

  public addReading(reading: NoiseReading): NoiseAlert | null {
    this.readings.push(reading);
    this.saveReadings();

    const evaluatedAlert = evaluateReadingForAlert(reading, this.thresholds, this.alerts);
    if (evaluatedAlert) {
      const existingIdx = this.alerts.findIndex((a) => a.id === evaluatedAlert.id);
      if (existingIdx >= 0) {
        this.alerts[existingIdx] = evaluatedAlert;
      } else {
        this.alerts.unshift(evaluatedAlert);
      }
      this.alerts = this.alerts.slice(0, 50);
      this.saveAlerts();
      return evaluatedAlert;
    }
    return null;
  }

  // --- Admin Authentication Operations ---
  public isAdminAuthenticated(): boolean {
    return this.adminUser !== null;
  }

  public getAdminUser(): AdminUser | null {
    return this.adminUser;
  }

  public async loginAdmin(
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    const userKey = username.toLowerCase().trim();
    const userRecord = ADMIN_CREDENTIAL_HASHES[userKey];

    if (!userRecord) {
      return { success: false, error: 'Invalid administrator credentials. Access denied.' };
    }

    const calculatedHash = await hashPasswordWithSalt(password, PASSWORD_SALT);
    if (calculatedHash !== userRecord.hash) {
      return { success: false, error: 'Invalid administrator credentials. Access denied.' };
    }

    const session: AdminUser = {
      username: userKey,
      name: userRecord.name,
      email: `${userKey}@noiseguard.gov.in`,
      role: userRecord.role,
      token: `ng_auth_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
      lastLogin: new Date().toISOString()
    };

    this.adminUser = session;
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(session));
    return { success: true };
  }

  public logoutAdmin(): void {
    this.adminUser = null;
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
  }

  public getDataMode(): 'SIMULATION' | 'OBSERVED' {
    return 'SIMULATION';
  }

  public setDataMode(_mode: 'SIMULATION' | 'OBSERVED'): void {}

  public dismissAlert(alertId: string): void {
    this.acknowledgeAlert(alertId);
  }

  public getLatestReadingsPerLocation(source?: DataSource): Map<string, NoiseReading> {
    const map = new Map<string, NoiseReading>();
    const list = source ? this.readings.filter((r) => r.dataSource === source) : this.readings;
    for (let i = list.length - 1; i >= 0; i--) {
      const r = list[i];
      if (!map.has(r.locationId)) {
        map.set(r.locationId, r);
      }
      if (map.size === this.locations.length) break;
    }
    return map;
  }

  public importObservedReadings(newReadings: NoiseReading[]): { addedCount: number } {
    this.readings.push(...newReadings);
    this.saveReadings();
    return { addedCount: newReadings.length };
  }

  // Reset to initial clean state
  public resetToDefaultSeed(): void {
    const perm = this.checkPermission(['Super Admin'], 'reset database to seed defaults');
    if (!perm.allowed) throw new Error(perm.error);

    this.cities = INITIAL_CITIES;
    this.sensors = INITIAL_SENSORS;
    this.reports = INITIAL_CITIZEN_REPORTS;
    this.locations = INITIAL_LOCATIONS;
    this.readings = generateSeedHistoricalReadings();
    this.thresholds = DEFAULT_THRESHOLDS;
    this.generateInitialAlerts();
    this.saveCities();
    this.saveSensors();
    this.saveReports();
    this.saveLocations();
    this.saveReadings();
  }
}

export const dataService = new DataService();
