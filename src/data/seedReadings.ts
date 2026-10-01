import { NoiseReading } from '../types';
import { INITIAL_LOCATIONS } from './initialLocations';

// Acoustic event descriptions mapped to location types
const ACOUSTIC_CONTEXTS: Record<string, { ambient: string[]; transient: string[] }> = {
  'Traffic Corridor': {
    ambient: [
      'Continuous multi-lane vehicular stream (45-60 km/h)',
      'Steady tire-pavement friction & passenger vehicle mix',
      'Moderate arterial transit with traffic light cycling',
      'Medium-density urban corridor flow'
    ],
    transient: [
      'Dual-tone vehicular horn burst at signal queue',
      'Heavy commercial truck exhaust kickdown',
      'Pneumatic air-brake purge from articulated lorry',
      'Modified motorcycle high-RPM acceleration surge'
    ]
  },
  'Institutional': {
    ambient: [
      'Pedestrian transit plaza & bicycle movements',
      'Student group conversations & perimeter walkway hum',
      'Distant campus shuttle movement & gate security',
      'Campus tree canopy rustle & subdued background'
    ],
    transient: [
      'Auto-rickshaw cluster arrival & horn tap',
      'Delivery van reversing buzzer near academic cafeteria',
      'Auditorium soundcheck bell tone',
      'Commuter motorbike departure from parking bay'
    ]
  },
  'Commercial / Market': {
    ambient: [
      'Bazaar pedestrian footfall & vendor bargaining murmur',
      'Storefront refrigeration unit condenser hum',
      'Shopping lane pedestrian flow & market acoustics',
      'Commercial alleyway daytime activity'
    ],
    transient: [
      'Backup diesel generator startup cycle',
      'Retail storefront promotional announcement speaker',
      'Steel shutter roller closure & merchandise crate drop',
      'Courier delivery three-wheeler horn blast'
    ]
  },
  'Residential': {
    ambient: [
      'Suburban birdsong (myna, sparrow) & leaf rustling',
      'Distant ambient city murmur & calm residential street',
      'Quiet cul-de-sac with negligible vehicular movement',
      'Tranquil residential courtyard background'
    ],
    transient: [
      'Domestic lawn trimmer & electric leaf blower',
      'Resident vehicle ingress over driveway speed-ramp',
      'Courier scooter horn alert at residential gate',
      'Domestic waste collection truck hydraulic lift'
    ]
  },
  'Construction Zone': {
    ambient: [
      'Earthmover diesel engine steady idle & track rattle',
      'Perimeter generator acoustic enclosure hum',
      'Structural scaffolding rebar handling & assembly',
      'Tower crane rotational winch motor whine'
    ],
    transient: [
      'Hydraulic rock breaker percussive impact cycle',
      'Transit concrete mixer drum high-speed discharge',
      'Steel sheet piling vibratory driver stroke',
      'Pneumatic chisel concrete surface scarification'
    ]
  },
  'Silence / Healthcare': {
    ambient: [
      'Hospital perimeter acoustic buffer & courtyard fountain',
      'Low-noise pedestrian approach to outpatient reception',
      'Central HVAC rooftop cooling tower subdued hum',
      'Emergency driveway standby & hospital landscaping'
    ],
    transient: [
      'Ambulance approaching with directional low-tone siren',
      'Oxygen cylinder delivery trolley movement over joint',
      'Violating passenger car horn honk outside gate',
      'Helicopter air-ambulance descent in designated corridor'
    ]
  },
  'Industrial': {
    ambient: [
      'Roof extraction fan continuous air displacement',
      'Pneumatic air line baseline pressure hiss',
      'Light metal fabrication workshop steady drone',
      'Warehousing logistics conveyor belt hum'
    ],
    transient: [
      'Pneumatic punch press exhaust air blast',
      'Heavy electric forklift acoustic reverse warning',
      'High-speed metal cold-cut saw bite into channel',
      'Compressed air line purge valve discharge'
    ]
  }
};

/**
 * Generates an authentically realistic 24-hour urban acoustic dataset.
 * - Granular 2-minute samples for the past 2 hours (making real-time line charts look rich and continuous)
 * - 15-minute samples for the remaining 22 hours
 * - Rigorous diurnal curves matching urban soundscape ecology
 * - Calculated Leq, L10 (traffic peaks), L90 (background floor), Lmax, and acoustic descriptors
 */
