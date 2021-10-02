import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { socket } from '../global/socket';

const useStyles = makeStyles(() => ({
  wrapper: {
    margin: '0 auto',
  },
  content: {
    fontWeight: '700',
    color: '#000000',
    fontSize: '22px',
  },
}));

function Timer() {
  const classes = useStyles();
  const [landingPageTimerValue, setLandingPageTimerValue] = useState({
    total: '0',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    socket.on('landingPageTimerValue', (value) => {
      setLandingPageTimerValue(value);
    });
  }, []);

  return (
    <div className={classes.wrapper}>
      <p className={classes.content}>
        Auction starts in:
        {' '}
        {landingPageTimerValue && landingPageTimerValue.minutes}
        :
        {landingPageTimerValue && landingPageTimerValue.seconds}
      </p>
    </div>
  );
}
export default Timer;
