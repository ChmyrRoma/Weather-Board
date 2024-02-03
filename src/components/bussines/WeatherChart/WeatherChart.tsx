import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import {IGraphValue} from "../CityCard/CityCard.tsx";

const WeatherChart = ({ data, acceptableTemp } : { data: IGraphValue, acceptableTemp: boolean }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (data && chartContainer.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartContainer.current.getContext('2d');

      const gradientTemp = () => {

        if (acceptableTemp) {
          const gradient = ctx.createLinearGradient(0, 0, 0, chartContainer.current.height);
                gradient.addColorStop(0, 'rgba(255, 162, 91, 1)');
                gradient.addColorStop(1, 'rgba(255, 244, 244, 1)');
          return gradient
        } else {
          const gradient = ctx.createLinearGradient(0, 0, 0, chartContainer.current.height);
                gradient.addColorStop(0, '#5B8CFF');
                gradient.addColorStop(1, '#FFF4F4');
          return gradient
        }
      }


      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [{
            data: data.temperatures,
            backgroundColor: acceptableTemp ? 'rgba(255, 162, 91, 1)' : '#5B8CFF',
            borderColor: acceptableTemp ? 'rgba(255, 162, 91, 1)' : '#5B8CFF',
            pointLabel: {
              display: false,
              formatter: function(context) {
                return context.parsed.y.toFixed(1);
              },
              font: {
                size: 12
              },
              color: 'black'
            },
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
            onComplete: function () {
              const { ctx, data, chart } = this;

              ctx.fillStyle = '#C5C5C5';
              ctx.textAlign = 'center';

              data.datasets.forEach((d, index) => {
                this.getDatasetMeta(index).data.forEach((n, i) => {
                  ctx.fillText(d.data[i], n.x, n.y - 10);
                });
              });
            }
          },
          scales: {
            y: {
              display: false,
              reverse: false,
              min: Math.min(...data.temperatures) - 1,
              max: Math.max(...data.temperatures) + 9
            },
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
      });
    }
  }, [data, acceptableTemp]);

  return <canvas ref={chartContainer} width="320px" height="70px" />;
};

export default WeatherChart;
