import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import { API_URL } from '../../global/constants';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

function LevelOfInterest() {
  const [levelOfInterest, setLevelOfInterest] = useState();

  const getRandColor = (size) => {
    const result = [];
    for (let i = 0; i <= size; i++) {
      const brightness = i;
      // Six levels of brightness from 0 to 5, 0 being the darkest
      const rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
      const mix = [brightness * 51, brightness * 51, brightness * 51]; // 51 => 255/5
      const mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map((x) => Math.round(x / 2.0));
      result.push(`rgb( ${mixedrgb.join(',')} )`);
    }
    return result;
  };

  const getCityData = async () => {
    const { data } = await axios.get(`${API_URL}/buying/getMap`);
    const randomBackgroundColorsArr = getRandColor(data.length);
    const formattedData = {
      labels: data.map((d) => d.cityName),
      datasets: [
        {
          label: 'Interest in art',
          data: data.map((d) => d.interestInArt),
          backgroundColor: randomBackgroundColorsArr,
          borderWidth: 1,
        },
      ],
    };
    setLevelOfInterest(formattedData);
  };

  useEffect(() => {
    if (!levelOfInterest) {
      getCityData();
    }
  }, [levelOfInterest]);

  return (
    <>
      { levelOfInterest && <PolarArea data={levelOfInterest} /> }
    </>
  );
}

export default LevelOfInterest;
