import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { IGraphValue } from '../CityCard/CityCard';

interface WeatherChartProps {
  data: IGraphValue;
  acceptableTemp: boolean;
  temperatureMode: string;
}

interface ChartData {
  datasets: {
    backgroundColor: string;
    borderColor: string;
    data: string[];
    borderWidth: number;
    fill: {
      above: CanvasGradient;
      target: string;
    };
    pointRadius: number;
  }[];
  labels: string[];
}

interface ILinearScale {
  min: number;
  max: number;
  display: boolean;
  reverse: boolean
}

interface ChartOptions {
  plugins: {
    legend: {
      display: boolean;
    };
  };
  scales: {
    x: {
      grid: {
        display: boolean;
      };
      display: boolean;
    };
    y: ILinearScale;
  };
  animation: {
    onComplete: () => void;
  };
}

interface ChartConfig {
  data: ChartData;
  options: ChartOptions;
  type: string;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ data, acceptableTemp, temperatureMode }) => {
  const chartContainer = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<'line', string[], string> | null>(null);


  useEffect(() => {
    if (data && chartContainer.current) {
      if (chartInstance.current) {
        chartInstance.current?.destroy();
      }

      const ctx = chartContainer.current.getContext('2d');

      if (!ctx) return;

      const gradientTemp = () => {
        if (acceptableTemp) {
          const gradient = ctx!.createLinearGradient(0, 0, 0, chartContainer.current!.height);
          gradient.addColorStop(0, 'rgba(255, 162, 91, 1)');
          gradient.addColorStop(1, 'rgba(255, 244, 244, 1)');
          return gradient;
        } else {
          const gradient = ctx!.createLinearGradient(0, 0, 0, chartContainer.current!.height);
          gradient.addColorStop(0, '#5B8CFF');
          gradient.addColorStop(1, '#FFF4F4');
          return gradient;
        }
      };


      let minTemp = Math.min(...data.temperatures);
      let maxTemp = Math.max(...data.temperatures);


      const yScaleOptions: ILinearScale = {
        display: false,
        reverse: false,
        min: minTemp - Math.abs(minTemp * 0.9),
        max: maxTemp + Math.abs(maxTemp * 0.9),
      };

      const chartConfig: ChartConfig = {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [{
            data: data.temperatures,
            backgroundColor: acceptableTemp ? 'rgba(255, 162, 91, 1)' : '#5B8CFF',
            borderColor: acceptableTemp ? 'rgba(255, 162, 91, 1)' : '#5B8CFF',
            fill: {
              target: 'origin',
              above: gradientTemp()
            },
            borderWidth: 2,
            pointRadius: 0,
          }]
        },
        options: {
          animation: {
            onComplete: function() {
              const { ctx, data } = this;

              ctx.fillStyle = '#C5C5C5';
              ctx.textAlign = 'center';

              data.datasets?.forEach((d, index) => {
                this.getDatasetMeta(index).data?.forEach((n, i) => {
                  !acceptableTemp ? ctx.fillText(d.data[i], n.x, n.y + 10) : ctx.fillText(d.data[i], n.x, n.y - 10);
                });
              });
            }
          },
          scales: {
            y: yScaleOptions,
            x: {
              display: true,
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
          },
        },
      };

      chartInstance.current = new Chart(ctx!, chartConfig);
    }
  }, [data, acceptableTemp]);

  return <canvas ref={chartContainer} width="320px" height="75px" />;
};

export default WeatherChart;
