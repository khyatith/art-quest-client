/* eslint-disable react/jsx-wrap-multilines */
import React, {
  useState,
  useEffect,
  useRef,
  createRef,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useHistory } from 'react-router';
import SimpleRating from '../Rating';
import { socket } from '../../global/socket';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';
import { validateCurrentBid } from '../../global/helpers';
import Leaderboard from './Leaderboard';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: 'center',
  },
  paper: {
    padding: theme,
  },
  appbar: {
    height: 80,
    position: 'fixed',
  },
  timercontent: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    flexGrow: 1,
    textAlign: 'center',
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    marginRight: theme.spacing(2),
  },
  playercontent: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    fontSize: '22px',
    position: 'absolute',
    right: '0',
    marginRight: '10px',
  },
  cardroot: {
    width: 400,
    display: 'inline-block',
    margin: '40px 20px 20px 20px',
  },
  disabledcardroot: {
    width: 400,
    display: 'inline-block',
    margin: '40px 20px 20px 20px',
    backgroundColor: '#cccccc',
  },
  cardcontentstyle: {
    textAlign: 'center',
    marginTop: '-5px',
  },
  cardactionsstyle: {
    textAlign: 'center',
    display: 'block',
    padding: '0px',
  },
  textcontainer: {
    padding: '10px',
  },
  bottomcontainer: {
    display: 'flex',
    height: '100px',
    position: 'static',
    bottom: '0',
    borderTop: '1px solid #cccccc',
    margin: '20px 0px 0px 0px !important',
    backgroundColor: '#1C2833',
  },
  media: {
    height: '200px',
    objectFit: 'contain',
  },
  textfieldstyle: {
    marginRight: '5px',
  },
  lastbidcontainer: {
    textAlign: 'center',
    flex: '1',
    backgroundColor: '#fff',
    width: '100%',
    padding: '10px 0px 10px 0',
  },
  lastbidby: {
    color: '#333',
    fontSize: '16px',
    fontWeight: '700',
  },
  lastbidamount: {
    color: '#333',
    fontSize: '16px',
    fontWeight: '700',
  },
  leaderboardcontainer: {
    paddingTop: '100px',
    paddingLeft: '500px',
  },
}));

