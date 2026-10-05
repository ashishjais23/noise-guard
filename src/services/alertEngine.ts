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

  // We only generate alerts for High and Critical readings
  if (severity !== 'High' && severity !== 'Critical') {
    return null;
  }

  // Check if there is already an active alert for this location within the past 15 minutes
  const recentAlert = existingAlerts.find(
    (a) =>
      (a.sensorId === reading.sensorId || a.locationId === reading.locationId) &&
      a.status === 'Active' &&
      Date.now() - new Date(a.timestamp).getTime() < 15 * 60 * 1000
  );

  if (recentAlert) {
    // If noise got higher, upgrade severity and extend duration
    if (reading.noiseLevelDb > recentAlert.noiseLevelDb) {
      return {
        ...recentAlert,
        noiseLevelDb: reading.noiseLevelDb,
        severity,
        durationMinutes: recentAlert.durationMinutes + 2,
        timestamp: reading.timestamp
      };
    }
    // Prevent duplicate spam for the same ongoing incident
    return null;
  }

  // Create new smart alert with threshold & sustained duration
  const targetThreshold = severity === 'Critical' ? thresholds.highMax : thresholds.moderateMax;
  const initialDuration = thresholds.durationMinutesTrigger || 5;

  return {
    id: `alert-${reading.sensorId || reading.locationId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sensorId: reading.sensorId,
    locationId: reading.locationId,
    locationName: reading.locationName || 'Monitored Sensor Point',
    cityName: reading.cityName || 'Metro Region',
    noiseLevelDb: reading.noiseLevelDb,
    thresholdDb: targetThreshold,
    severity,
    durationMinutes: severity === 'Critical' ? initialDuration + 4 : initialDuration,
    timestamp: reading.timestamp || new Date().toISOString(),
    status: 'Active',
    dataSource: reading.dataSource
  };
}
