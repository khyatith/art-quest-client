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
    position: 'fixed',
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
    marginTop: '20px',
  },
  typomidnew: {
    textAlign: 'center',
    marginTop: '1%',
    fontSize: '24px',
    fontWeight: '700',
  },
  windowView: {
    display: 'flex',
    overflowX: 'scroll',
    whiteSpace: 'nowrap',
  },
  colouredDiv: {
    minWidth: '27%',
    maxWidth: '27%',
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
  const [hasRequestedResult, setHasRequestedResult] = useState(false);

  useEffect(() => {
    const getEarnings = async () => {
      const { data } = await axios.get(`${API_URL}/buying/getSellingResultForRound?roomCode=${user.hostCode}&roundId=${user.roundId}`);
      setEarnings(data.calculatedRevenueForRound);
      setPaintings(data.allTeamPaintings);
      setTimerValue(data.sellingResultsTimerValue);
    };
    if (user && !hasRequestedResult) {
      sessionStorage.setItem('currentSellingEnglishAuction', null);
      setHasRequestedResult(true);
      getEarnings();
    }
  }, [earnings, user, timerValue]);

  useEffect(() => {
    const redirectToLocationScreen = async () => {
      await axios.post(`${API_URL}/buying/updateRoundId`, { roomId: user.hostCode, roundId: user.roundId });
      if (user.roundId < 5) {
        history.push(`/sell/location/${user.playerId}`);
      } else {
        history.push(`/sell/finalresult/${user.playerId}`);
      }
    };
    if (hasTimerEnded) {
      redirectToLocationScreen();
    }
  }, [hasTimerEnded, history, user]);

  const getRemainingTime = () => {
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

  const loadRevenue = (teamColor, revenueGenerated) => {
    const ns = props.location.state;
    if (paintings === undefined) {
      return <div />;
    }
    const teamPaintings = paintings[teamColor];
    console.log(teamPaintings);
    return (
      <div>
        <div>
          <Typography className={classes.typomidnew}>
            Team&nbsp;
            {teamColor}
          </Typography>
          <Typography className={classes.typomidnew}>
            {`$${revenueGenerated}M`}
          </Typography>
        </div>
        <div className={classes.windowViewDown}>
          {teamPaintings
            && teamPaintings.map((arg) => (
              <Box
                p={1}
                style={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                }}
                className={classes.colouredDivNew}
                // eslint-disable-next-line no-nested-ternary
                display={ns.includes(arg.auctionId) ? 'block' : 'none'}
              >
                <Card
                  sx={{
                    minHeight: 290,
                    minWidth: 360,
                    maxWidth: 360,
                    backgroundColor: 'white',
                    margin: 'auto',
                    marginTop: '3%',
                  }}
                  className={classes.cardStyle}
                  disabled
                >
                  <CardMedia sx={{ height: 290 }} component="img" image={arg.paintingURL} alt="green iguana" />
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