const SecretAuction = () => {
  const classes = useStyles();
  const [secretAuctionTimer, setSecretAuctionTimer] = useState();
  const [secretAuctionResults, setSecretAuctionResults] = useState();
  const [bidAmtError, setBidAmtError] = useState();
  const history = useHistory();
  const player = JSON.parse(sessionStorage.getItem('user'));
  const { secretAuctions } = JSON.parse(sessionStorage.getItem('allAuction'));
  const bidInputRef = useRef(secretAuctions.artifacts.reduce((acc, a) => {
    /* eslint-disable  no-param-reassign */
    acc = {
      ...acc,
      [a.id]: createRef(),
    };
    return acc;
  }, {}));
  const liveStyles = useRef(secretAuctions.artifacts.reduce((acc, a) => {
    /* eslint-disable  no-param-reassign */
    acc = {
      ...acc,
      [a.id]: createRef(),
    };
    return acc;
  }, {}));

  const getRemainingTime = () => {
    const total = parseInt(secretAuctionTimer.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      socket.emit('secretAuctionTimerEnded', player.hostCode);
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setSecretAuctionTimer(value);
    }
  };

  const goToNextAuctions = () => {
    history.push(`/buying/results/${player.playerId}`);
  };

  useEffect(() => {
    async function fetchTimerValue() {
      const { data } = await axios.get(`${API_URL}/buying/secretauctionTimer/${player.hostCode}`);
      setSecretAuctionTimer(data.secretAuctionTimer);
    }
    if (!secretAuctionTimer) {
      setTimeout(() => fetchTimerValue(), 10000);
    }
  }, [secretAuctionTimer, player.hostCode]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (secretAuctionTimer) {
      const interval = setInterval(() => getRemainingTime(), 1000);
      return () => clearInterval(interval);
    }
  });

  useEffect(() => {
    socket.on('renderSecretAuctionsResult', (data) => {
      if (!secretAuctionResults) {
        setSecretAuctionResults(data);
      }
    });
    if (secretAuctionResults) {
      setTimeout(goToNextAuctions, 10000);
    }
  });

  useEffect(() => {
    socket.on('setLiveStyles', (data) => {
      const { teamName, auctionId, bidAmount } = data;
      const currentLiveStateForAuction = liveStyles.current[`${auctionId}`].current;
      if (!currentLiveStateForAuction) {
        liveStyles.current[`${auctionId}`].current = {
          [teamName]: bidAmount,
        };
      } else if (currentLiveStateForAuction && !Object.keys(currentLiveStateForAuction).includes(teamName)) {
        liveStyles.current[`${auctionId}`].current = {
          ...currentLiveStateForAuction,
          [teamName]: bidAmount,
        };
      }
    });
  });

  const setBidAmt = (auctionId) => {
    const bidInput = bidInputRef.current[auctionId].current.value;
    const currentAuction = secretAuctions.artifacts.filter((auction) => parseInt(auction.id, 10) === parseInt(auctionId, 10));
    const isValidCurrentBid = validateCurrentBid(bidInput);
    if (!isValidCurrentBid) {
      setBidAmtError({
        ...bidAmtError,
        [auctionId]: 'Your bid should be a valid number',
      });
      return;
    }
    setBidAmtError({
      ...bidAmtError,
      [auctionId]: null,
    });
    const bidInfo = {
      auctionType: currentAuction[0].auctionType,
      auctionId: currentAuction[0].id,
      paintingQuality: currentAuction[0].paintingQuality,
      imageURL: currentAuction[0].imageURL,
      artMovement: currentAuction[0]?.artMovementName,
      artMovementId: currentAuction[0]?.artMovementId,
      player,
      bidAmount: bidInput,
      bidAt: +new Date(),
      bidTeam: player.teamName,
      bidColor: player.teamColor,
    };
    socket.emit('addSecretAuctionBid', bidInfo);
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.appbar} position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            ART QUEST
          </Typography>
          <Typography className={classes.timercontent} variant="h5" noWrap>
            { !secretAuctionTimer && 'Auctions start in 10 seconds' }
            { secretAuctionTimer
            && !secretAuctionResults && (
            <>
              Time left in Auction:
              {' '}
              {secretAuctionTimer && secretAuctionTimer.minutes}
              :
              {secretAuctionTimer && secretAuctionTimer.seconds}
            </>)}
            { secretAuctionResults && Object.keys(secretAuctionResults).length > 0 && (
              'Starting next auction in 10 seconds...'
            )}
          </Typography>
          <Typography variant="h6" className={classes.playercontent}>
            {player.playerName}
            ,
            {' '}
            Team
            {' '}
            {player.teamName}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.leaderboardcontainer}>
        <Leaderboard showAuctionResults={secretAuctionResults} goToNextAuctions={goToNextAuctions} />
      </div>
      {secretAuctions && secretAuctions.artifacts.map((auction) => {
        const liveStylesForCurrentAuction = liveStyles.current[`${auction.id}`].current;
        const winner = secretAuctionResults && secretAuctionResults[`${auction.id}`] && secretAuctionResults[`${auction.id}`].bidTeam;
        return (
          <Card
            key={auction.id}
            className={!secretAuctionTimer ? classes.disabledcardroot : classes.cardroot}
            style={{ border: winner && `4px solid ${TEAM_COLOR_MAP[winner]}` }}
          >
            <CardHeader
              title={auction.name}
              subheader={`${auction.artist}, ${auction.country}, ${auction.dateCreated}`}
            />
            <CardMedia
              className={classes.media}
              component="img"
              image={`${auction.imageURL}`}
              title={auction.name}
            />
            <CardContent className={classes.cardcontentstyle}>
              <p>Painting Quality</p>
              <SimpleRating rating={parseFloat(auction.paintingQuality)} />
            </CardContent>
            <CardActions className={classes.cardactionsstyle}>
              {!secretAuctionResults && (
              <div className={classes.textcontainer}>
                <TextField
                  inputRef={bidInputRef.current[auction.id]}
                  error={bidAmtError && !!bidAmtError[auction.id]}
                  helperText={bidAmtError && bidAmtError[auction.id]}
                  className={classes.textfieldstyle}
                  size="small"
                  name="bidAmount"
                  placeholder="Enter your bid"
                  variant="outlined"
                  disabled={!secretAuctionTimer || (liveStylesForCurrentAuction && Object.keys(liveStylesForCurrentAuction).includes(player.teamName))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">M</InputAdornment>,
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={!secretAuctionTimer || (liveStylesForCurrentAuction && Object.keys(liveStylesForCurrentAuction).includes(player.teamName))}
                  onClick={() => setBidAmt(auction.id)}
                >
                  Bid
                </Button>
              </div>
              )}
              <div className={classes.bottomcontainer}>
                <div className={classes.lastbidcontainer}>
                  { liveStylesForCurrentAuction && Object.entries(liveStylesForCurrentAuction).map(([key, value]) => {
                    const bidAmt = winner && value;
                    return (
                      <>
                        <div style={{
                          borderRadius: '50%',
                          backgroundColor: TEAM_COLOR_MAP[key],
                          width: '20px',
                          height: '20px',
                          margin: '0 15px',
                          display: 'inline-block',
                          textAlign: 'center',
                        }}
                        >
                          { bidAmt && (
                            <h5>
                              $
                              {bidAmt}
                              M
                            </h5>
                          )}
                        </div>
                      </>
                    );
                  })}
                  { winner && (
                    <>
                      <div style={{
                        backgroundColor: `${TEAM_COLOR_MAP[winner]}`,
                        height: '70px',
                        lineHeight: '40px',
                        marginTop: '-10px',
                      }}
                      >
                        <h4>
                          Won by Team
                          {' '}
                          {winner}
                          {' '}
                          for
                          {' '}
                          $
                          {secretAuctionResults[`${auction.id}`].bidAmount}
                          M
                        </h4>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardActions>
          </Card>
        );
      })}
    </div>
  );
};

export default SecretAuction;
