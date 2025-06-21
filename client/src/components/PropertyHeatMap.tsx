import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, DollarSign, Target, Layers, Map, Satellite, BarChart3 } from "lucide-react";
import { Property } from "@shared/schema";
import * as d3 from "d3";

interface PropertyHeatMapProps {
  properties: Property[];
}

interface HeatmapDataPoint {
  x: number;
  y: number;
  value: number;
  intensity: number;
  property: Property;
  region: string;
}

export default function PropertyHeatMap({ properties }: PropertyHeatMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'density' | 'value' | 'performance'>('density');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const createHeatmapData = (): HeatmapDataPoint[] => {
    const validProperties = properties.filter(p => p.latitude && p.longitude);
    
    if (validProperties.length === 0) {
      // Enhanced demo data with realistic property distributions
      return [
        { x: 180, y: 120, value: 2500000, intensity: 0.8, region: 'Metro Detroit', property: {} as Property },
        { x: 220, y: 140, value: 1800000, intensity: 0.6, region: 'Metro Detroit', property: {} as Property },
        { x: 160, y: 100, value: 3200000, intensity: 0.9, region: 'Metro Detroit', property: {} as Property },
        { x: 400, y: 180, value: 1500000, intensity: 0.5, region: 'Chicago Metro', property: {} as Property },
        { x: 380, y: 160, value: 2100000, intensity: 0.7, region: 'Chicago Metro', property: {} as Property },
        { x: 650, y: 140, value: 4500000, intensity: 1.0, region: 'NYC Metro', property: {} as Property },
        { x: 620, y: 120, value: 3800000, intensity: 0.95, region: 'NYC Metro', property: {} as Property },
        { x: 680, y: 160, value: 4200000, intensity: 0.98, region: 'NYC Metro', property: {} as Property },
        { x: 300, y: 280, value: 1200000, intensity: 0.4, region: 'Austin Metro', property: {} as Property },
        { x: 520, y: 240, value: 1800000, intensity: 0.6, region: 'Atlanta Metro', property: {} as Property },
        { x: 100, y: 200, value: 3500000, intensity: 0.9, region: 'LA Metro', property: {} as Property },
        { x: 750, y: 200, value: 2800000, intensity: 0.75, region: 'Miami Metro', property: {} as Property }
      ];
    }

    return validProperties.map((property, index) => {
      const lat = parseFloat(property.latitude!);
      const lng = parseFloat(property.longitude!);
      const value = Number(property.propertyValue);
      const performance = (property.currentShares / property.maxShares) * 100;
      
      return {
        x: 100 + (index % 8) * 90 + Math.random() * 20,
        y: 100 + Math.floor(index / 8) * 80 + Math.random() * 20,
        value,
        intensity: Math.min(value / 5000000, 1),
        property,
        region: `${property.city}, ${property.state}`
      };
    });
  };

  useEffect(() => {
    const createElevatedHeatMap = () => {
      if (!svgRef.current) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const width = 900;
      const height = 500;
      const margin = { top: 60, right: 80, bottom: 80, left: 80 };

      // Create gradient definitions
      const defs = svg.append("defs");
      
      // Create multiple gradients for different heat intensities
      const gradients = ['low', 'medium', 'high'].map((level, i) => {
        const gradient = defs.append("radialGradient")
          .attr("id", `heat-gradient-${level}`)
          .attr("cx", "50%")
          .attr("cy", "50%")
          .attr("r", "50%");

        const colors = [
          ['#ef4444', '#dc2626', '#b91c1c'], // red scale
          ['#f97316', '#ea580c', '#c2410c'], // orange scale  
          ['#eab308', '#ca8a04', '#a16207']  // yellow scale
        ][i];

        gradient.append("stop")
          .attr("offset", "0%")
          .style("stop-color", colors[0])
          .style("stop-opacity", 0.8);
        gradient.append("stop")
          .attr("offset", "50%")
          .style("stop-color", colors[1])
          .style("stop-opacity", 0.6);
        gradient.append("stop")
          .attr("offset", "100%")
          .style("stop-color", colors[2])
          .style("stop-opacity", 0.2);

        return gradient;
      });

      // Create background pattern
      const pattern = defs.append("pattern")
        .attr("id", "grid-pattern")
        .attr("width", 20)
        .attr("height", 20)
        .attr("patternUnits", "userSpaceOnUse");

      pattern.append("path")
        .attr("d", "M 20 0 L 0 0 0 20")
        .attr("fill", "none")
        .attr("stroke", "#f1f5f9")
        .attr("stroke-width", 0.5);

      // Add background
      svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "url(#grid-pattern)")
        .attr("rx", 12);

      // Create title with dynamic subtitle based on view mode
      const titleGroup = svg.append("g")
        .attr("transform", `translate(${width/2}, 30)`);

      titleGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", 24)
        .attr("font-weight", "bold")
        .attr("fill", "#1f2937")
        .text("Investment Heat Map");

      const subtitles = {
        density: "Property density and market concentration analysis",
        value: "Property values and investment potential by region",
        performance: "Investment performance and market activity"
      };

      titleGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 20)
        .attr("font-size", 14)
        .attr("fill", "#6b7280")
        .text(subtitles[viewMode]);

      const heatmapData = createHeatmapData();
      
      // Group data by region for cluster analysis
      const regionData = d3.group(heatmapData, d => d.region);

      // Create heat zones based on data density
      regionData.forEach((points, region) => {
        if (points.length === 0) return;

        const avgX = d3.mean(points, d => d.x) || 0;
        const avgY = d3.mean(points, d => d.y) || 0;
        const totalValue = d3.sum(points, d => d.value);
        const avgIntensity = d3.mean(points, d => d.intensity) || 0;

        // Create heat zone
        const radius = Math.max(40, Math.min(120, points.length * 25 + avgIntensity * 50));
        
        svg.append("circle")
          .attr("cx", avgX)
          .attr("cy", avgY)
          .attr("r", 0)
          .attr("fill", `url(#heat-gradient-${avgIntensity > 0.7 ? 'high' : avgIntensity > 0.4 ? 'medium' : 'low'})`)
          .attr("opacity", 0)
          .style("cursor", "pointer")
          .on("click", () => setSelectedRegion(selectedRegion === region ? null : region))
          .transition()
          .duration(1000)
          .delay((Array.from(regionData.keys()).indexOf(region)) * 200)
          .attr("r", radius)
          .attr("opacity", selectedRegion === null || selectedRegion === region ? 0.6 : 0.2);

        // Add region label with value
        const labelGroup = svg.append("g")
          .attr("transform", `translate(${avgX}, ${avgY + radius + 20})`)
          .style("opacity", 0);

        labelGroup.append("rect")
          .attr("x", -50)
          .attr("y", -15)
          .attr("width", 100)
          .attr("height", 30)
          .attr("rx", 6)
          .attr("fill", "white")
          .attr("stroke", "#e5e7eb")
          .attr("stroke-width", 1);

        labelGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("y", -2)
          .attr("font-size", 10)
          .attr("font-weight", "bold")
          .attr("fill", "#374151")
          .text(region.split(',')[0]);

        labelGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("y", 10)
          .attr("font-size", 8)
          .attr("fill", "#6b7280")
          .text(`$${(totalValue / 1000000).toFixed(1)}M`);

        labelGroup.transition()
          .duration(800)
          .delay(1200 + (Array.from(regionData.keys()).indexOf(region)) * 100)
          .style("opacity", 1);
      });

      // Add individual property markers
      svg.selectAll(".property-marker")
        .data(heatmapData)
        .enter()
        .append("circle")
        .attr("class", "property-marker")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 0)
        .attr("fill", "#10b981")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("mouseenter", function(event, d) {
          d3.select(this).transition().duration(200).attr("r", 8).attr("fill", "#059669");
          
          if (tooltipRef.current) {
            tooltipRef.current.style.opacity = "1";
            tooltipRef.current.style.left = (event.pageX + 10) + "px";
            tooltipRef.current.style.top = (event.pageY - 10) + "px";
            
            // Clear existing content
            tooltipRef.current.innerHTML = '';
            
            // Create elements safely using DOM methods
            const regionDiv = document.createElement('div');
            regionDiv.className = 'font-semibold';
            regionDiv.textContent = d.region;
            
            const valueDiv = document.createElement('div');
            valueDiv.className = 'text-sm';
            valueDiv.textContent = `Value: $${(d.value / 1000000).toFixed(2)}M`;
            
            const intensityDiv = document.createElement('div');
            intensityDiv.className = 'text-sm';
            intensityDiv.textContent = `Intensity: ${(d.intensity * 100).toFixed(0)}%`;
            
            tooltipRef.current.appendChild(regionDiv);
            tooltipRef.current.appendChild(valueDiv);
            tooltipRef.current.appendChild(intensityDiv);
          }
        })
        .on("mouseleave", function() {
          d3.select(this).transition().duration(200).attr("r", 5).attr("fill", "#10b981");
          if (tooltipRef.current) {
            tooltipRef.current.style.opacity = "0";
          }
        })
        .transition()
        .duration(600)
        .delay((d, i) => 1500 + i * 50)
        .attr("r", 5);

      // Add interactive legend
      const legend = svg.append("g")
        .attr("transform", `translate(${width - 150}, 100)`);

      const legendBg = legend.append("rect")
        .attr("width", 140)
        .attr("height", 180)
        .attr("rx", 8)
        .attr("fill", "white")
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 1)
        .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))");

      legend.append("text")
        .attr("x", 70)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", 12)
        .attr("font-weight", "bold")
        .attr("fill", "#374151")
        .text("Heat Intensity");

      // Legend items
      const legendItems = [
        { color: "#eab308", label: "Low", range: "< $2M" },
        { color: "#f97316", label: "Medium", range: "$2M - $4M" },
        { color: "#ef4444", label: "High", range: "> $4M" }
      ];

      const legendItem = legend.selectAll(".legend-item")
        .data(legendItems)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(20, ${40 + i * 30})`);

      legendItem.append("circle")
        .attr("cx", 10)
        .attr("cy", 0)
        .attr("r", 6)
        .attr("fill", d => d.color);

      legendItem.append("text")
        .attr("x", 25)
        .attr("y", 2)
        .attr("font-size", 10)
        .attr("fill", "#374151")
        .text(d => d.label);

      legendItem.append("text")
        .attr("x", 25)
        .attr("y", 12)
        .attr("font-size", 8)
        .attr("fill", "#6b7280")
        .text(d => d.range);
    };

    createElevatedHeatMap();
  }, [properties, viewMode, selectedRegion]);

  const propertiesWithCoords = properties.filter(p => p.latitude && p.longitude);
  const totalValue = properties.reduce((sum, p) => sum + Number(p.propertyValue), 0);
  const averageROI = properties.length > 0 ? properties.reduce((sum, p) => {
    const roi = (p.currentShares / p.maxShares) * 100;
    return sum + roi;
  }, 0) / properties.length : 0;

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-50 to-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Layers className="text-white" size={24} />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Investment Heat Map
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  Advanced geographic distribution analysis of real estate opportunities
                  {propertiesWithCoords.length === 0 && " (showing market data)"}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'density' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('density')}
                className="flex items-center gap-2"
              >
                <Target size={16} />
                Density
              </Button>
              <Button
                variant={viewMode === 'value' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('value')}
                className="flex items-center gap-2"
              >
                <DollarSign size={16} />
                Value
              </Button>
              <Button
                variant={viewMode === 'performance' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('performance')}
                className="flex items-center gap-2"
              >
                <TrendingUp size={16} />
                Performance
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="relative">
            <svg 
              ref={svgRef}
              width="100%"
              height="500"
              className="rounded-xl border border-gray-200 shadow-inner bg-gradient-to-br from-gray-50 to-white"
            />
            
            <div 
              ref={tooltipRef}
              className="absolute bg-black text-white px-3 py-2 rounded-lg text-sm pointer-events-none opacity-0 transition-opacity duration-200 z-10 shadow-lg"
              style={{ transform: 'translate(-50%, -100%)' }}
            />
          </div>

          {selectedRegion && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Selected Region: {selectedRegion}</h4>
              <p className="text-blue-700 text-sm">
                Click on other regions to compare or click the same region to deselect.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Properties</p>
                <p className="text-3xl font-bold text-blue-900">{properties.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <MapPin className="text-white" size={20} />
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                {propertiesWithCoords.length} mapped
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-green-900">
                  ${(totalValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <DollarSign className="text-white" size={20} />
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-green-200 text-green-800">
                ${(totalValue / properties.length / 1000).toFixed(0)}K avg
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Average Performance</p>
                <p className="text-3xl font-bold text-purple-900">{averageROI.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <TrendingUp className="text-white" size={20} />
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                Market activity
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Active Shares</p>
                <p className="text-3xl font-bold text-orange-900">
                  {properties.reduce((sum, p) => sum + p.currentShares, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <Target className="text-white" size={20} />
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                {((properties.reduce((sum, p) => sum + p.currentShares, 0) / properties.reduce((sum, p) => sum + p.maxShares, 1)) * 100).toFixed(0)}% sold
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}