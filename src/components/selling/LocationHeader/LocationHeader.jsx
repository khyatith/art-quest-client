/* eslint-disable max-len */
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import { isNaN } from 'lodash';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  appbar: {
    flexGrow: 1,
    position: 'fixed',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    height: 130,
  },
  title: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontStyle: 'normal',
    // fontWeight: '600',
    fontSize: '1.25rem',
    lineHeight: '108%',
    marginLeft: '10px',
    /* or 32px */
    letterSpacing: '-0.055em',
    color: '#F9F9F9',
    // color: '#051207',

  },
  timer_container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  auction_timer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontStyle: 'normal',
    // fontWeight: '500',
    fontSize: '20px',
    lineHeight: '108%',
    /* or 17px */
    letterSpacing: '-0.055em',
  },
  timer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '100px',
    // color: '#E20000',
    color: '#051207',
    padding: '10px',
  },
  playercontent: {
    display: 'flex',
    fontSize: '1.25rem',
    position: 'relative',
    marginRight: '10px',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // fontWeight: 700,
  },
}));
function LocationHeader({
  cityData, timerValue, timerEnded, user,
}) {
  const classes = useStyles();
  console.log(isNaN(timerValue?.total));
  return (
    <AppBar className={classes.appbar}>
      <>
        <Typography variant="h6" className={classes.title}>
          ART QUEST
        </Typography>
        <div className={classes.timer_container}>
          <div className={classes.auction_timer}>
            {!timerEnded ? (
              <>
                <div style={{ padding: '5px' }}>
                  {timerValue && (
                    `Next phase starts in:
                  ${timerValue && timerValue.minutes} : ${timerValue && timerValue.seconds}
                  seconds`
                  )}
                </div>
              </>
            ) : (<span> Next round starts in 15sec</span>) }
          </div>
          <div className={classes.auction_timer} style={{ padding: '10px' }}>{`You are in ${cityData?.cityName ? cityData?.cityName : ''}`}</div>
        </div>
        <Typography variant="h6" className={classes.playercontent}>
          {user.playerName}
          ,
          {' '}
          Team
          {' '}
          {user.teamName}
        </Typography>
      </>
    </AppBar>
  );
}

export default LocationHeader;
