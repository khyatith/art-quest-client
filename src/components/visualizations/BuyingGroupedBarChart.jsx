import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { TEAM_COLOR_MAP } from '../../global/constants';
import load from '../../assets/load.webp';

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
  const [loading, setLoading] = useState(true);

  const parseDataForGroupChart = (results) => {
    const chart = {};
    chart.labels = ['Total Paintings', 'Debt', 'Efficiency'];
    if (results) {
      const dataset = Object.entries(results).map(([key, value]) => {
        const teamName = key;
        const { debt, efficiency, totalPaintings } = value;
        const formattedDebt = debt ? parseInt(debt, 10) / 10000 : 0;
        const formattedEfficiency = efficiency ? parseInt(efficiency, 10) / 10000 : 0;
        return {
          label: `${teamName}`,
          data: [parseInt(totalPaintings, 10), formattedDebt, formattedEfficiency],
          backgroundColor: TEAM_COLOR_MAP[teamName],
          barThickness: 30,
        };
      });
      chart.datasets = dataset;
      setBarChartData(chart);
    }
    if (barChartData === undefined) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leaderboardData && leaderboardData.totalAmountByTeam && leaderboardData.teamEfficiency && leaderboardData.leaderboard) {
      const {
        totalAmountByTeam, teamEfficiency, leaderboard, totalPaintingsWonByTeams,
      } = leaderboardData;
      const result = Object.entries(leaderboard).reduce((acc, entry) => {
        const teamName = entry[0];
        acc[teamName] = {
          debt: totalAmountByTeam[teamName],
          efficiency: teamEfficiency[teamName],
          totalPaintings: totalPaintingsWonByTeams[teamName],
        };
        return acc;
      }, {});
      parseDataForGroupChart(result);
    }
  }, [leaderboardData]);

  if (loading) {
    return (<div style={{marginTop: '12%', marginLeft: '43%'}}> <img src={load} alt="loading..." /> </div>);
  }

  return (
    <div style={{ width: '500px', marginTop: '30px' }}>
      <Bar data={barChartData} options={options} />
    </div>
  );
};

export default BuyingGroupedBarChart;
