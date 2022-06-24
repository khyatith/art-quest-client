/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable no-unused-vars */
import { Typography } from '@material-ui/core';
import React from 'react';

const Painting = ({ imageurl, bidAmount, artMovement }) => (
  <>
    <span>
      <img src={imageurl} alt="" style={{ height: '2.5rem', width: '2.5rem', borderRadius: '50%' }} />
      <Typography style={{ fontSize: '10px' }}>
        <span>$</span>
        {bidAmount}
      </Typography>
      <span style={{ fontSize: '10px' }}>{artMovement}</span>
    </span>
  </>
);

const PaintingsShowcase = ({ leaderboard }) => (
  <div>
    <div
      style={{
        height: '6rem',
        border: 'solid 1px black',
        borderRadius: '0.5rem',
        width: '25rem',
        overflowY: 'scroll',
      }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          marginTop: '1rem',
          justifyContent: 'space-evenly',
          alignContent: 'center',
        }}>
        {leaderboard?.map((painting) => (
          <span style={{ marginLeft: '1rem', marginRight: '1rem' }}>
            <Painting imageurl={painting.imageURL} bidAmount={painting.bidAmount} artMovement={painting.artMovement} />
            <hr />
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default PaintingsShowcase;
