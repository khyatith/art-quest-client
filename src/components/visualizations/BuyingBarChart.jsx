import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { TEAM_COLOR_MAP } from '../../global/constants';

const options = {
  responsive: true,
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
    x: {
      grid: {
        offset: true,
      },
    },
  },
};

const BuyingBarChart = (props) => {
  const { labels, results } = props;
  const [barChartData, setBarChartData] = useState();

  const parseDataForGroupChart = () => {
    const chart = {};
    chart.labels = labels;
    if (results) {
      const dataset = Object.entries(results).map(([key, value]) => {
        const teamName = key;
        return {
          label: `${teamName}`,
          data: [value],
          backgroundColor: TEAM_COLOR_MAP[teamName],
          barThickness: 25,
        };
      });
      chart.datasets = dataset;
      setBarChartData(chart);
    }
  };

  useEffect(() => {
    parseDataForGroupChart();
  }, [results]);

  return (
    <div style={{ width: '450px', height: '500px' }}>
      <Bar data={barChartData} options={options} />
    </div>
  );
};

export default BuyingBarChart;
