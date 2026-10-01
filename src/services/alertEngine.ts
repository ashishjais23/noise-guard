import { NoiseAlert, NoiseReading, NoiseSeverity, ProjectThresholds } from '../types';

export function determineSeverity(
  noiseDb: number,
  thresholds: ProjectThresholds
): NoiseSeverity {
  if (noiseDb <= thresholds.safeMax) {
    return 'Safe';
  }
  if (noiseDb <= thresholds.moderateMax) {
    return 'Moderate';
  }
  if (noiseDb <= thresholds.highMax) {
    return 'High';
  }
  return 'Critical';
}

export function evaluateReadingForAlert(
  reading: NoiseReading,
  thresholds: ProjectThresholds,
  existingAlerts: NoiseAlert[] = []
): NoiseAlert | null {
  const severity = determineSeverity(reading.noiseLevelDb, thresholds);

  // We generate alerts for High and Critical readings
  if (severity !== 'High' && severity !== 'Critical') {
    return null;
  }

  // Check if there is already an active alert for this location within the past 10 minutes
  const recentAlert = existingAlerts.find(
    (a) =>
      a.locationId === reading.locationId &&
      a.status === 'Active' &&
      Date.now() - new Date(a.timestamp).getTime() < 10 * 60 * 1000
  );

  if (recentAlert) {
    // If noise got higher, upgrade severity
    if (reading.noiseLevelDb > recentAlert.noiseLevelDb) {
      return {
        ...recentAlert,
        noiseLevelDb: reading.noiseLevelDb,
        severity,
        durationMinutes: recentAlert.durationMinutes + 2,
        timestamp: reading.timestamp
      };
    }
    return null;
  }

  // Create new alert
  return {
    id: `alert-${reading.locationId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    locationId: reading.locationId,
    locationName: reading.locationName || 'Monitored Point',
    noiseLevelDb: reading.noiseLevelDb,
    severity,
    durationMinutes: severity === 'Critical' ? 8 : 4,
    timestamp: reading.timestamp,
    status: 'Active',
    dataSource: reading.dataSource
  };
}
