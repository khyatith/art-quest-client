/* eslint-disable max-len */
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function NominatedPainting({ classes, paintingData }) {
  return (
    <Card className={classes['painting-container']} style={{ width: '50%', margin: '0 auto', height: 'inherit' }}>
      <div className={classes['painting-img_container']} style={{ backgroundImage: `url(${paintingData.imageURL})`, backgroundSize: 'cover', paddingBottom: '0' }}>
        <p className={classes['painting-art_movement']}>{paintingData.artMovement}</p>
      </div>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          margin: '0',
          padding: '5px',
          justifyContent: 'space-between',
        }}
      >
        <h3 style={{ margin: '0' }}>{paintingData.name}</h3>
        <h6 style={{ margin: '0' }}>{paintingData.artist}</h6>
      </CardContent>
    </Card>
  );
}

export default NominatedPainting;
