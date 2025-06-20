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
    // Since we don't have a Google Maps API key, we'll use a different approach
    // Create a fallback map visualization
    initializeMap();

    function initializeMap() {
      if (!mapRef.current) return;

      // Create a simple visual representation without Google Maps
      const validProperties = properties.filter(p => p.latitude && p.longitude);
      
      // Create a custom visualization
      const mapContainer = mapRef.current;
      mapContainer.innerHTML = '';
      
      // Create SVG visualization
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('viewBox', '0 0 800 400');
      svg.style.backgroundColor = '#f8fafc';
      svg.style.borderRadius = '8px';
      
      // Add title
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      title.setAttribute('x', '400');
      title.setAttribute('y', '30');
      title.setAttribute('text-anchor', 'middle');
      title.setAttribute('fill', '#374151');
      title.setAttribute('font-size', '18');
      title.setAttribute('font-weight', 'bold');
      title.textContent = validProperties.length > 0 ? 'Property Locations' : 'Property Distribution Map';
      svg.appendChild(title);
      
      if (validProperties.length === 0) {
        // Show representative data points for demo
        const demoData = [
          { x: 150, y: 120, label: 'West Coast', count: 2, value: 500000 },
          { x: 400, y: 150, label: 'Central', count: 1, value: 300000 },
          { x: 650, y: 130, label: 'East Coast', count: 3, value: 800000 },
          { x: 300, y: 250, label: 'Southwest', count: 1, value: 250000 },
          { x: 550, y: 200, label: 'Southeast', count: 2, value: 400000 }
        ];
        
        demoData.forEach((point, index) => {
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', point.x.toString());
          circle.setAttribute('cy', point.y.toString());
          circle.setAttribute('r', Math.max(8, point.count * 3).toString());
          circle.setAttribute('fill', '#3B82F6');
          circle.setAttribute('opacity', '0.7');
          circle.setAttribute('stroke', 'white');
          circle.setAttribute('stroke-width', '2');
          
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', point.x.toString());
          text.setAttribute('y', (point.y + 25).toString());
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('fill', '#374151');
          text.setAttribute('font-size', '10');
          text.textContent = point.label;
          
          svg.appendChild(circle);
          svg.appendChild(text);
        });
        
        const subtitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        subtitle.setAttribute('x', '400');
        subtitle.setAttribute('y', '350');
        subtitle.setAttribute('text-anchor', 'middle');
        subtitle.setAttribute('fill', '#6B7280');
        subtitle.setAttribute('font-size', '12');
        subtitle.textContent = 'Visualization of property investment opportunities across regions';
        svg.appendChild(subtitle);
      } else {
        // Show actual property locations
        const maxLat = Math.max(...validProperties.map(p => parseFloat(p.latitude!)));
        const minLat = Math.min(...validProperties.map(p => parseFloat(p.latitude!)));
        const maxLng = Math.max(...validProperties.map(p => parseFloat(p.longitude!)));
        const minLng = Math.min(...validProperties.map(p => parseFloat(p.longitude!)));
        
        // Add padding to prevent edge clipping
        const latRange = maxLat - minLat || 0.01;
        const lngRange = maxLng - minLng || 0.01;
        
        validProperties.forEach((property, index) => {
          const lat = parseFloat(property.latitude!);
          const lng = parseFloat(property.longitude!);
          
          // Normalize coordinates to SVG space with padding
          const x = 100 + ((lng - minLng) / lngRange) * 600;
          const y = 80 + ((maxLat - lat) / latRange) * 250;
          
          // Create property marker
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', x.toString());
          circle.setAttribute('cy', y.toString());
          circle.setAttribute('r', '8');
          circle.setAttribute('fill', '#10B981');
          circle.setAttribute('stroke', 'white');
          circle.setAttribute('stroke-width', '2');
          circle.style.cursor = 'pointer';
          
          // Add hover effects
          circle.addEventListener('mouseenter', () => {
            circle.setAttribute('r', '12');
            circle.setAttribute('fill', '#059669');
          });
          circle.addEventListener('mouseleave', () => {
            circle.setAttribute('r', '8');
            circle.setAttribute('fill', '#10B981');
          });
          
          // Add property label
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', x.toString());
          text.setAttribute('y', (y + 25).toString());
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('fill', '#374151');
          text.setAttribute('font-size', '10');
          text.setAttribute('font-weight', 'bold');
          text.textContent = `${property.city}`;
          
          // Add property value
          const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          valueText.setAttribute('x', x.toString());
          valueText.setAttribute('y', (y + 37).toString());
          valueText.setAttribute('text-anchor', 'middle');
          valueText.setAttribute('fill', '#6B7280');
          valueText.setAttribute('font-size', '8');
          valueText.textContent = `$${(Number(property.propertyValue) / 1000).toFixed(0)}K`;
          
          svg.appendChild(circle);
          svg.appendChild(text);
          svg.appendChild(valueText);
        });
        
        // Add legend
        const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const legendBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        legendBg.setAttribute('x', '20');
        legendBg.setAttribute('y', '320');
        legendBg.setAttribute('width', '150');
        legendBg.setAttribute('height', '60');
        legendBg.setAttribute('fill', 'white');
        legendBg.setAttribute('stroke', '#E5E7EB');
        legendBg.setAttribute('rx', '4');
        
        const legendTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        legendTitle.setAttribute('x', '30');
        legendTitle.setAttribute('y', '340');
        legendTitle.setAttribute('fill', '#374151');
        legendTitle.setAttribute('font-size', '12');
        legendTitle.setAttribute('font-weight', 'bold');
        legendTitle.textContent = 'Properties';
        
        const legendDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        legendDot.setAttribute('cx', '35');
        legendDot.setAttribute('cy', '355');
        legendDot.setAttribute('r', '4');
        legendDot.setAttribute('fill', '#10B981');
        
        const legendText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        legendText.setAttribute('x', '45');
        legendText.setAttribute('y', '360');
        legendText.setAttribute('fill', '#6B7280');
        legendText.setAttribute('font-size', '10');
        legendText.textContent = 'Investment Opportunity';
        
        legend.appendChild(legendBg);
        legend.appendChild(legendTitle);
        legend.appendChild(legendDot);
        legend.appendChild(legendText);
        svg.appendChild(legend);
      }
      
      mapContainer.appendChild(svg);
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