/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-assignment */
import React, { Fragment, useEffect } from 'react';
import { Card, Typography, CardMedia, Badge, Paper } from '@material-ui/core';

const artMovementColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(250, 154, 85)', 'rgb(69, 91, 255)', 'rgb(69, 255, 212)'];
const PaintingCards = ({ paintingData, paintingsObj }) => (
  <div style={{ width: '100%' }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        // eslint-disable-next-line react/jsx-closing-bracket-location
      }}
    />
    <h2 style={{ textAlign: 'center' }}>My artwork collection</h2>
    <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'space-around' }}>
      {Object.keys(paintingsObj).map((artMovement, index) => (
        <Paper elevation={2} style={{ borderRadius: '0.5rem' }}>
          <div
            style={{
              height: '2rem',
              width: '100%',
              backgroundColor: artMovementColors[index],
              borderTopLeftRadius: '0.5rem',
              borderTopRightRadius: '0.5rem',
            }}
          />
          <h3 style={{ textAlign: 'center' }}>{artMovement}</h3>
          <div style={{ height: '10rem', overflowY: paintingsObj[artMovement].images.length > 1 ? 'scroll' : 'hidden' }}>
            {paintingsObj[artMovement].images.map((image, paintingIndex) => (
              <div style={{ margin: '1rem' }}>
                <Badge badgeContent={paintingIndex !== 0 ? 5 : '0'} color="secondary">
                  <CardMedia style={{ borderRadius: '0.5rem', width: '8rem' }} component="img" height="100" width="100" image={image} alt="image" />
                </Badge>
              </div>
            ))}
          </div>
          <h4 style={{ color: '#827F7F' }}>
            Classify Points
            {' '}
            <br />
            <span style={{ color: 'green' }}>
              {paintingsObj[artMovement].numberOfPainting * 5}
              {' '}
              points
            </span>
          </h4>
        </Paper>
      ))}
    </div>
  </div>
);

export default PaintingCards;
