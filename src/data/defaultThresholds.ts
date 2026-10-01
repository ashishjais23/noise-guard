import { ProjectThresholds } from '../types';

export const DEFAULT_THRESHOLDS: ProjectThresholds = {
  safeMax: 65.0,      // dB: Readings below 65 dB are categorized as Safe
  moderateMax: 75.0,  // dB: Readings between 65 dB and 75 dB are Moderate
  highMax: 85.0,      // dB: Readings between 75 dB and 85 dB are High; > 85 dB is Critical
};

export interface RegulatoryStandard {
  zone: string;
  dayLimitDb: number;
  nightLimitDb: number;
  authority: string;
  standardReference: string;
  notes: string;
}

export const REGULATORY_STANDARDS: RegulatoryStandard[] = [
  {
    zone: 'Industrial Area',
    dayLimitDb: 75,
    nightLimitDb: 70,
    authority: 'CPCB (India)',
    standardReference: 'Noise Pollution (Regulation and Control) Rules, 2000 - Schedule',
    notes: 'Day time: 6:00 AM to 10:00 PM; Night time: 10:00 PM to 6:00 AM'
  },
  {
    zone: 'Commercial Area',
    dayLimitDb: 65,
    nightLimitDb: 55,
    authority: 'CPCB (India)',
    standardReference: 'Noise Pollution Rules, 2000 - Schedule',
    notes: 'Applicable to markets, commercial complexes, and retail corridors'
  },
  {
    zone: 'Residential Area',
    dayLimitDb: 55,
    nightLimitDb: 45,
    authority: 'CPCB (India)',
    standardReference: 'Noise Pollution Rules, 2000 - Schedule',
    notes: 'Preserves residential peace and circadian sleep cycles'
  },
  {
    zone: 'Silence Zone (Hospitals & Schools)',
    dayLimitDb: 50,
    nightLimitDb: 40,
    authority: 'CPCB (India)',
    standardReference: 'Noise Pollution Rules, 2000 - Schedule (Rule 3(2) & 4(1))',
    notes: '100-meter radius around hospitals, educational institutions, and courts'
  },
  {
    zone: 'WHO Road Traffic Guideline',
    dayLimitDb: 53, // Lden
    nightLimitDb: 45, // Lnight
    authority: 'World Health Organization (WHO)',
    standardReference: 'Environmental Noise Guidelines for the European Region (2018)',
    notes: 'Recommended exposure threshold to minimize non-auditory cardiovascular risk'
  }
];
