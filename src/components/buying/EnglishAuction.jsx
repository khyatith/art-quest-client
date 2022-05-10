/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-wrap-multilines */
import React, {
  useState, useEffect, useRef, createRef,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
// import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
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
    padding: '0 10px 10px 0',
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

const EnglishAuction = () => {
  const classes = useStyles();
  const location = useLocation();
  const [englishAuctionTimer, setEnglishAuctionTimer] = useState();
  const [englishAuctionResults, setEnglishAuctionResults] = useState();
  const [classifyPoints, setClassifyPoints] = useState({});
  const [bidAmtError, setBidAmtError] = useState();
  const [sendResultEventOnce, setSendResultEventOnce] = useState(false);
  const [isFirstBid, setIsFirstBid] = useState(false);
  const history = useHistory();
  const player = JSON.parse(sessionStorage.getItem('user'));
  const allAuctionsObj = JSON.parse(sessionStorage.getItem('allAuction'));
  const auctions = location.state.englishAuctionsNumber === 1 ? allAuctionsObj.englishAuctions1 : allAuctionsObj.englishAuctions2;
  const bidInputRef = useRef(
    auctions.artifacts.reduce((acc, a) => {
      /* eslint-disable  no-param-reassign */
      acc = {
        ...acc,
        [a.id]: createRef(),
      };
      return acc;
    }, {}),
  );
  const previousBidDetails = useRef(
    auctions.artifacts.reduce((acc, a) => {
      /* eslint-disable  no-param-reassign */
      acc = {
        ...acc,
        [a.id]: createRef(),
      };
      return acc;
    }, {}),
  );

  const getRemainingTime = () => {
    const total = parseInt(englishAuctionTimer.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000 && !sendResultEventOnce) {
      socket.emit('englishAuctionTimerEnded', player.hostCode);
      setSendResultEventOnce(true);
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setEnglishAuctionTimer(value);
    }
  };

  const goToNextAuctions = () => {
    if (location.state.englishAuctionsNumber === 1) {
      history.push({
        pathname: `/secretAuctions/${player.hostCode}`,
        state: { secretAuctionsNumber: 2 },
      });
    } else {
      history.push(`/buying/results/${player.hostCode}`);
    }
  };

  useEffect(() => {
    async function fetchTimerValue() {
      const { data } = await axios.get(`${API_URL}/buying/englishauctionTimer/${player.hostCode}/${location.state.englishAuctionsNumber}`);
      setEnglishAuctionTimer(data.englishAuctionTimer);
    }
    if (isFirstBid) {
      fetchTimerValue();
    }
    // if (!englishAuctionTimer) {
    //   setTimeout(() => fetchTimerValue(), 5000);
    // }
  }, [player.hostCode, isFirstBid]);

  useEffect(() => {
    if (isFirstBid) {
      socket.emit('biddingStarted', player.hostCode);
    }
  }, [isFirstBid, player.hostCode]);
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (englishAuctionTimer) {
      const interval = setInterval(() => getRemainingTime(), 1000);
      return () => clearInterval(interval);
    }
  });
  useEffect(() => {
    socket.on('startBidding', (res) => {
      if (res && !isFirstBid) {
        setIsFirstBid(true);
      }
    });
  });
  useEffect(() => {
    socket.on('setPreviousEnglishAuctionBid', (previousBid) => {
      // setAuctionTimerEnded(false);
      if (previousBid) {
        previousBidDetails.current[`${previousBid.auctionId}`] = {
          bidAmount: previousBid.bidAmount,
          bidTeam: previousBid.bidTeam,
          bidColor: previousBid.bidColor,
        };
      }
    });
  }, [previousBidDetails]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    // eslint-disable-next-line brace-style
    socket.on('renderEnglishAuctionsResults', (data) => {
      setClassifyPoints(data.classifyPoints.classify);
      // eslint-disable-next-line spaced-comment
      //console.log(data);
      if (!englishAuctionResults) {
        setEnglishAuctionResults(data.englishAutionBids);
      }
    });
  }, []);

  const setBidAmt = (auctionId) => {
    const bidInput = bidInputRef.current[auctionId].current.value;
    const currentAuction = auctions.artifacts.filter((auction) => parseInt(auction.id, 10) === parseInt(auctionId, 10));
    const isValidCurrentBid = validateCurrentBid(bidInput);
    if (!isValidCurrentBid) {
      setBidAmtError({
        ...bidAmtError,
        [auctionId]: 'Your bid should be a valid number',
      });
      return;
    }
    const prevBidAmt = previousBidDetails.current[auctionId] && previousBidDetails.current[auctionId].bidAmount;
    const desiredBid = prevBidAmt && parseInt(prevBidAmt, 10) + 2;
    if (parseInt(bidInput, 10) < parseInt(desiredBid, 10)) {
      setBidAmtError({
        ...bidAmtError,
        [auctionId]: `Your bid should be more than ${desiredBid}`,
      });
    } else {
      setBidAmtError({
        ...bidAmtError,
        [auctionId]: null,
      });
      const bidInfo = {
        auctionType: currentAuction[0].auctionType,
        auctionId: currentAuction[0].id,
        imageURL: currentAuction[0].imageURL,
        artMovement: currentAuction[0]?.artMovementName,
        artMovementId: currentAuction[0]?.artMovementId,
        player,
        bidAmount: bidInput,
        bidAt: +new Date(),
        bidTeam: player.teamName,
        bidColor: player.teamColor,
      };
      // console.log('bidding !!');
      if (!isFirstBid) {
        setIsFirstBid(true);
      }
      socket.emit('addEnglishAuctionBid', bidInfo);
    }
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.appbar} position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            ART QUEST
          </Typography>
          <Typography className={classes.timercontent} variant="h5" noWrap>
            {!englishAuctionTimer && 'Auctions start in 10 seconds'}
            {englishAuctionTimer && !englishAuctionResults && (
              <>
                Time left in Auction:
                {' '}
                {englishAuctionTimer && englishAuctionTimer.minutes}
                :
                {englishAuctionTimer && englishAuctionTimer.seconds}
              </>
            )}
            {englishAuctionResults && Object.keys(englishAuctionResults).length > 0 && 'Starting next auction in 10 seconds...'}
          </Typography>
          <Typography variant="h6" className={classes.playercontent}>
            {player.playerName}
            , Team
            {' '}
            {player.teamName}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.leaderboardcontainer}>
        <Leaderboard classifyPoints={classifyPoints} showAuctionResults={englishAuctionResults} goToNextAuctions={goToNextAuctions} />
      </div>
      {auctions && auctions.artifacts.map((auction) => {
        const previousBid = previousBidDetails.current[auction.id];
        return (
          <Card
            key={auction.id}
            className={(!englishAuctionTimer && false) ? classes.disabledcardroot : classes.cardroot}
            style={{ border: previousBid.bidTeam && `4px solid ${TEAM_COLOR_MAP[previousBid.bidTeam]}` }}
          >
            <CardHeader
              title={auction.name}
              subheader={`${auction.artist}, ${auction.country}, ${auction.dateCreated}`}
              // style={{ backgroundColor: previousBid.bidTeam && `${TEAM_COLOR_MAP[previousBid.bidTeam]}` }}
            />
            <CardMedia
              className={classes.media}
              component="img"
              image={`${auction.imageURL}`}
              title={auction.name}
              // style={{ backgroundColor: previousBid.bidTeam && `${TEAM_COLOR_MAP[previousBid.bidTeam]}` }}
            />
            <Typography variant="h6" style={{ marginTop: '0.5rem' }}>{auction.artMovementName}</Typography>
            { !englishAuctionResults && (
            <CardActions className={classes.cardactionsstyle}>
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
                  disabled={(previousBid && (previousBid.bidTeam === player.teamName)) || englishAuctionResults}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">M</InputAdornment>,
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setBidAmt(auction.id)}
                  disabled={(!englishAuctionTimer && false) || (
                    previousBid
                    && (previousBid.bidTeam === player.teamName))}
                >
                  Bid
                </Button>
                { previousBid
                && previousBid.bidAmount
                && (previousBid.bidTeam !== player.teamName
                )
                    && (
                    <p>
                      * Your bid cannot be less than
                      {' '}
                      {`$${parseInt(previousBid.bidAmount, 10) + 2}M`}
                    </p>
                    )}
                {previousBid.bidAmount && previousBid.bidTeam === player.teamName && <p>* Waiting for bids from other teams</p>}
              </div>
              <div className={classes.bottomcontainer}>
                {previousBid && previousBid.bidTeam && previousBid.bidAmount ? (
                  <div className={classes.lastbidcontainer} style={{ backgroundColor: `${previousBid.bidColor}` }}>
                    <p className={classes.lastbidby}>
                      Last Bid By:
                      {`Team ${previousBid.bidTeam}`}
                    </p>
                    <p className={classes.lastbidamount}>
                      Last Bid Amount:
                      {`$${parseInt(previousBid.bidAmount, 10)}M`}
                    </p>
                  </div>
                ) : (
                  <div className={classes.lastbidcontainer}>
                    <p className={classes.lastbidby}>Highest bid will show here</p>
                  </div>
                )}
              </div>
            </CardActions>
            )}
            {englishAuctionResults && englishAuctionResults[auction.id] && (
              <div className={classes.bottomcontainer}>
                <div className={classes.lastbidcontainer} style={{ backgroundColor: `${englishAuctionResults[auction.id].bidColor}` }}>
                  <p className={classes.lastbidby}>
                    Won by
                    {' '}
                    {`Team ${englishAuctionResults[auction.id].bidTeam}`}
                    {' '}
                    for
                    {' '}
                    {`$${parseInt(englishAuctionResults[auction.id].bidAmount, 10)}M`}
                  </p>
                </div>
              </div>
            )}
            {englishAuctionResults && !englishAuctionResults[auction.id] && (
              <div className={classes.bottomcontainer}>
                <div className={classes.lastbidcontainer}>
                  <p className={classes.lastbidby}>No bids were placed</p>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default EnglishAuction;
