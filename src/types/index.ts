export type DataSource = 'SIMULATED' | 'OBSERVED' | 'RESEARCH DATA';

export type NoiseSeverity = 'Safe' | 'Moderate' | 'High' | 'Critical';

export type LocationType =
  | 'Traffic Corridor'
  | 'Commercial / Market'
  | 'Residential'
  | 'Silence / Healthcare'
  | 'Institutional'
  | 'Construction Zone'
  | 'Industrial';

export interface LocationItem {
  id: string;
  name: string;
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
  locationId: string;
  locationName?: string;
  noiseLevelDb: number; // Leq (Equivalent Continuous Sound Level)
  l10?: number;         // Peak level exceeded 10% of time (traffic indicator)
  l90?: number;         // Ambient background noise floor exceeded 90% of time
  lmax?: number;        // Maximum instantaneous peak
  timestamp: string;    // ISO string
  dataSource: DataSource;
  measurementMethod?: string;
  acousticContext?: string;
  frequencyWeighting?: string;
  timeWeighting?: 'Fast (125ms)' | 'Slow (1000ms)' | 'Impulse (35ms)';
}

export interface NoiseAlert {
  id: string;
  locationId: string;
  locationName: string;
  noiseLevelDb: number;
  severity: NoiseSeverity;
  durationMinutes: number;
  timestamp: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  dataSource: DataSource;
  suggestedActionId?: string;
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

export interface ProjectThresholds {
  safeMax: number;       // e.g. 65 dB
  moderateMax: number;   // e.g. 75 dB
  highMax: number;       // e.g. 85 dB
  // Anything > highMax is Critical
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

export interface DiurnalNoiseStat {
  period: 'Morning (06:00-12:00)' | 'Afternoon (12:00-18:00)' | 'Evening (18:00-22:00)' | 'Night (22:00-06:00)';
  averageDb: number;
  peakDb: number;
  highEventsCount: number;
}
