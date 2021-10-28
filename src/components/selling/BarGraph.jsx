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

const state = {
  labels: ['January', 'February', 'March',
           'April', 'May'],
  datasets: [
    {
      label: 'Rainfall',
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 2,
      data: [65, 59, 80, 81, 56]
    }
  ]
}

const BarGraph = (props) => {
  console.log(props.result);
  return (
    <div style={{ width: '450px', height: '500px' }}>
      <Bar data={props.result} options={{
            title:{
              display:true,
              text:'Revenue Generated',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            }
          }} />
        </div>
  );
};

export default BarGraph;
