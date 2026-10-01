import { LocationItem } from '../types';

export const INITIAL_LOCATIONS: LocationItem[] = [
  {
    id: 'loc-1',
    name: 'Main Arterial Road (MG Highway Junction)',
    latitude: 12.9754,
    longitude: 77.6066,
    locationType: 'Traffic Corridor',
    description: 'Six-lane urban thoroughfare with high continuous vehicular volume, bus routes, and flyover interchange.',
    baselineDb: 74.0,
    peakPeriod: '08:30 - 11:00 & 17:30 - 20:30',
    address: 'Sector 4, Central Corridor'
  },
  {
    id: 'loc-2',
    name: 'University Campus Gate & Transit Plaza',
    latitude: 12.9698,
    longitude: 77.5982,
    locationType: 'Institutional',
    description: 'Main pedestrian entrance to campus, auto-rickshaw stand, student transit interchange, and cafeteria perimeter.',
    baselineDb: 62.0,
    peakPeriod: '12:00 - 14:00 & 16:30 - 18:00',
    address: 'Academic Way, South Campus'
  },
  {
    id: 'loc-3',
    name: 'City Central Market & Commercial Bazaar',
    latitude: 12.9642,
    longitude: 77.5851,
    locationType: 'Commercial / Market',
    description: 'Dense commercial shopping zone with street vendors, pedestrian footfall, diesel generators, and delivery trucks.',
    baselineDb: 71.5,
    peakPeriod: '16:00 - 21:00',
    address: 'Market Square, Old Town'
  },
  {
    id: 'loc-4',
    name: 'Greenfield Residential Colony (Block B)',
    latitude: 12.9812,
    longitude: 77.5910,
    locationType: 'Residential',
    description: 'Low-density residential neighbourhood surrounded by tree canopy, parks, and secondary residential access lanes.',
    baselineDb: 48.5,
    peakPeriod: '07:30 - 09:00',
    address: '5th Cross, Greenfield Sector'
  },
  {
    id: 'loc-5',
    name: 'Metro Rail Phase-3 Construction Site',
    latitude: 12.9680,
    longitude: 77.6150,
    locationType: 'Construction Zone',
    description: 'Active infrastructure project utilizing hydraulic pile drivers, earth-moving machinery, and concrete transit mixers.',
    baselineDb: 78.5,
    peakPeriod: '10:00 - 17:00',
    address: 'Ring Road Pier 112'
  },
  {
    id: 'loc-6',
    name: 'Interstate Bus Stand & Terminal 1',
    latitude: 12.9785,
    longitude: 77.5732,
    locationType: 'Traffic Corridor',
    description: 'Intercity diesel bus terminal featuring idling heavy engines, hydraulic brake discharges, and public address tannoy announcements.',
    baselineDb: 76.0,
    peakPeriod: '06:00 - 09:30 & 18:00 - 22:30',
    address: 'Terminal Bay 3, Central Bus Port'
  },
  {
    id: 'loc-7',
    name: 'District Multi-Specialty Hospital & Silence Zone',
    latitude: 12.9860,
    longitude: 77.6015,
    locationType: 'Silence / Healthcare',
    description: 'Designated statutory silence zone encompassing emergency trauma care unit, recovery wards, and ambulance drop-off bay.',
    baselineDb: 47.0,
    peakPeriod: '11:00 - 15:00',
    address: 'Hospital Boulevard, North Sector'
  },
  {
    id: 'loc-8',
    name: 'Suburban Light Industrial & Logistics Park',
    latitude: 12.9550,
    longitude: 77.6210,
    locationType: 'Industrial',
    description: 'Warehousing logistics and fabrication hub featuring pneumatic tools, forklift movements, and ventilation chillers.',
    baselineDb: 72.0,
    peakPeriod: '09:00 - 18:00',
    address: 'Industrial Plot 19, Phase 2'
  }
];
