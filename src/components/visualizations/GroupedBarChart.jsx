import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

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

const GroupedBarChart = (props) => {
  const { results, teamColorMap } = props;
  const [barChartData, setBarChartData] = useState();

  const parseDataForGroupChart = () => {
    const chart = {};
    chart.labels = ['Visits', 'Cash', 'Total'];
    if (results) {
      const dataset = Object.entries(results).map(([key, value]) => {
        console.log('key', key);
        console.log('value', value);
        const teamName = key;
        const { visit, cashPoints, total } = value;
        return {
          label: `${teamName}`,
          data: [visit, cashPoints, total],
          backgroundColor: teamColorMap[teamName],
          barThickness: 30,
        };
      });
      chart.datasets = dataset;
      setBarChartData(chart);
    }
  };

  useEffect(() => {
    parseDataForGroupChart();
  }, [results, teamColorMap]);

  return (
    <div style={{ width: '500px', height: '500px' }}>
      <Bar data={barChartData} options={options} />
    </div>
  );
};

export default GroupedBarChart;
