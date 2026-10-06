/**
 * NoiseGuard Geolocation & Reverse Geocoding Service
 * Uses genuine browser GPS (enableHighAccuracy) and OpenStreetMap Nominatim.
 * Completely free of hardcoded city constraints.
 */

export interface GeoLocationResult {
  latitude: number;
  longitude: number;
  accuracy: number; // in meters (±X m)
  city?: string;
  formattedAddress?: string;
}

export interface LocationSearchResult {
  displayName: string;
  city: string;
  latitude: number;
  longitude: number;
}

const NOMINATIM_HEADERS = {
  Accept: 'application/json'
};

export const locationService = {
  /**
   * Request genuine device GPS coordinates with high accuracy
   */
  async getCurrentPosition(): Promise<{ latitude: number; longitude: number; accuracy: number }> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy || 10)
          });
        },
        (error) => {
          let message = 'Unable to acquire location.';
          if (error.code === error.PERMISSION_DENIED) {
            message = 'Location permission was denied. Please allow access in browser settings.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = 'GPS signal is currently unavailable.';
          } else if (error.code === error.TIMEOUT) {
            message = 'Location acquisition timed out. Retrying with network location...';
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 15000
        }
      );
    });
  },

  /**
   * Reverse geocode GPS coordinates to human street and city via OpenStreetMap Nominatim
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<{ city: string; formattedAddress: string }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
      const response = await fetch(url, {
        headers: NOMINATIM_HEADERS,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Nominatim returned status ${response.status}`);
      }

      const data = await response.json();
      const address = data.address || {};

      // Determine most accurate city/locality name
      const cityName =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.suburb ||
        address.county ||
        address.state_district ||
        address.state ||
        'Local Area';

      // Build readable concise street/landmark address
      const parts: string[] = [];
      if (address.building || address.amenity) parts.push(address.building || address.amenity);
      if (address.road) parts.push(address.road);
      if (address.neighbourhood || address.suburb) parts.push(address.neighbourhood || address.suburb);

      const formatted = parts.length > 0 ? parts.join(', ') : data.display_name?.split(',').slice(0, 2).join(',') || `GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

      return {
        city: cityName,
        formattedAddress: formatted
      };
    } catch {
      clearTimeout(timeoutId);
      // Graceful fallback: return raw coordinates without faking
      return {
        city: 'Local Area',
        formattedAddress: `GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
      };
    }
  },

  /**
   * Search any global or national address/landmark via Nominatim
   */
  async searchAddress(query: string): Promise<LocationSearchResult[]> {
    if (!query || query.trim().length < 3) return [];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query.trim()
      )}&limit=5&addressdetails=1`;

      const res = await fetch(url, {
        headers: NOMINATIM_HEADERS,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) return [];

      const list = await res.json();
      if (!Array.isArray(list)) return [];

      return list.map((item: any) => {
        const addr = item.address || {};
        const cityName =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.municipality ||
          addr.suburb ||
          addr.state ||
          'Local Area';

        return {
          displayName: item.display_name,
          city: cityName,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon)
        };
      });
    } catch {
      clearTimeout(timeoutId);
      return [];
    }
  }
};
