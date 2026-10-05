export type DataSource = 'SENSOR' | 'DEVICE_ESTIMATE' | 'SIMULATED' | 'OBSERVED' | 'RESEARCH DATA';

export type NoiseSeverity = 'Safe' | 'Moderate' | 'High' | 'Critical';

export type LocationType =
  | 'Traffic Corridor'
  | 'Commercial / Market'
  | 'Residential'
  | 'Silence / Healthcare'
  | 'Institutional'
  | 'Construction Zone'
  | 'Industrial';

export interface CityItem {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  defaultZoom: number;
  enabled: boolean;
  baselineAvgDb: number;
  description: string;
}

export type SensorStatus = 'ONLINE' | 'OFFLINE' | 'STALE';
export type SensorConnectivity = '4G LTE' | 'LoRaWAN' | 'Wi-Fi' | 'NB-IoT';
export type CalibrationStatus = 'Calibrated' | 'Pending Calibration' | 'Expired';

export interface SensorItem {
  id: string; // e.g. "NG-DEL-01"
  name: string;
  cityId: string;
  cityName: string;
  locationName: string;
  latitude: number;
  longitude: number;
  locationType: LocationType;
  status: SensorStatus;
  battery: number; // 0 - 100%
  connectivity: SensorConnectivity;
  calibrationStatus: CalibrationStatus;
  lastCalibrationDate: string;
  installationDate: string;
  currentDb: number;
  avgDb: number;
  peakDb: number;
  noiseType: string;
  lastUpdated: string; // ISO string
}

export interface LocationItem {
  id: string;
  name: string;
  cityId?: string;
  cityName?: string;
  latitude: number;
  longitude: number;
  locationType: LocationType;
  description: string;
  baselineDb: number;
  peakPeriod: string;
  address: string;
}

export interface NoiseReading {
  id: string;
  sensorId?: string;
  locationId: string;
  locationName?: string;
  cityId?: string;
  cityName?: string;
  noiseLevelDb: number; // Leq
  l10?: number;
  l90?: number;
  lmax?: number;
  timestamp: string; // ISO string
  dataSource: DataSource;
  measurementMethod?: string;
  acousticContext?: string;
  frequencyWeighting?: string;
  timeWeighting?: 'Fast (125ms)' | 'Slow (1000ms)' | 'Impulse (35ms)' | string;
}

export interface Recommendation {
  id: string;
  category: string;
  targetLocationType: LocationType | 'General';
  triggerCondition: string;
  potentialFactors: string[];
  suggestedInterventions: string[];
  scientificRationale: string;
  disclaimer: string;
}

export type ReportCategory =
  | 'Traffic'
  | 'Construction'
  | 'Loudspeaker'
  | 'Event'
  | 'Industrial'
  | 'Horns'
  | 'Generator'
  | 'Commercial'
  | 'Other';

export type ReportStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Action Taken'
  | 'Resolved'
  | 'Rejected';

export type ReportPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface CitizenReport {
  id: string; // Format: NG-XXXXXX
  city: string;
  location: string;
  latitude?: number;
  longitude?: number;
  category: ReportCategory;
  approxNoiseDb?: number;
  description: string;
  photoUrl?: string;
  audioUrl?: string;
  evidenceName?: string;
  timestamp: string;
  status: ReportStatus;
  priority: ReportPriority;
  assignedTo?: string;
  rejectionReason?: string;
  resolutionNotes?: string;
  updatedAt: string;
  reporterContact?: string;
}

export interface NoiseAlert {
  id: string;
  sensorId?: string;
  locationId: string;
  locationName: string;
  cityId?: string;
  cityName?: string;
  noiseLevelDb: number;
  thresholdDb: number;
  severity: NoiseSeverity;
  durationMinutes: number;
  timestamp: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  dataSource: DataSource;
  suggestedActionId?: string;
}

export interface ProjectThresholds {
  safeMax: number;       // e.g. 65 dB
  moderateMax: number;   // e.g. 75 dB
  highMax: number;       // e.g. 85 dB
  durationMinutesTrigger: number; // e.g. 5 mins sustained
}

export interface AdminUser {
  username: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Environmental Officer' | 'Acoustic Researcher';
  token: string;
  lastLogin: string;
}

export interface LiveDeviceMeasurement {
  currentDb: number;
  averageDb: number;
  peakDb: number;
  durationSeconds: number;
  timestamp: string;
  isListening: boolean;
  isPaused: boolean;
  history: { time: string; db: number }[];
}

export interface ResearchTopic {
  id: string;
  number: number;
  title: string;
  summary: string;
  keyPoints: string[];
  details: string[];
  metricsOrStandards?: { label: string; value: string; notes?: string }[];
  citations: Citation[];
}

export interface Citation {
  title: string;
  organization: string;
  year: number;
  url?: string;
  documentRef?: string;
  note?: string;
}

export interface TimeSeriesPoint {
  time: string;
  db: number;
  locationName?: string;
  dataSource?: DataSource;
}