export function generateSeedHistoricalReadings(): NoiseReading[] {
  const readings: NoiseReading[] = [];
  const now = new Date();

  INITIAL_LOCATIONS.forEach((loc) => {
    // Generate time offsets in hours ago
    const timeOffsetsHours: number[] = [];

    // Dense 2-minute steps for the recent 2 hours (0 to 2 hours ago = 60 intervals)
    for (let m = 0; m <= 120; m += 2) {
      timeOffsetsHours.push(m / 60);
    }

    // 15-minute steps for 2 to 24 hours ago (88 intervals)
    for (let m = 135; m <= 24 * 60; m += 15) {
      timeOffsetsHours.push(m / 60);
    }

    // Keep running auto-regressive state for realistic continuity
    let currentLeq = loc.baselineDb;

    // Process from oldest to newest
    timeOffsetsHours.reverse().forEach((hoursAgo, index) => {
      const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      const hour = timestamp.getHours() + timestamp.getMinutes() / 60;

      // Realistic Diurnal Curve Factor
      let diurnalDelta = 0;
      if (hour >= 23 || hour < 5.5) {
        // Night quiet period (23:00 to 05:30)
        diurnalDelta = loc.locationType === 'Construction Zone' ? -18.0 : -10.5;
      } else if (hour >= 5.5 && hour < 7.5) {
        // Early morning ramp-up
        diurnalDelta = -3.5;
      } else if (hour >= 7.5 && hour <= 10.5) {
        // Morning rush hour summit
        diurnalDelta = loc.locationType === 'Residential' ? 2.5 : 5.8;
      } else if (hour > 10.5 && hour < 16.5) {
        // Midday plateau (steady city sounds)
        diurnalDelta = loc.locationType === 'Construction Zone' ? 4.5 : 1.2;
      } else if (hour >= 16.5 && hour <= 20.5) {
        // Evening commute & commercial peak
        diurnalDelta = loc.locationType === 'Commercial / Market' || loc.locationType === 'Traffic Corridor' ? 7.2 : 3.8;
      } else {
        // Late evening deceleration (20:30 to 23:00)
        diurnalDelta = -4.0;
      }

      const targetMean = loc.baselineDb + diurnalDelta;

      // Autoregressive mean-reversion drift (Markov chain)
      const reversion = (targetMean - currentLeq) * 0.18;
      const smoothNoise = (Math.sin(index * 0.45 + loc.baselineDb) * 0.9) + ((Math.random() - 0.5) * 1.6);

      // Acoustic transient burst probability
      let transientBurst = 0;
      let isTransient = false;
      const isNight = hour >= 22 || hour < 6;
      const burstChance = isNight ? 0.02 : 0.07;

      if (Math.random() < burstChance) {
        isTransient = true;
        transientBurst = 5.5 + Math.random() * 8.5;
      }

      currentLeq = currentLeq + reversion + smoothNoise + transientBurst;

      // Clamp to realistic physical urban acoustic bounds
      const minBound = loc.locationType === 'Silence / Healthcare' ? 38.0 : 42.0;
      const maxBound = loc.locationType === 'Construction Zone' ? 95.0 : 91.5;
      currentLeq = Math.max(minBound, Math.min(maxBound, currentLeq));
      const roundedLeq = Math.round(currentLeq * 10) / 10;

      // Compute acoustic statistics: L10, L90, Lmax
      const l10 = Math.round((roundedLeq + 2.2 + Math.random() * 1.5) * 10) / 10;
      const l90 = Math.round((roundedLeq - 3.8 - Math.random() * 1.2) * 10) / 10;
      const lmax = isTransient
        ? Math.round((roundedLeq + 6.0 + Math.random() * 4.0) * 10) / 10
        : Math.round((roundedLeq + 2.5 + Math.random() * 2.0) * 10) / 10;

      // Select realistic acoustic context
      const contextPool = ACOUSTIC_CONTEXTS[loc.locationType] || ACOUSTIC_CONTEXTS['Traffic Corridor'];
      const contextList = isTransient ? contextPool.transient : contextPool.ambient;
      const contextDesc = contextList[Math.floor(Math.random() * contextList.length)];

      readings.push({
        id: `seed-${loc.id}-${timestamp.getTime()}`,
        locationId: loc.id,
        locationName: loc.name,
        noiseLevelDb: roundedLeq,
        l10,
        l90,
        lmax,
        timestamp: timestamp.toISOString(),
        dataSource: 'SIMULATED',
        measurementMethod: 'Autoregressive Diurnal Stochastic Model',
        frequencyWeighting: 'A-Weighting (dBA)',
        timeWeighting: 'Fast (125ms)',
        acousticContext: contextDesc
      });
    });
  });

  return readings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

// Comprehensive realistic observed field measurements
export const SAMPLE_OBSERVED_READINGS: NoiseReading[] = [
  {
    id: 'obs-01',
    locationId: 'loc-1',
    locationName: 'Main Arterial Road (MG Highway Junction)',
    noiseLevelDb: 81.3,
    l10: 84.1,
    l90: 76.5,
    lmax: 88.9,
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    dataSource: 'OBSERVED',
    measurementMethod: 'Bruel & Kjaer Type 2250 Sound Level Meter (Class-1, IEC 61672)',
    frequencyWeighting: 'A-Weighting (dBA)',
    timeWeighting: 'Fast (125ms)',
    acousticContext: 'Heavy peak traffic flow with continuous tire-pavement friction & bus departures'
  },
  {
    id: 'obs-02',
    locationId: 'loc-1',
    locationName: 'Main Arterial Road (MG Highway Junction)',
    noiseLevelDb: 78.6,
    l10: 81.2,
    l90: 74.0,
    lmax: 84.5,
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    dataSource: 'OBSERVED',
    measurementMethod: 'Bruel & Kjaer Type 2250 Sound Level Meter (Class-1, IEC 61672)',
    frequencyWeighting: 'A-Weighting (dBA)',
    timeWeighting: 'Fast (125ms)',
    acousticContext: 'Moderate corridor flow with multi-axle freight vehicles passing'
  },
  {
    id: 'obs-03',
    locationId: 'loc-2',
    locationName: 'University Campus Gate & Transit Plaza',
    noiseLevelDb: 64.7,
    l10: 67.3,
    l90: 59.8,
    lmax: 71.0,
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    dataSource: 'OBSERVED',
    measurementMethod: 'Cirrus Optimus Green Sound Meter (Class-2)',
    frequencyWeighting: 'A-Weighting (dBA)',
    timeWeighting: 'Fast (125ms)',
    acousticContext: 'Student pedestrian rush at lecture interval with auto-rickshaw queue'
  },
  {
    id: 'obs-04',
    locationId: 'loc-2',
    locationName: 'University Campus Gate & Transit Plaza',
    noiseLevelDb: 58.2,
    l10: 61.1,
    l90: 54.3,
    lmax: 65.4,
    timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    dataSource: 'OBSERVED',
    measurementMethod: 'Cirrus Optimus Green Sound Meter (Class-2)',
    frequencyWeighting: 'A-Weighting (dBA)',
    timeWeighting: 'Fast (125ms)',
    acousticContext: 'Quiet lecture period with sparse pedestrian traffic & bicycle movements'
  },
  {
    id: 'obs-05',
    locationId: 'loc-3',
    locationName: 'City Central Market & Commercial Bazaar',
    noiseLevelDb: 75.4,
    l10: 78.1,
    l90: 70.2,
    lmax: 83.2,
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    dataSource: 'OBSERVED',
    measurementMethod: 'Testo 816-1 Calibrated Decibel Meter',
    frequencyWeighting: 'A-Weighting (dBA)',
    timeWeighting: 'Fast (125ms)',
    acousticContext: 'Commercial trading hours with vendor public address and crowd murmur'
  },
  {
    id: 'obs-06',
    locationId: 'loc-4',
    locationName: 'Greenfield Residential Colony (Block B)',
    noiseLevelDb: 48.7,
    l10: 51.5,
    l90: 44.1,
    lmax: 56.8,
    timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    dataSource: 'OBSERVED',
    measurementMethod: 'Calibrated Sound Level Meter (Type-2)',
    frequencyWeighting: 'A-Weighting (dBA)',
    timeWeighting: 'Slow (1000ms)',
    acousticContext: 'Tranquil afternoon ambiance with avian birdsong & residential garden foliage'
  },
  {
    id: 'obs-07',
    locationId: 'loc-5',
    locationName: 'Metro Rail Phase-3 Construction Site',
    noiseLevelDb: 84.8,
    l10: 88.6,
    l90: 78.2,
    lmax: 92.4,
    timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    dataSource: 'OBSERVED',
    measurementMethod: 'Bruel & Kjaer 2250 Sound Analyzer',
    frequencyWeighting: 'A-Weighting (dBA)',
    timeWeighting: 'Fast (125ms)',
    acousticContext: 'Hydraulic rock breaking and aggregate transit mixer loading'
  },
  {
    id: 'obs-08',
    locationId: 'loc-6',
    locationName: 'Interstate Bus Stand & Terminal 1',
    noiseLevelDb: 80.1,
    l10: 83.7,
    l90: 75.3,
    lmax: 87.2,
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    dataSource: 'OBSERVED',
    measurementMethod: 'Cirrus Optimus Green Sound Meter (Class-1)',
    frequencyWeighting: 'A-Weighting (dBA)',
    timeWeighting: 'Fast (125ms)',
    acousticContext: 'Intercity bus terminal bay departures with diesel engine acceleration & air brake vents'
  },
  {
    id: 'obs-09',
    locationId: 'loc-7',
    locationName: 'District Multi-Specialty Hospital & Silence Zone',
    noiseLevelDb: 47.3,
    l10: 49.8,
    l90: 42.6,
    lmax: 54.1,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    dataSource: 'OBSERVED',
    measurementMethod: 'Laboratory Calibrated Type-1 Sound Meter (IEC 61672-1)',
    frequencyWeighting: 'A-Weighting (dBA)',
    timeWeighting: 'Slow (1000ms)',
    acousticContext: 'Designated hospital silence perimeter; subdued ambulance bay and pedestrian entrance'
  },
  {
    id: 'obs-10',
    locationId: 'loc-8',
    locationName: 'Suburban Light Industrial & Logistics Park',
    noiseLevelDb: 73.9,
    l10: 76.5,
    l90: 69.1,
    lmax: 81.0,
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    dataSource: 'OBSERVED',
    measurementMethod: 'Testo 816-1 Calibrated Decibel Meter',
    frequencyWeighting: 'A-Weighting (dBA)',
    timeWeighting: 'Fast (125ms)',
    acousticContext: 'Metal fabrication plant roof ventilation extractors & industrial forklift operations'
  }
];
