import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { API_URL } from '../../global/constants';

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: '#76e246',
    flexGrow: 1,
    position: 'relative',
  },
  timercontent: {
    display: 'none',
    margin: '0 auto',
    fontWeight: '700',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    color: '#051207',
    fontSize: '22px',
  },
  playerdiv: {
    fontWeight: 700,
    color: '#051207', // green color
  },
}));

function SellingResults() {
  const classes = useStyles();
  const history = useHistory();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [hasTimerEnded, setTimerEnded] = useState(false);
  const [timerValue, setTimerValue] = useState();
  const [earnings, setEarnings] = useState();

  useEffect(() => {
    const getEarnings = async () => {
      const { data } = await axios.get(`${API_URL}/buying/getSellingResultForRound?roomCode=${user.hostCode}&roundId=${user.roundId}`);
      setEarnings(data.calculatedRevenueForRound);
      setTimerValue(data.sellingResultsTimerValue);
    };
    if (user && !earnings) {
      getEarnings();
    }
  }, []);

  useEffect(() => {
    const redirectToRevenueScreen = async () => {
      await axios.post(`${API_URL}/buying/updateRoundId`, { roomId: user.hostCode, roundId: user.roundId });
      history.push(`/sell/location/${user.playerId}`);
    };
    if (hasTimerEnded) {
      redirectToRevenueScreen();
    }
  }, [hasTimerEnded]);

  const getRemainingTime = () => {
    if (Object.keys(timerValue).length <= 0) {
      setTimerEnded(true);
      return;
    }
    const total = parseInt(timerValue.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      setTimerEnded(true);
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setTimerValue(value);
    }
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (timerValue) {
      const interval = setInterval(() => getRemainingTime(), 1000);
      return () => clearInterval(interval);
    }
  });

  return (
    <>
      <AppBar className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6" className={classes.timercontent}>
            Next round starting in&nbsp;
            {timerValue && timerValue.minutes}
            :
            {timerValue && timerValue.seconds}
          </Typography>
          {user && (
            <div className={classes.playerdiv}>
              <p>
                {user.playerName}
                , Team
                {user.teamName}
                ,
                {user.playerId}
              </p>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default SellingResults;
