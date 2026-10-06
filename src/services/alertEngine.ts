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

// In-memory sustained breach tracker
// Alerts require sustained threshold breach (>30 seconds or consecutive high telemetry)
// rather than transient instantaneous spikes.
interface BreachTracker {
  firstBreachTimestamp: number;
  breachCount: number;
  highestDb: number;
}

const breachTrackerMap = new Map<string, BreachTracker>();

export function evaluateReadingForAlert(
  reading: NoiseReading,
  thresholds: ProjectThresholds,
  existingAlerts: NoiseAlert[] = []
): NoiseAlert | null {
  const severity = determineSeverity(reading.noiseLevelDb, thresholds);
  const locationKey = reading.sensorId || reading.locationId;
  const now = reading.timestamp ? new Date(reading.timestamp).getTime() : Date.now();

  // If level returned to Safe or Moderate, clear breach tracker for this point
  if (severity !== 'High' && severity !== 'Critical') {
    breachTrackerMap.delete(locationKey);
    return null;
  }

  // Retrieve current breach state
  let tracker = breachTrackerMap.get(locationKey);
  if (!tracker) {
    // First observed breach: register but do NOT alert immediately (prevents momentary spikes)
    breachTrackerMap.set(locationKey, {
      firstBreachTimestamp: now,
      breachCount: 1,
      highestDb: reading.noiseLevelDb
    });
    return null;
  }

  // Update existing breach state
  tracker.breachCount += 1;
  tracker.highestDb = Math.max(tracker.highestDb, reading.noiseLevelDb);

  const durationBreachedMs = Math.max(0, now - tracker.firstBreachTimestamp);
  const isSustained = durationBreachedMs >= 30000 || tracker.breachCount >= 2;

  // If breach is not yet sustained, wait for subsequent confirmations
  if (!isSustained) {
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
        timestamp: reading.timestamp || new Date().toISOString()
      };
    }
    // Prevent duplicate spam for the same ongoing incident
    return null;
  }

  // Create new sustained smart alert
  const targetThreshold = severity === 'Critical' ? thresholds.highMax : thresholds.moderateMax;
  const initialDuration = Math.max(
    thresholds.durationMinutesTrigger || 5,
    Math.round(durationBreachedMs / 60000) || 1
  );

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
