import { LocationItem, Recommendation } from '../types';

export const BASE_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-traffic-peak',
    category: 'Traffic & Transportation Management',
    targetLocationType: 'Traffic Corridor',
    triggerCondition: 'Elevated sound pressure levels (> 75 dB) in transport corridors during commute intervals.',
    potentialFactors: [
      'Stop-and-go vehicular congestion causing engine revving',
      'Persistent acoustic horn usage at congested signal intersections',
      'Heavy commercial transport vehicles (diesel buses & trucks) traversing arterial links',
      'Tire-pavement interaction over coarse or degraded asphalt surfaces'
    ],
    suggestedInterventions: [
      'Implement intelligent traffic signal phasing to reduce stop-and-go queuing',
      'Install automated acoustic horn-detection enforcement cameras with optical license-plate recognition',
      'Resurface arterial corridors with low-noise porous elastic asphalt (providing 3-5 dB reduction)',
      'Establish time-restricted bypass corridors diverting heavy freight away from dense urban core'
    ],
    scientificRationale: 'Acoustic emissions scale exponentially with vehicle deceleration and re-acceleration. Reducing congestion bottlenecks directly lowers cumulative Leq sound exposure.',
    disclaimer: 'Rule-based educational suggestion. Municipal implementation requires corridor traffic volume studies and road safety compliance audits.'
  },
  {
    id: 'rec-construction',
    category: 'Civil Works & Construction Mitigation',
    targetLocationType: 'Construction Zone',
    triggerCondition: 'Intermittent or continuous high acoustic spikes (> 80 dB) from civil infrastructure works.',
    potentialFactors: [
      'Hydraulic rock breakers and pile driving machinery operating at boundary perimeters',
      'Stationary diesel generators operating without acoustic attenuation canopies',
      'Heavy transit concrete mixer idling and aggregate loading discharge'
    ],
    suggestedInterventions: [
      'Erect certified mobile acoustic perimeter curtains / modular sound barriers (minimum 3m height, STC rating ≥ 25)',
      'Restrict high-impact percussive operations strictly to statutory daytime hours (09:00 - 17:00)',
      'Enforce mandatory sound attenuation cowls on stationary air compressors and auxiliary generators',
      'Deploy continuous real-time threshold telemetry at site boundary with automatic worker alert beacons'
    ],
    scientificRationale: 'Point-source construction noise attenuates at approximately 6 dB per doubling of distance in free fields, but line-of-sight acoustic barriers provide immediate 8-12 dB shielding for adjacent receptors.',
    disclaimer: 'Suggested intervention based on international civil construction noise control guidelines (BS 5228 / CPCB).'
  },
  {
    id: 'rec-commercial-market',
    category: 'Commercial & Retail District Management',
    targetLocationType: 'Commercial / Market',
    triggerCondition: 'Persistent ambient hum (> 72 dB) in dense pedestrian commercial zones.',
    potentialFactors: [
      'Unregulated retail promotional loudspeakers and public address equipment',
      'Backup diesel generators operating during commercial peak electrical loading',
      'Loading and unloading of commercial delivery vehicles in narrow market alleys'
    ],
    suggestedInterventions: [
      'Enforce municipal sound regulations prohibiting outdoor storefront amplification under Noise Rules 2000',
      'Transition commercial establishments to grid-tied battery energy storage to eliminate localized diesel generators',
      'Schedule logistics and goods unloading during designated off-peak morning hours (05:00 - 08:00)',
      'Incorporate sound-absorptive street canopies and porous porous pavers in market pedestrian plazas'
    ],
    scientificRationale: 'Reverberant accumulation in narrow commercial streets amplifies crowd noise. Eliminating electroacoustic amplification restores ambient levels to tolerable communicative thresholds.',
    disclaimer: 'Rule-based guideline for municipal commerce departments and local merchant associations.'
  },
  {
    id: 'rec-silence-zone',
    category: 'Silence Zone & Sensitive Receptors Protection',
    targetLocationType: 'Silence / Healthcare',
    triggerCondition: 'Any acoustic excursion exceeding 50 dB in designated hospital, school, or court zones.',
    potentialFactors: [
      'Vehicular horn honking on roads adjacent to healthcare or institutional boundaries',
      'Emergency vehicle sirens operating at maximum volume upon entry into hospital driveway',
      'Auxiliary HVAC chillers and rooftop cooling towers on facility premises'
    ],
    suggestedInterventions: [
      'Strictly enforce 100-meter statutory silence perimeter with prominent signage and acoustic surveillance cameras',
      'Protocols for ambulance sirens: transition to low-intensity directional tone upon entering campus gates',
      'Plant multi-tiered evergreen vegetation buffer belts (e.g. dense ficus, bamboo) along perimeter fences',
      'Install high-performance acoustic double-glazing (minimum 35 dB sound reduction index) on patient recovery ward windows'
    ],
    scientificRationale: 'Patients exposed to noise levels above 45 dB(A) demonstrate elevated heart rates, impaired wound healing, and fragmented sleep architecture, delaying recovery.',
    disclaimer: 'Critical statutory standard under Indian CPCB Noise Rules (Schedule, Rule 3(2)). Must be prioritized by civic authorities.'
  },
  {
    id: 'rec-industrial',
    category: 'Industrial & Light Manufacturing Acoustic Control',
    targetLocationType: 'Industrial',
    triggerCondition: 'Continuous mechanical hum or impulsive pneumatic exhaust (> 75 dB).',
    potentialFactors: [
      'Unbalanced rotating machinery (fans, blowers, high-speed centrifuges)',
      'Pneumatic press exhaust discharging directly into ambient air without silencers',
      'Acoustic reverberation inside lightweight steel fabrication sheds'
    ],
    suggestedInterventions: [
      'Retrofit pneumatic discharge lines with reactive expansion chamber silencers',
      'Mount heavy vibrating machinery on elastomeric inertia pads or spring vibration isolators',
      'Install acoustic sound-absorptive baffles on interior industrial roof trusses',
      'Schedule routine preventative acoustic vibration diagnostics to detect bearing wear before failure'
    ],
    scientificRationale: 'Vibration isolation prevents structure-borne acoustic transmission into building envelopes and surrounding soil strata.',
    disclaimer: 'Engineering recommendation. Requires detailed octave-band acoustic analysis before structural installation.'
  }
];

export function getRecommendationsForLocation(
  location: LocationItem,
  currentDb: number
): Recommendation[] {
  // Filter base recommendations that match location type or general category
  const matched = BASE_RECOMMENDATIONS.filter(
    (r) => r.targetLocationType === location.locationType || r.targetLocationType === 'General'
  );

  if (matched.length > 0) {
    return matched;
  }

  // Fallback generic urban recommendation
  return [BASE_RECOMMENDATIONS[0]];
}
