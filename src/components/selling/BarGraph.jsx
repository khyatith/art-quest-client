import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
  title: {
    display: true,
    text: 'Revenue Generated',
    fontSize: 20,
  },
  legend: {
    display: true,
    position: 'right',
  },
};

const BarGraph = (props) => {
  const { result } = props;
  const [barResults, setBarResults] = useState({});

  useEffect(() => {
    if (!barResults || Object.keys(barResults).length === 0) {
      setBarResults(result);
    }
  }, [result]);

  return (
    barResults && Object.keys(barResults).length > 0 && (
      <div style={{ marginLeft: '10%' }}>
        <Bar data={barResults} options={options} />
      </div>
    )
  );
};

BarGraph.propTypes = {
  result: PropTypes.object.isRequired,
};

export default BarGraph;
