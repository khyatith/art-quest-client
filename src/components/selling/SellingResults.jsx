import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';

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
  typomid: {
    textAlign: 'center',
    marginTop: '1%',
    marginRight: '9%',
  },
  typomidnew: {
    textAlign: 'center',
    marginTop: '1%',
  },
  windowView: {
    display: 'flex',
    overflowX: 'scroll',
    whiteSpace: 'nowrap',
  },
  colouredDiv: {
    minWidth: '31.33%',
    height: '700px',
    margin: '1%',
  },
  windowViewDown: {
    overflowY: 'scroll',
    whiteSpace: 'nowrap',
    minHeight: '600px',
    maxHeight: '600px',
  },
  colouredDivNew: {
    flex: 'column',
    minHeight: '400px',
    margin: '1%',
  },
  cardStyle: {
    transition: 'width 2s',
    transitionTimingFunction: 'linear',
    animation: '$fadeIn .2s ease-in-out',
  },
}));

function SellingResults(props) {
  const classes = useStyles();
  const history = useHistory();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [hasTimerEnded, setTimerEnded] = useState(false);
  const [timerValue, setTimerValue] = useState();
  const [earnings, setEarnings] = useState();
  const [paintings, setPaintings] = useState();

  useEffect(() => {
    const getEarnings = async () => {
      const { data } = await axios.get(`${API_URL}/buying/getSellingResultForRound?roomCode=${user.hostCode}&roundId=${user.roundId}`);
      setEarnings(data.calculatedRevenueForRound);
      console.log(data);
      setTimerValue(data.sellingResultsTimerValue);
    };
    if (user && (!earnings || !timerValue)) {
      getEarnings();
    }
  }, [earnings, user, timerValue]);

  useEffect(() => {
    const redirectToRevenueScreen = async () => {
      await axios.post(`${API_URL}/buying/updateRoundId`, { roomId: user.hostCode, roundId: user.roundId });
      history.push(`/sell/location/${user.playerId}`);
    };
    if (hasTimerEnded) {
      redirectToRevenueScreen();
    }
  }, [hasTimerEnded, history, user]);

  const getRemainingTime = () => {
    if (Object.keys(timerValue).length <= 0) {
      setTimerEnded(true);
      return;
    }
    const total = parseInt(timerValue.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      setTimerEnded(false);
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setTimerValue(value);
    }
  };

  const loadRevenue = (teamColor, revenueGenerated) => {
    const ns = props.location.state;
    console.log(paintings);
    return (
      <div>
        <div>
          <Typography className={classes.typomidnew}>
            Team&nbsp;
            {teamColor}
          </Typography>
          <Typography className={classes.typomidnew}>
            Round&nbsp;
            {user.roundId}
            &nbsp;Earnings : $&nbsp;
            {revenueGenerated}
          </Typography>
        </div>
        <div className={classes.windowViewDown}>
          {ns
            && ns.map((arg) => (
              <Box
              p={1}
                style={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                }}
                className={classes.colouredDivNew}
                // eslint-disable-next-line no-nested-ternary
                // display={paintingSelected === -1 ? 'block' : paintingSelected === index ? 'block' : 'none'}
              >
                <Card
                  sx={{
                    minHeight: 445,
                    minWidth: 355,
                    maxWidth: 355,
                    backgroundColor: 'white',
                    margin: 'auto',
                    marginTop: '3%',
                  }}
                  className={classes.cardStyle}
                  disabled
                >
                  <CardMedia
                    sx={{ height: 445 }}
                    component="img"
                    image={arg.auctionObj.imageURL}
                    alt="green iguana"
                  />
                </Card>
              </Box>
            ))}
        </div>
      </div>
    );
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
                , Team&nbsp;
                {user.teamName}
                ,
                {user.playerId}
              </p>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <div className={classes.headIntro}>
        <Typography variant="h4" className={classes.typomid}>
          Round&nbsp;
          {user.roundId}
          &nbsp;earnings
        </Typography>
      </div>
      <div className={classes.windowView}>
        {earnings
          && Object.keys(earnings).map((arg) => (
            <div className={classes.colouredDiv} style={{ backgroundColor: TEAM_COLOR_MAP[arg] }}>
              {loadRevenue(arg, earnings[arg])}
            </div>
          ))}
      </div>
    </>
  );
}

export default SellingResults;