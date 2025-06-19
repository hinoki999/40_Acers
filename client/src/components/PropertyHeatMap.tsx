import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Property } from "@shared/schema";

interface PropertyHeatMapProps {
  properties: Property[];
}

declare global {
  interface Window {
    google: any;
  }
}

export default function PropertyHeatMap({ properties }: PropertyHeatMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=visualization`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapRef.current || !window.google) return;

      // Center map on US
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 4,
        center: { lat: 39.8283, lng: -98.5795 }, // Center of US
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [{ color: '#f5f5f5' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e9e9e9' }]
          }
        ]
      });

      mapInstance.current = map;

      // Add markers for properties with coordinates
      const validProperties = properties.filter(p => p.latitude && p.longitude);
      
      if (validProperties.length === 0) {
        // Show fallback visualization with mock data for demonstration
        createFallbackVisualization(map);
        return;
      }

      // Create heat map data
      const heatmapData = validProperties.map(property => ({
        location: new window.google.maps.LatLng(
          parseFloat(property.latitude!),
          parseFloat(property.longitude!)
        ),
        weight: Number(property.sharePrice) * property.maxShares / 10000 // Normalize weight
      }));

      // Create heat map
      const heatmap = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map,
        radius: 50,
        opacity: 0.8,
        gradient: [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ]
      });

      // Add individual markers
      validProperties.forEach(property => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: parseFloat(property.latitude!),
            lng: parseFloat(property.longitude!)
          },
          map: map,
          title: property.address,
          icon: {
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">$</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24)
          }
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold">${property.address}</h3>
              <p class="text-sm text-gray-600">${property.city}, ${property.state}</p>
              <p class="text-sm"><strong>$${property.sharePrice}</strong> per share</p>
              <p class="text-sm">${property.currentShares}/${property.maxShares} shares sold</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });
    }

    function createFallbackVisualization(map: any) {
      // Add some demo markers for major cities
      const demoLocations = [
        { lat: 40.7128, lng: -74.0060, city: "New York", price: 250 },
        { lat: 34.0522, lng: -118.2437, city: "Los Angeles", price: 350 },
        { lat: 41.8781, lng: -87.6298, city: "Chicago", price: 200 },
        { lat: 29.7604, lng: -95.3698, city: "Houston", price: 180 },
        { lat: 33.4484, lng: -112.0740, city: "Phoenix", price: 220 },
        { lat: 39.9526, lng: -75.1652, city: "Philadelphia", price: 190 },
        { lat: 29.4241, lng: -98.4936, city: "San Antonio", price: 170 },
        { lat: 32.7767, lng: -96.7970, city: "Dallas", price: 210 }
      ];

      demoLocations.forEach(location => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: `Sample Property in ${location.city}`,
          icon: {
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="8" fill="#10B981" stroke="white" stroke-width="2"/>
                <text x="10" y="13" text-anchor="middle" fill="white" font-size="8" font-weight="bold">$</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(20, 20)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold">Sample Property</h3>
              <p class="text-sm text-gray-600">${location.city}</p>
              <p class="text-sm"><strong>$${location.price}</strong> per share</p>
              <p class="text-xs text-gray-500">Demo data - Add real properties to see actual locations</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });
    }
  }, [properties]);

  const propertiesWithCoords = properties.filter(p => p.latitude && p.longitude);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin size={20} />
          Property Heat Map
        </CardTitle>
        <p className="text-neutral-600">
          Geographic distribution of investment properties
          {propertiesWithCoords.length === 0 && " (showing demo data)"}
        </p>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg border border-neutral-200"
          style={{ minHeight: '400px' }}
        />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {properties.length}
            </div>
            <div className="text-xs text-neutral-600">Total Properties</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">
              {propertiesWithCoords.length}
            </div>
            <div className="text-xs text-neutral-600">Mapped Locations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">
              ${properties.reduce((sum, p) => sum + (Number(p.sharePrice) * p.maxShares), 0).toLocaleString()}
            </div>
            <div className="text-xs text-neutral-600">Total Value</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-700">
              {properties.reduce((sum, p) => sum + p.currentShares, 0).toLocaleString()}
            </div>
            <div className="text-xs text-neutral-600">Shares Sold</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}