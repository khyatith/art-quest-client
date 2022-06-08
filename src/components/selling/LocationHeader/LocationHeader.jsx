/* eslint-disable max-len */
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  appbar: {
    backgroundColor: 'brown',
    flexGrow: 1,
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '8fr 2fr',
    height: '69px',
  },
  location: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '1.4rem',
    lineHeight: '108%',
    /* or 32px */
    letterSpacing: '-0.055em',
    color: '#F9F9F9',
  },
  auction_timer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '108%',
    /* or 17px */

    letterSpacing: '-0.055em',

    color: '#F9F9F9',
  },
  timer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '100px',
    color: '#E20000',
    padding: '10px',
  },
}));
function LocationHeader({ cityData, timerValue, timerEnded }) {
  const classes = useStyles();
  return (
    <AppBar className={classes.appbar}>
      {timerEnded ? (<header>Next next round in 15sec</header>)
        : (
          <>
            <header className={classes.location}>{cityData?.cityName}</header>
            <div className={classes.auction_timer}>
              <div style={{ padding: '10px' }}>Auction starts</div>
              {' '}
              <span className={classes.timer}>
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 0.25H5.5V1.91667H10.5V0.25Z" fill="#FFAFAF" />
                  <path
                    d="M13.8583 5.575L15.0417 4.39167C14.6833 3.96667 14.2917 3.56667 13.8667 3.21667L12.6833 4.4C11.3917 3.36667 9.76667 2.75 8 2.75C3.85833 2.75 0.5 6.10833 0.5 10.25C0.5 14.3917 3.85 17.75 8 17.75C12.15 17.75 15.5 14.3917 15.5 10.25C15.5 8.48333 14.8833 6.85833 13.8583 5.575ZM8.83333 11.0833H7.16667V6.08333H8.83333V11.0833Z"
                    fill="#FFAFAF"
                  />
                </svg>
                {timerValue?.seconds}
                {' '}
                secs
              </span>
            </div>

          </>
        )}
    </AppBar>
  );
}

export default LocationHeader;
