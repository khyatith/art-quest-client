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
          color: '#000000',
          textStrokeColor: '#000000',
          backdropColor: '#000000',
        },
      },
    ],
    x: {
      grid: {
        offset: true,
        color: '#000000',
        textStrokeColor: '#000000',
        backdropColor: '#000000',
      },
    },
  },
};

const BuyingGroupedBarChart = (props) => {
  const { leaderboardData } = props;
  const [barChartData, setBarChartData] = useState();

  const parseDataForGroupChart = (results) => {
    const chart = {};
    chart.labels = ['Debt', 'Efficiency'];
    if (results) {
      const dataset = Object.entries(results).map(([key, value]) => {
        const teamName = key;
        const { debt, efficiency } = value;
        return {
          label: `${teamName}`,
          data: [debt, efficiency],
          backgroundColor: TEAM_COLOR_MAP[teamName],
          barThickness: 30,
        };
      });
      chart.datasets = dataset;
      setBarChartData(chart);
    }
  };

  useEffect(() => {
    if (leaderboardData && leaderboardData.totalAmountByTeam && leaderboardData.teamEfficiency && leaderboardData.leaderboard) {
      const { totalAmountByTeam, teamEfficiency, leaderboard } = leaderboardData;
      const result = Object.entries(leaderboard).reduce((acc, entry) => {
        const teamName = entry[0];
        acc[teamName] = {
          debt: totalAmountByTeam[teamName],
          efficiency: teamEfficiency[teamName],
        };
        return acc;
      }, {});
      parseDataForGroupChart(result);
    }
  }, [leaderboardData]);

  return (
    <div style={{ width: '500px', marginTop: '30px' }}>
      <Bar data={barChartData} options={options} />
    </div>
  );
};

export default BuyingGroupedBarChart;
