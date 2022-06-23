/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';

const ClassifyChart = ({ classifyPoints }) => {
  useEffect(() => {}, []);

  return (
    <div>
      <div style={{ width: '22rem' }}>
        <Doughnut data={classifyPoints} />
      </div>
    </div>
  );
};

export default ClassifyChart;
