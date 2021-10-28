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
  title:{
    display:true,
    text:'Revenue Generated',
    fontSize:20
  },
  legend:{
    display:true,
    position:'right'
  },
};

const BarGraph = (props) => {
  console.log(props.result);
  return (
    <div style={{ width: '70%',marginLeft:'10%' }}>
      <Bar data={props.result} options={options} />
        </div>
  );
};

export default BarGraph;
