/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import { useHistory } from 'react-router';
import NominatedPainting from './NominatedPainting';
// import { socket } from '../../global/socket';

const ConfirmationScreen = ({
  cityData, sellToMarket, nominatedPainting, user, classes,
}) =>
  // const history = useHistory();
  // eslint-disable-next-line implicit-arrow-linebreak
  (
  // random comment
    <div
      style={{
        backgroundSize: 'cover',
        height: '100vh',
        width: '100%',
        backgroundImage: `url(${cityData.cityPhoto})`,
        placeItems: 'center',
        display: 'grid',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        // gridTemplateRows: '1fr 1fr',
      }}>
      {sellToMarket ? (
        <div style={{ }}>
          <div style={{
            display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center',
          }}>
            <h2 style={{ color: 'white', textShadow: '0px 4px 20px #000000' }}>The museum in
              {' '}{cityData.cityName} is calculating your revenue.
            </h2>
            <h3 style={{ color: 'white' }}>Your nominated Painting: </h3>
            <div />
          </div>
          <NominatedPainting classes={classes} paintingData={nominatedPainting} />
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <h2 style={{ color: 'white' }}>Auction</h2>
            <p style={{ color: 'white', fontSize: '1.5rem', marginLeft: '-1.8rem' }}>in the city {cityData.cityName}</p>
            <p style={{ color: 'white', fontSize: '1.5rem', marginLeft: '-1.8rem' }}>will shortly begin.</p>
          </div>
          <div />
        </div>

      )}
    </div>
  );
export default ConfirmationScreen;
