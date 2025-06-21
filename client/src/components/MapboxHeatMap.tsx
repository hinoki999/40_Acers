import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, DollarSign, Target, Layers, Map, Satellite, BarChart3, Zap, Activity, Filter } from "lucide-react";
import { Property } from "@shared/schema";
import * as d3 from "d3";

interface EnhancedHeatMapProps {
  properties: Property[];
}

interface HeatMapDataPoint {
  x: number;
  y: number;
  lng: number;
  lat: number;
  value: number;
  intensity: number;
  marketTrend: number;
  roi: number;
  property: Property;
  address: string;
  region: string;
  category: 'high' | 'medium' | 'low';
}

export default function EnhancedHeatMap({ properties }: EnhancedHeatMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'heat' | 'density' | 'performance' | 'geographic'>('heat');
  const [filterMode, setFilterMode] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [animationSpeed, setAnimationSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  // Generate comprehensive heat map data
  const generateHeatMapData = (): HeatMapDataPoint[] => {
    const validProperties = properties.filter(p => p.latitude && p.longitude);
    
    if (validProperties.length === 0) {
      // Enhanced market data with realistic geographic distribution
      return [
        // Metro Detroit - Industrial & Mixed Use
        { x: 180, y: 140, lng: -83.0458, lat: 42.3314, value: 2500000, intensity: 0.8, marketTrend: 15, roi: 12.5, 
          address: "1909 E Ferry St, Detroit, MI", region: "Metro Detroit", category: 'high', property: {} as Property },
        { x: 220, y: 160, lng: -83.0398, lat: 42.3284, value: 1800000, intensity: 0.6, marketTrend: 8, roi: 9.2,
          address: "Downtown Detroit Industrial", region: "Metro Detroit", category: 'medium', property: {} as Property },
        { x: 160, y: 120, lng: -83.0528, lat: 42.3344, value: 3200000, intensity: 0.9, marketTrend: 22, roi: 15.8,
          address: "Midtown Detroit Premium", region: "Metro Detroit", category: 'high', property: {} as Property },
        
        // Chicago Financial District
        { x: 400, y: 180, lng: -87.6298, lat: 41.8781, value: 4500000, intensity: 0.95, marketTrend: 18, roi: 11.3,
          address: "Chicago Loop Tower", region: "Chicago Metro", category: 'high', property: {} as Property },
        { x: 380, y: 160, lng: -87.6244, lat: 41.8756, value: 3800000, intensity: 0.85, marketTrend: 14, roi: 10.7,
          address: "River North Complex", region: "Chicago Metro", category: 'high', property: {} as Property },
        
        // NYC Manhattan Premium
        { x: 650, y: 140, lng: -74.0060, lat: 40.7128, value: 8500000, intensity: 1.0, marketTrend: 25, roi: 8.9,
          address: "Manhattan Financial District", region: "NYC Metro", category: 'high', property: {} as Property },
        { x: 620, y: 120, lng: -73.9857, lat: 40.7484, value: 7200000, intensity: 0.98, marketTrend: 21, roi: 9.4,
          address: "Midtown Manhattan", region: "NYC Metro", category: 'high', property: {} as Property },
        { x: 680, y: 160, lng: -73.9442, lat: 40.8176, value: 4200000, intensity: 0.8, marketTrend: 12, roi: 11.2,
          address: "Bronx Development", region: "NYC Metro", category: 'medium', property: {} as Property },
        
        // West Coast Tech Hubs
        { x: 100, y: 200, lng: -118.2437, lat: 34.0522, value: 6200000, intensity: 0.92, marketTrend: 19, roi: 7.8,
          address: "Downtown LA Tech Center", region: "LA Metro", category: 'high', property: {} as Property },
        { x: 80, y: 120, lng: -122.4194, lat: 37.7749, value: 9500000, intensity: 1.0, marketTrend: 28, roi: 6.5,
          address: "San Francisco SOMA", region: "SF Bay Area", category: 'high', property: {} as Property },
        { x: 90, y: 80, lng: -122.3321, lat: 47.6062, value: 5800000, intensity: 0.89, marketTrend: 16, roi: 9.1,
          address: "Seattle Tech District", region: "Pacific Northwest", category: 'high', property: {} as Property },
        
        // Emerging Markets
        { x: 300, y: 280, lng: -97.7431, lat: 30.2672, value: 2800000, intensity: 0.7, marketTrend: 35, roi: 18.2,
          address: "Austin Innovation Hub", region: "Texas Triangle", category: 'medium', property: {} as Property },
        { x: 750, y: 300, lng: -80.1918, lat: 25.7617, value: 4800000, intensity: 0.85, marketTrend: 13, roi: 10.5,
          address: "Miami Beach Luxury", region: "South Florida", category: 'high', property: {} as Property },
        { x: 520, y: 240, lng: -84.3880, lat: 33.7490, value: 3200000, intensity: 0.75, marketTrend: 17, roi: 13.7,
          address: "Atlanta Business District", region: "Southeast", category: 'medium', property: {} as Property },
        
        // Mountain West Growth
        { x: 280, y: 200, lng: -104.9903, lat: 39.7392, value: 3600000, intensity: 0.78, marketTrend: 24, roi: 14.9,
          address: "Denver Tech Corridor", region: "Mountain West", category: 'medium', property: {} as Property },
        { x: 240, y: 180, lng: -111.8910, lat: 40.7608, value: 2900000, intensity: 0.68, marketTrend: 31, roi: 16.3,
          address: "Salt Lake City Hub", region: "Mountain West", category: 'medium', property: {} as Property }
      ];
    }

    return validProperties.map((property, index) => {
      const value = Number(property.propertyValue);
      const roi = (property.currentShares / property.maxShares) * 100;
      const intensity = Math.min(value / 5000000, 1);
      
      return {
        x: 100 + (index % 8) * 90 + Math.random() * 30,
        y: 100 + Math.floor(index / 8) * 80 + Math.random() * 30,
        lng: parseFloat(property.longitude!),
        lat: parseFloat(property.latitude!),
        value,
        intensity,
        marketTrend: Math.random() * 30 + 5,
        roi: roi * 1.2 + Math.random() * 5,
        property,
        address: `${property.address}, ${property.city}, ${property.state}`,
        region: `${property.city} Metro`,
        category: intensity > 0.7 ? 'high' : intensity > 0.4 ? 'medium' : 'low'
      };
    });
  };

  useEffect(() => {
    const createAdvancedHeatMap = () => {
      if (!svgRef.current) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const width = 1000;
      const height = 600;
      const margin = { top: 60, right: 100, bottom: 80, left: 80 };

      // Create comprehensive gradient definitions
      const defs = svg.append("defs");
      
      // Advanced heat gradients with multiple intensity levels
      const gradientConfigs = [
        { id: 'heat-low', colors: ['#fef3c7', '#fbbf24', '#f59e0b'], opacity: [0.3, 0.6, 0.8] },
        { id: 'heat-medium', colors: ['#fed7aa', '#fb923c', '#ea580c'], opacity: [0.4, 0.7, 0.9] },
        { id: 'heat-high', colors: ['#fecaca', '#f87171', '#dc2626'], opacity: [0.5, 0.8, 1.0] },
        { id: 'performance-gradient', colors: ['#bbf7d0', '#34d399', '#059669'], opacity: [0.4, 0.7, 0.9] }
      ];

      gradientConfigs.forEach(config => {
        const gradient = defs.append("radialGradient")
          .attr("id", config.id)
          .attr("cx", "50%").attr("cy", "50%").attr("r", "60%");

        config.colors.forEach((color, i) => {
          gradient.append("stop")
            .attr("offset", `${i * 50}%`)
            .style("stop-color", color)
            .style("stop-opacity", config.opacity[i]);
        });
      });

      // Create sophisticated background with geographic grid
      const pattern = defs.append("pattern")
        .attr("id", "geo-grid")
        .attr("width", 25).attr("height", 25)
        .attr("patternUnits", "userSpaceOnUse");

      pattern.append("path")
        .attr("d", "M 25 0 L 0 0 0 25")
        .attr("fill", "none")
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.6);

      // Enhanced background with subtle geographic styling
      svg.append("rect")
        .attr("width", width).attr("height", height)
        .attr("fill", "url(#geo-grid)")
        .attr("rx", 16)
        .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))");

      const heatmapData = generateHeatMapData();
      const filteredData = filterMode === 'all' ? heatmapData : heatmapData.filter(d => d.category === filterMode);

      // Create regional clustering and analysis
      const regionGroups = d3.group(filteredData, d => d.region);
      
      // Advanced heat zone rendering with regional analysis
      regionGroups.forEach((points, region) => {
        const avgX = d3.mean(points, d => d.x) || 0;
        const avgY = d3.mean(points, d => d.y) || 0;
        const totalValue = d3.sum(points, d => d.value);
        const avgIntensity = d3.mean(points, d => d.intensity) || 0;
        const avgROI = d3.mean(points, d => d.roi) || 0;
        const marketTrend = d3.mean(points, d => d.marketTrend) || 0;

        // Dynamic radius based on market metrics
        const baseRadius = 60;
        const intensityMultiplier = avgIntensity * 40;
        const trendMultiplier = (marketTrend / 30) * 20;
        const radius = Math.max(baseRadius, baseRadius + intensityMultiplier + trendMultiplier);

        // Multi-layer heat zones
        const heatZone = svg.append("g").attr("class", "heat-zone");

        // Outer glow effect
        heatZone.append("circle")
          .attr("cx", avgX).attr("cy", avgY)
          .attr("r", 0)
          .attr("fill", `url(#heat-${avgIntensity > 0.7 ? 'high' : avgIntensity > 0.4 ? 'medium' : 'low'})`)
          .attr("opacity", 0)
          .style("filter", "blur(8px)")
          .transition()
          .duration(getAnimationDuration())
          .delay(Array.from(regionGroups.keys()).indexOf(region) * 150)
          .attr("r", radius * 1.3)
          .attr("opacity", 0.3);

        // Main heat zone
        heatZone.append("circle")
          .attr("cx", avgX).attr("cy", avgY)
          .attr("r", 0)
          .attr("fill", `url(#heat-${avgIntensity > 0.7 ? 'high' : avgIntensity > 0.4 ? 'medium' : 'low'})`)
          .attr("opacity", 0)
          .style("cursor", "pointer")
          .on("mouseover", function() {
            d3.select(this).transition().duration(200).attr("opacity", 0.9);
            showRegionalTooltip(region, { totalValue, avgROI, marketTrend, pointCount: points.length }, [avgX, avgY]);
          })
          .on("mouseout", function() {
            d3.select(this).transition().duration(200).attr("opacity", 0.6);
            hideTooltip();
          })
          .transition()
          .duration(getAnimationDuration())
          .delay(Array.from(regionGroups.keys()).indexOf(region) * 150)
          .attr("r", radius)
          .attr("opacity", 0.6);

        // Advanced region labeling with market metrics
        const labelGroup = svg.append("g")
          .attr("transform", `translate(${avgX}, ${avgY + radius + 25})`)
          .style("opacity", 0);

        // Enhanced label background
        labelGroup.append("rect")
          .attr("x", -65).attr("y", -20)
          .attr("width", 130).attr("height", 40)
          .attr("rx", 8)
          .attr("fill", "white")
          .attr("stroke", "#e5e7eb")
          .attr("stroke-width", 1)
          .style("filter", "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))");

        // Region name
        labelGroup.append("text")
          .attr("text-anchor", "middle").attr("y", -5)
          .attr("font-size", 11).attr("font-weight", "bold")
          .attr("fill", "#374151")
          .text(region.split(' ')[0]);

        // Market metrics display
        labelGroup.append("text")
          .attr("text-anchor", "middle").attr("y", 8)
          .attr("font-size", 9).attr("fill", "#6b7280")
          .text(`$${(totalValue / 1000000).toFixed(1)}M • ${avgROI.toFixed(1)}% ROI`);

        labelGroup.append("text")
          .attr("text-anchor", "middle").attr("y", 20)
          .attr("font-size", 8).attr("fill", marketTrend > 15 ? "#059669" : "#6b7280")
          .text(`↗ ${marketTrend.toFixed(1)}% growth`);

        labelGroup.transition()
          .duration(getAnimationDuration() * 0.8)
          .delay(getAnimationDuration() + Array.from(regionGroups.keys()).indexOf(region) * 100)
          .style("opacity", 1);
      });

      // Enhanced property markers with performance indicators
      const markers = svg.selectAll(".enhanced-marker")
        .data(filteredData)
        .enter()
        .append("g")
        .attr("class", "enhanced-marker")
        .attr("transform", d => `translate(${d.x}, ${d.y})`);

      // Performance ring indicator
      markers.append("circle")
        .attr("r", 0)
        .attr("fill", "none")
        .attr("stroke", d => d.roi > 15 ? "#059669" : d.roi > 10 ? "#f59e0b" : "#6b7280")
        .attr("stroke-width", 2)
        .attr("opacity", 0.7)
        .transition()
        .duration(getAnimationDuration())
        .delay((d, i) => getAnimationDuration() * 1.5 + i * 30)
        .attr("r", d => 12 + d.intensity * 8);

      // Main property marker
      markers.append("circle")
        .attr("r", 0)
        .attr("fill", d => d.category === 'high' ? "#dc2626" : d.category === 'medium' ? "#f59e0b" : "#10b981")
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          d3.select(this).transition().duration(200).attr("r", 12);
          showPropertyTooltip(d, [d.x, d.y]);
        })
        .on("mouseout", function() {
          d3.select(this).transition().duration(200).attr("r", d => 6 + d.intensity * 4);
          hideTooltip();
        })
        .transition()
        .duration(getAnimationDuration())
        .delay((d, i) => getAnimationDuration() * 1.5 + i * 30)
        .attr("r", d => 6 + d.intensity * 4);

      // Market trend indicators
      markers.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 3)
        .attr("font-size", 8)
        .attr("font-weight", "bold")
        .attr("fill", "white")
        .style("opacity", 0)
        .text("$")
        .transition()
        .duration(getAnimationDuration())
        .delay((d, i) => getAnimationDuration() * 2 + i * 30)
        .style("opacity", 1);

      // Advanced interactive legend with market analysis
      createInteractiveLegend(svg, width, height);
    };

    const getAnimationDuration = () => {
      switch (animationSpeed) {
        case 'slow': return 2000;
        case 'fast': return 500;
        default: return 1000;
      }
    };

    const showPropertyTooltip = (data: HeatMapDataPoint, position: [number, number]) => {
      if (!tooltipRef.current) return;
      
      tooltipRef.current.style.opacity = "1";
      tooltipRef.current.style.left = (position[0] + 20) + "px";
      tooltipRef.current.style.top = (position[1] - 10) + "px";
      
      // Clear existing content
      tooltipRef.current.textContent = '';
      
      // Create elements safely
      const addressDiv = document.createElement('div');
      addressDiv.className = 'font-semibold text-sm mb-2';
      addressDiv.textContent = data.address;
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'space-y-1 text-xs';
      
      // Value row
      const valueRow = document.createElement('div');
      valueRow.className = 'flex justify-between';
      valueRow.innerHTML = `<span>Value:</span><span class="font-semibold">$${(data.value / 1000000).toFixed(2)}M</span>`;
      
      // ROI row
      const roiRow = document.createElement('div');
      roiRow.className = 'flex justify-between';
      roiRow.innerHTML = `<span>ROI:</span><span class="font-semibold text-green-600">${data.roi.toFixed(1)}%</span>`;
      
      // Market trend row
      const trendRow = document.createElement('div');
      trendRow.className = 'flex justify-between';
      trendRow.innerHTML = `<span>Market Trend:</span><span class="font-semibold text-blue-600">+${data.marketTrend.toFixed(1)}%</span>`;
      
      // Category row
      const categoryRow = document.createElement('div');
      categoryRow.className = 'flex justify-between';
      const categoryLabel = document.createElement('span');
      categoryLabel.textContent = 'Category:';
      const categoryValue = document.createElement('span');
      categoryValue.className = 'font-semibold capitalize';
      categoryValue.textContent = data.category;
      categoryRow.appendChild(categoryLabel);
      categoryRow.appendChild(categoryValue);
      
      contentDiv.appendChild(valueRow);
      contentDiv.appendChild(roiRow);
      contentDiv.appendChild(trendRow);
      contentDiv.appendChild(categoryRow);
      
      tooltipRef.current.appendChild(addressDiv);
      tooltipRef.current.appendChild(contentDiv);
    };

    const showRegionalTooltip = (region: string, metrics: any, position: [number, number]) => {
      if (!tooltipRef.current) return;
      
      tooltipRef.current.style.opacity = "1";
      tooltipRef.current.style.left = (position[0] + 20) + "px";
      tooltipRef.current.style.top = (position[1] - 10) + "px";
      
      // Clear existing content
      tooltipRef.current.textContent = '';
      
      // Create header
      const headerDiv = document.createElement('div');
      headerDiv.className = 'font-semibold text-sm mb-2';
      headerDiv.textContent = `${region} Region`;
      
      // Create content container
      const contentDiv = document.createElement('div');
      contentDiv.className = 'space-y-1 text-xs';
      
      // Total Value row
      const valueRow = document.createElement('div');
      valueRow.className = 'flex justify-between';
      const valueLabel = document.createElement('span');
      valueLabel.textContent = 'Total Value:';
      const valueAmount = document.createElement('span');
      valueAmount.className = 'font-semibold';
      valueAmount.textContent = `$${(metrics.totalValue / 1000000).toFixed(1)}M`;
      valueRow.appendChild(valueLabel);
      valueRow.appendChild(valueAmount);
      
      // Avg ROI row
      const roiRow = document.createElement('div');
      roiRow.className = 'flex justify-between';
      const roiLabel = document.createElement('span');
      roiLabel.textContent = 'Avg ROI:';
      const roiValue = document.createElement('span');
      roiValue.className = 'font-semibold text-green-600';
      roiValue.textContent = `${metrics.avgROI.toFixed(1)}%`;
      roiRow.appendChild(roiLabel);
      roiRow.appendChild(roiValue);
      
      // Growth Rate row
      const growthRow = document.createElement('div');
      growthRow.className = 'flex justify-between';
      const growthLabel = document.createElement('span');
      growthLabel.textContent = 'Growth Rate:';
      const growthValue = document.createElement('span');
      growthValue.className = 'font-semibold text-blue-600';
      growthValue.textContent = `+${metrics.marketTrend.toFixed(1)}%`;
      growthRow.appendChild(growthLabel);
      growthRow.appendChild(growthValue);
      
      // Properties count row
      const propertiesRow = document.createElement('div');
      propertiesRow.className = 'flex justify-between';
      const propertiesLabel = document.createElement('span');
      propertiesLabel.textContent = 'Properties:';
      const propertiesCount = document.createElement('span');
      propertiesCount.className = 'font-semibold';
      propertiesCount.textContent = `${metrics.pointCount}`;
      propertiesRow.appendChild(propertiesLabel);
      propertiesRow.appendChild(propertiesCount);
      
      contentDiv.appendChild(valueRow);
      contentDiv.appendChild(roiRow);
      contentDiv.appendChild(growthRow);
      contentDiv.appendChild(propertiesRow);
      
      tooltipRef.current.appendChild(headerDiv);
      tooltipRef.current.appendChild(contentDiv);
    };

    const hideTooltip = () => {
      if (tooltipRef.current) {
        tooltipRef.current.style.opacity = "0";
      }
    };

    const createInteractiveLegend = (svg: any, width: number, height: number) => {
      const legend = svg.append("g")
        .attr("transform", `translate(${width - 180}, 80)`);

      // Enhanced legend background
      legend.append("rect")
        .attr("width", 170).attr("height", 220)
        .attr("rx", 12).attr("fill", "white")
        .attr("stroke", "#e5e7eb").attr("stroke-width", 1)
        .style("filter", "drop-shadow(0 8px 25px rgba(0, 0, 0, 0.1))");

      // Legend title
      legend.append("text")
        .attr("x", 85).attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("font-size", 14).attr("font-weight", "bold")
        .attr("fill", "#374151")
        .text("Market Analysis");

      // Category indicators
      const categories = [
        { label: "High Value", color: "#dc2626", range: "> $5M", description: "Premium properties" },
        { label: "Medium Value", color: "#f59e0b", range: "$2M - $5M", description: "Growth potential" },
        { label: "Emerging", color: "#10b981", range: "< $2M", description: "High ROI opportunity" }
      ];

      const categoryItems = legend.selectAll(".legend-category")
        .data(categories)
        .enter()
        .append("g")
        .attr("class", "legend-category")
        .attr("transform", (d, i) => `translate(20, ${50 + i * 35})`);

      categoryItems.append("circle")
        .attr("cx", 8).attr("cy", 0)
        .attr("r", 6)
        .attr("fill", d => d.color);

      categoryItems.append("text")
        .attr("x", 20).attr("y", 2)
        .attr("font-size", 11).attr("font-weight", "bold")
        .attr("fill", "#374151")
        .text(d => d.label);

      categoryItems.append("text")
        .attr("x", 20).attr("y", 13)
        .attr("font-size", 9).attr("fill", "#6b7280")
        .text(d => d.range);

      categoryItems.append("text")
        .attr("x", 20).attr("y", 23)
        .attr("font-size", 8).attr("fill", "#9ca3af")
        .text(d => d.description);

      // Performance metrics legend
      legend.append("text")
        .attr("x", 20).attr("y", 170)
        .attr("font-size", 12).attr("font-weight", "bold")
        .attr("fill", "#374151")
        .text("Performance Indicators");

      const metrics = [
        { label: "Ring Color", description: "ROI Performance" },
        { label: "Heat Intensity", description: "Market Activity" },
        { label: "Marker Size", description: "Property Value" }
      ];

      const metricItems = legend.selectAll(".legend-metric")
        .data(metrics)
        .enter()
        .append("g")
        .attr("class", "legend-metric")
        .attr("transform", (d, i) => `translate(20, ${185 + i * 12})`);

      metricItems.append("text")
        .attr("x", 0).attr("y", 0)
        .attr("font-size", 9).attr("fill", "#6b7280")
        .text(d => `${d.label}: ${d.description}`);
    };

    createAdvancedHeatMap();
  }, [properties, viewMode, filterMode, animationSpeed]);

  const heatmapData = generateHeatMapData();
  const filteredData = filterMode === 'all' ? heatmapData : heatmapData.filter(d => d.category === filterMode);
  const totalValue = filteredData.reduce((sum, point) => sum + point.value, 0);
  const avgROI = filteredData.reduce((sum, point) => sum + point.roi, 0) / filteredData.length;
  const avgMarketTrend = filteredData.reduce((sum, point) => sum + point.marketTrend, 0) / filteredData.length;

  return (
    <div className="space-y-6">
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="text-white" size={24} />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-900 to-purple-600 bg-clip-text text-transparent">
                  Advanced Market Heat Map
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  Interactive geographic analysis with comprehensive market intelligence
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'heat' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('heat')}
                  className="flex items-center gap-1"
                >
                  <Activity size={14} />
                  Heat
                </Button>
                <Button
                  variant={viewMode === 'density' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('density')}
                  className="flex items-center gap-1"
                >
                  <Target size={14} />
                  Density
                </Button>
                <Button
                  variant={viewMode === 'performance' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('performance')}
                  className="flex items-center gap-1"
                >
                  <TrendingUp size={14} />
                  Performance
                </Button>
              </div>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={filterMode === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterMode('all')}
                  className="flex items-center gap-1"
                >
                  All
                </Button>
                <Button
                  variant={filterMode === 'high' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterMode('high')}
                  className="flex items-center gap-1"
                >
                  <Filter size={14} />
                  High
                </Button>
                <Button
                  variant={filterMode === 'medium' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterMode('medium')}
                  className="flex items-center gap-1"
                >
                  Medium
                </Button>
                <Button
                  variant={filterMode === 'low' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterMode('low')}
                  className="flex items-center gap-1"
                >
                  Low
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="relative">
            <svg 
              ref={svgRef}
              width="100%"
              height="600"
              className="rounded-xl border border-gray-200 shadow-inner bg-gradient-to-br from-gray-50 to-white"
            />
            
            <div 
              ref={tooltipRef}
              className="absolute bg-gray-900 text-white px-4 py-3 rounded-lg text-sm pointer-events-none opacity-0 transition-opacity duration-200 z-20 shadow-2xl max-w-xs"
              style={{ transform: 'translate(-50%, -100%)' }}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-700 text-sm font-medium">Market Coverage</p>
                    <p className="text-2xl font-bold text-emerald-900">{filteredData.length}</p>
                    <p className="text-xs text-emerald-600">Active properties</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                    <Target className="text-white" size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Total Portfolio</p>
                    <p className="text-2xl font-bold text-blue-900">
                      ${(totalValue / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-xs text-blue-600">Market value</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <DollarSign className="text-white" size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-medium">Average ROI</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {avgROI.toFixed(1)}%
                    </p>
                    <p className="text-xs text-purple-600">Return rate</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="text-white" size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-700 text-sm font-medium">Market Growth</p>
                    <p className="text-2xl font-bold text-orange-900">
                      +{avgMarketTrend.toFixed(1)}%
                    </p>
                    <p className="text-xs text-orange-600">YoY trend</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                    <BarChart3 className="text-white" size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Animation Speed:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={animationSpeed === 'slow' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setAnimationSpeed('slow')}
                >
                  Slow
                </Button>
                <Button
                  variant={animationSpeed === 'normal' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setAnimationSpeed('normal')}
                >
                  Normal
                </Button>
                <Button
                  variant={animationSpeed === 'fast' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setAnimationSpeed('fast')}
                >
                  Fast
                </Button>
              </div>
            </div>
            
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
              Showing {filterMode === 'all' ? 'All Categories' : `${filterMode.charAt(0).toUpperCase() + filterMode.slice(1)} Value Properties`}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}