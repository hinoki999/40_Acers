// Simple geocoding service using OpenStreetMap Nominatim (free)
export async function geocodeAddress(address: string, city: string, state: string, zipcode: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const fullAddress = `${address}, ${city}, ${state} ${zipcode}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': '40AcresApp/1.0 (contact@40acres.app)'
      }
    });
    
    if (!response.ok) {
      console.error('Geocoding failed:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}