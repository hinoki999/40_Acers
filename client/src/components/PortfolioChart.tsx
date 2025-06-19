import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";

interface PortfolioChartProps {
  data?: number[];
  labels?: string[];
}

export default function PortfolioChart({ 
  data = [2800, 3200, 2900, 3800, 4200, 4502],
  labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
}: PortfolioChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Total Assets',
          data,
          borderColor: 'hsl(159, 62%, 40%)',
          backgroundColor: 'hsla(159, 62%, 40%, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'hsl(159, 62%, 40%)',
          pointBorderColor: 'hsl(159, 62%, 40%)',
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'hsl(220, 14%, 96%)'
            },
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        elements: {
          point: {
            hoverRadius: 8
          }
        }
      }
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels]);

  return (
    <div className="h-64 w-full">
      <canvas ref={chartRef} />
    </div>
  );
}
