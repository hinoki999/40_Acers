import { useCallback, useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MapIcon, AlertCircle, Loader2 } from "lucide-react";

// TypeScript types for Google Maps
declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapProps {
  address: string;
  city: string;
  state: string;
  zipcode: string;
  className?: string;
}

interface MapComponentProps extends GoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
}

const MapComponent = ({ center, zoom, address, city, state, zipcode }: MapComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>();

  useEffect(() => {
    if (ref.current && !map && window.google) {
      const newMap = new window.google.maps.Map(ref.current, {
        center: new window.google.maps.LatLng(center.lat, center.lng),
        zoom,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map && window.google) {
      // Geocode the address to get precise coordinates
      const geocoder = new window.google.maps.Geocoder();
      const fullAddress = `${address}, ${city}, ${state} ${zipcode}`;
      
      geocoder.geocode({ address: fullAddress }, (results: any, status: any) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          map.setCenter(location);
          
          // Add a marker at the property location
          const marker = new window.google.maps.Marker({
            position: location,
            map: map,
            title: `${address}, ${city}, ${state}`,
            icon: {
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0C7.164 0 0 7.164 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.164 24.836 0 16 0z" fill="#A52A2A"/>
                  <circle cx="16" cy="16" r="6" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 40),
              anchor: new window.google.maps.Point(16, 40),
            },
          });

          // Add an info window with property details
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${address}</h3>
                <p style="margin: 0; color: #666; font-size: 14px;">${city}, ${state} ${zipcode}</p>
              </div>
            `,
          });

          // Show info window when marker is clicked
          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        }
      });
    }
  }, [map, address, city, state, zipcode]);

  return <div ref={ref} className="w-full h-full rounded-lg" />;
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="w-full h-64 bg-neutral-100 rounded-lg flex items-center justify-center border">
          <div className="text-center text-neutral-500">
            <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
            <p>Loading map...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="w-full h-64 bg-neutral-100 rounded-lg flex items-center justify-center border">
          <div className="text-center text-neutral-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 text-red-500" />
            <p>Failed to load map</p>
            <p className="text-sm">Please check your internet connection</p>
          </div>
        </div>
      );
    default:
      return (
        <div className="w-full h-64 bg-neutral-100 rounded-lg flex items-center justify-center border">
          <div className="text-center text-neutral-500">
            <MapIcon className="h-12 w-12 mx-auto mb-2" />
            <p>Initializing map...</p>
          </div>
        </div>
      );
  }
};

export default function GoogleMap({ address, city, state, zipcode, className }: GoogleMapProps) {
  // Default center (roughly center of US) - will be updated with geocoded address
  const center = { lat: 39.8283, lng: -98.5795 };
  const zoom = 15;

  // Check if Google Maps API key is available
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return (
      <div className={`w-full h-64 bg-neutral-100 rounded-lg flex items-center justify-center border ${className}`}>
        <div className="text-center text-neutral-500">
          <MapIcon className="h-12 w-12 mx-auto mb-2" />
          <p>Google Maps Integration</p>
          <p className="text-sm">API key required for interactive map</p>
          <p className="text-sm mt-2">Location: {city}, {state}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Wrapper apiKey={apiKey} render={render} libraries={["geometry", "places"]}>
        <MapComponent
          center={center}
          zoom={zoom}
          address={address}
          city={city}
          state={state}
          zipcode={zipcode}
        />
      </Wrapper>
    </div>
  );
}