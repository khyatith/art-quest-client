import React, { Fragment } from 'react';
import { Card, Typography, CardMedia } from '@material-ui/core';

const PaintingCards = ({ paintingData }) => (
  <div style={{ width: '100%' }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        // eslint-disable-next-line react/jsx-closing-bracket-location
      }}>
      {paintingData?.map((i) => (
        <>
          <Card style={{ width: '100%' }}>
            <CardMedia component="img" height="180" image={i.imageURL} alt="image" />
            <Typography style={{ display: 'flex', justifyContent: 'center' }}>{i.artMovement}</Typography>
          </Card>
        </>
      ))}
    </div>
  </div>
);

export default PaintingCards;
