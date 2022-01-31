import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import { socket } from '../../global/socket';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';
import load from '../../assets/load.webp';

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: '#76e246',
    flexGrow: 1,
    position: 'fixed',
  },
  headIntro: {
    marginTop: '4.8%',
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
    marginTop: '80px',
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
    minWidth: '21%',
    maxWidth: '21%',
    height: '460px',
    margin: '1%',
  },
  loginCardHeader: {
    backgroundColor: '#000000',
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
  parent: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  child1: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '0.5%',
    paddingBottom: '0.5%',
    justifyContent: 'center',
  },
  cardStyle: {
    transition: 'width 2s',
    transitionTimingFunction: 'linear',
    animation: '$fadeIn .2s ease-in-out',
  },
  cardTitleStyle: {
    '& .MuiCardHeader-subheader': {
      color: '#212F3C',
      lineHeight: '1.9',
      fontSize: '18px',
      fontWeight: '700',
    },
  },
}));

function SellingResults(props) {
  const classes = useStyles();
  const history = useHistory();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [timerValue, setTimerValue] = useState();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState();
  const [paintings, setPaintings] = useState();
  const [hasRequestedResult, setHasRequestedResult] = useState(false);

  useEffect(() => {
    const getEarnings = async () => {
      const { data } = await axios.get(`${API_URL}/buying/getSellingResultForRound?roomCode=${user.hostCode}&roundId=${user.roundId}`);
      setEarnings(data.calculatedRevenueForRound);
      setPaintings(data.allTeamPaintings);
      setTimerValue(data.sellingResultsTimerValue);
      setLoading(false);
    };
    if (user && !hasRequestedResult) {
      sessionStorage.setItem('currentSellingEnglishAuction', null);
      setHasRequestedResult(true);
      getEarnings();
    }
  }, [earnings, user, timerValue]);

  useEffect(() => {
    socket.on('startNextRound', () => {
      if (user.roundId < 5) {
        history.push(`/sell/location/${user.playerId}`);
      } else {
        history.push(`/sell/finalresult/${user.playerId}`);
      }
    });
  }, []);

  const getRemainingTime = async () => {
    const total = parseInt(timerValue.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      socket.emit('sellingResultsTimerEnded', { player: user });
      await axios.post(`${API_URL}/buying/updateRoundId`, { roomId: user.hostCode, roundId: user.roundId });
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
    if (!paintings || paintings.length === 0) {
      return <h3 style={{ color: '#990000' }}>All teams earned $0. No painting nominations were made.</h3>;
    }
    const teamPaintings = paintings[teamColor];
    return (
      <div>
        <Box className={classes.child1} justifyContent="center">
          {teamPaintings
            && teamPaintings.map((arg) => (
              <Box
                p={1}
                sx={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  minHeight: '45',
                  minWidth: '355',
                  maxWidth: '355',
                }}
                // eslint-disable-next-line no-nested-ternary
                display={ns.includes(arg.auctionId) ? 'block' : 'none'}
              >
                <Card
                  sx={{
                    minHeight: 45,
                    minWidth: 355,
                    maxWidth: 355,
                    backgroundColor: 'white',
                  }}
                  className={classes.cardStyle}
                >
                  <CardHeader
                    className={classes.cardTitleStyle}
                    style={{ backgroundColor: TEAM_COLOR_MAP[teamColor], marginTop: '5%' }}
                    title={`Team ${teamColor}`}
                    subheader={`Round ${user.roundId} earnings: $${revenueGenerated}M`}
                  />
                  <CardMedia sx={{ height: 338 }} component="img" image={arg.paintingURL} alt="green iguana" />
                </Card>
              </Box>
            ))}
        </Box>
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

  if (loading) {
    return (
      <div style={{ marginTop: '12%', marginLeft: '43%' }}>
        {' '}
        <img src={load} alt="loading..." />
        {' '}
      </div>
    );
  }

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
      <div className={classes.child1} justifyContent="center" display="flex" flexWrap="wrap">
        {earnings && Object.keys(earnings).map((arg) => <div className={classes.colouredDiv}>{loadRevenue(arg, earnings[arg])}</div>)}
      </div>
    </>
  );
}

export default SellingResults;
