import { LocationItem, NoiseReading } from '../types';

// Realistic acoustic context descriptors mapped to location types
const CONTEXT_MAP: Record<string, { normal: string[]; burst: string[] }> = {
  'Traffic Corridor': {
    normal: [
      'Steady arterial multi-lane vehicular flow',
      'Continuous passenger car stream & tire-pavement friction',
      'Signal-regulated commuter corridor movement'
    ],
    burst: [
      'Dual-tone vehicular horn burst at intersection queue',
      'Heavy commercial diesel vehicle acceleration kickdown',
      'Pneumatic air-brake exhaust discharge'
    ]
  },
  'Institutional': {
    normal: [
      'Campus pedestrian plaza movements & conversations',
      'Subdued institutional perimeter walkway ambiance',
      'Campus bicycle & electric shuttle transit'
    ],
    burst: [
      'Auto-rickshaw arrival cluster horn honk',
      'Auditorium soundcheck bell announcement',
      'Commuter motorcycle acceleration surge'
    ]
  },
  'Commercial / Market': {
    normal: [
      'Market alleyway pedestrian footfall & murmur',
      'Commercial storefront baseline activity',
      'Steady retail zone daytime reverberation'
    ],
    burst: [
      'Backup diesel generator operational surge',
      'Retail storefront promotional announcement speaker',
      'Steel delivery shutter roll down'
    ]
  },
  'Residential': {
    normal: [
      'Suburban birdsong & calm residential cul-de-sac',
      'Tranquil neighbourhood background & foliage rustle',
      'Distant ambient city murmur'
    ],
    burst: [
      'Domestic garden lawn trimmer operation',
      'Courier scooter horn alert at driveway',
      'Resident vehicle departure over speed hump'
    ]
  },
  'Construction Zone': {
    normal: [
      'Earthmover steady diesel idle & site generator hum',
      'Structural steel handling & scaffolding work',
      'Tower crane rotational winch motor drone'
    ],
    burst: [
      'Hydraulic rock breaker percussive impact cycle',
      'Transit concrete mixer drum high-speed discharge',
      'Pneumatic chipping hammer stroke burst'
    ]
  },
  'Silence / Healthcare': {
    normal: [
      'Hospital perimeter acoustic buffer & courtyard fountain',
      'Quiet pedestrian approach to outpatient clinic',
      'Central HVAC rooftop cooling tower subdued hum'
    ],
    burst: [
      'Emergency ambulance low-frequency siren transit',
      'Violating vehicle horn honk outside hospital gate',
      'Oxygen cylinder delivery trolley transit over threshold'
    ]
  },
  'Industrial': {
    normal: [
      'Roof extraction fan continuous air displacement',
      'Pneumatic air line baseline pressure hum',
      'Workshop light metal fabrication background drone'
    ],
    burst: [
      'Pneumatic press exhaust air blast',
      'Heavy electric forklift acoustic reverse chime',
      'High-speed metal cold-cut saw bite'
    ]
  }
};

/**
 * Calculates the next simulated reading using an autoregressive Markovian drift.
 * - Smooth realistic transitions (e.g. 72.1 -> 72.5 -> 72.8 -> 72.3 dB)
 * - Diurnal sensitivity (drops at night, peaks in morning/evening)
 * - Occasional realistic acoustic spikes with authentic acoustic descriptions
 * - Automatically computes L10, L90, and Lmax
 */
export function calculateNextSimulatedReading(
  location: LocationItem,
  currentDb: number,
  now: Date = new Date()
): NoiseReading {
  const hour = now.getHours() + now.getMinutes() / 60;

  // Realistic Diurnal Curve Factor
  let diurnalDelta = 0;
  if (hour >= 23 || hour < 5.5) {
    // Night quiet period (23:00 to 05:30)
    diurnalDelta = location.locationType === 'Construction Zone' ? -18.0 : -10.5;
  } else if (hour >= 5.5 && hour < 7.5) {
    // Early morning ramp-up
    diurnalDelta = -3.5;
  } else if (hour >= 7.5 && hour <= 10.5) {
    // Morning rush hour summit
    diurnalDelta = location.locationType === 'Residential' ? 2.5 : 5.8;
  } else if (hour > 10.5 && hour < 16.5) {
    // Midday plateau
    diurnalDelta = location.locationType === 'Construction Zone' ? 4.5 : 1.2;
  } else if (hour >= 16.5 && hour <= 20.5) {
    // Evening commute & commercial peak
    diurnalDelta = location.locationType === 'Commercial / Market' || location.locationType === 'Traffic Corridor' ? 7.2 : 3.8;
  } else {
    // Late evening deceleration (20:30 to 23:00)
    diurnalDelta = -4.0;
  }

  const targetMean = location.baselineDb + diurnalDelta;

  // Mean reversion nudges back toward prevailing diurnal mean
  const meanReversion = (targetMean - currentDb) * 0.16;

  // Brownian random walk step: tight smooth steps between -0.8 dB and +0.8 dB
  const step = (Math.random() - 0.5) * 1.6;

  // Probability of an acoustic transient event (horn, brake screech, machinery start)
  let transientBurst = 0;
  let isBurst = false;
  const isNight = hour >= 22 || hour < 6;
  const isHighTraffic = location.locationType === 'Traffic Corridor' || location.locationType === 'Commercial / Market';
  const burstProbability = isNight ? 0.015 : isHighTraffic ? 0.07 : 0.04;

  if (Math.random() < burstProbability) {
    isBurst = true;
    transientBurst = 5.0 + Math.random() * 8.0;
  }

  let nextDb = currentDb + meanReversion + step + transientBurst;

  // Bounds clamping to realistic urban decibels
  const minBound = location.locationType === 'Silence / Healthcare' ? 38.0 : 42.0;
  const maxBound = location.locationType === 'Construction Zone' ? 95.0 : 91.5;
  nextDb = Math.max(minBound, Math.min(maxBound, nextDb));
  nextDb = Math.round(nextDb * 10) / 10;

  // Calculate L10 (peak traffic percentile), L90 (ambient background floor), Lmax
  const l10 = Math.round((nextDb + 2.0 + Math.random() * 1.5) * 10) / 10;
  const l90 = Math.round((nextDb - 3.8 - Math.random() * 1.2) * 10) / 10;
  const lmax = isBurst
    ? Math.round((nextDb + 6.0 + Math.random() * 4.0) * 10) / 10
    : Math.round((nextDb + 2.2 + Math.random() * 1.8) * 10) / 10;

  // Context descriptor
  const pool = CONTEXT_MAP[location.locationType] || CONTEXT_MAP['Traffic Corridor'];
  const options = isBurst ? pool.burst : pool.normal;
  const contextText = options[Math.floor(Math.random() * options.length)];

  return {
    id: `sim-${location.id}-${now.getTime()}`,
    locationId: location.id,
    locationName: location.name,
    noiseLevelDb: nextDb,
    l10,
    l90,
    lmax,
    timestamp: now.toISOString(),
    dataSource: 'SIMULATED',
    measurementMethod: 'Autoregressive Diurnal Stochastic Model',
    frequencyWeighting: 'A-Weighting (dBA)',
    timeWeighting: 'Fast (125ms)',
    acousticContext: contextText
  };
}
