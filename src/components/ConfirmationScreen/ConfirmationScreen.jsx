/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';

const ConfirmationScreen = ({ cityData }) => (
  // random comment
  <div
    style={{
      backgroundSize: 'cover',
      height: '100%',
      width: '100%',
      backgroundImage: `url(${cityData.cityPhoto})`,
      placeItems: 'center',
      display: 'grid',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      gridTemplateRows: '3fr 2fr',
    }}>
    <div style={{ height: '11rem', marginTop: '15rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <h2 style={{ color: 'white' }}>Auction</h2>
          <p style={{ color: 'white', fontSize: '1.5rem', marginLeft: '-1.8rem' }}>in the city {cityData.cityName}</p>
          <p style={{ color: 'white', fontSize: '1.5rem', marginLeft: '-1.8rem' }}>will shortly begin</p>
        </div>
        <div />
      </div>
    </div>
  </div>
);
export default ConfirmationScreen;
