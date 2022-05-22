/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const ChartComponent = ({ ChartData }) => (
  <div style={{ width: '20rem' }}>
    <Doughnut data={ChartData} />
  </div>
);

export default ChartComponent;
