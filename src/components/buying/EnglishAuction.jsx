/* eslint-disable no-console */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-nested-ternary */
import React, {
  useState, useEffect, useRef, createRef, useContext,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { socket } from '../../global/socket';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';
import { fetchHashmapAndPaintingsArray, getTempBudget, validateCurrentBid } from '../../global/helpers';
import Leaderboard from './Leaderboard';
import buyingLeaderboardContext from '../../global/buyingLeaderboardContext';
import ResultAccordion from '../ResultAccordion';
import Header from '../Header';

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
    padding: '10px 0px',
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
    paddingTop: '0px',
    paddingLeft: '30px',
    display: 'flex',
  },
}));

const EnglishAuction = () => {
  const classes = useStyles();
  const location = useLocation();
  const [englishAuctionTimer, setEnglishAuctionTimer] = useState();
  const [englishAuctionResults, setEnglishAuctionResults] = useState();
  const [classifyPoints, setClassifyPoints] = useState({});
  const [increaseClassifyPoints, setIncreaseClassifyPoints] = useState({});
  console.log(increaseClassifyPoints);
  const [bidAmtError, setBidAmtError] = useState();
  const [tempBudget, setTempBudget] = useState(0);
  const [sendResultEventOnce, setSendResultEventOnce] = useState(false);
  const [isFirstBid, setIsFirstBid] = useState(false);
  const history = useHistory();
  const player = JSON.parse(sessionStorage.getItem('user'));
  const { buyingLeaderboardData } = useContext(buyingLeaderboardContext);
  const { totalAmountByTeam } = buyingLeaderboardData;
  const allAuctionsObj = JSON.parse(sessionStorage.getItem('allAuction'));
  // eslint-disable-next-line no-unused-vars
  const [auctions, setAuctions] = useState(
    // eslint-disable-next-line no-nested-ternary
    location.state.englishAuctionsNumber === 1
      ? allAuctionsObj.englishAuctions1
      : location.state.englishAuctionsNumber === 2
        ? allAuctionsObj.englishAuctions2
        : allAuctionsObj.englishAuctions3,
  );
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
      socket.emit('englishAuctionTimerEnded', { roomId: player.hostCode, englishAuctionsNumber: location.state.englishAuctionsNumber });
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
      // 1
      history.push({
        pathname: `/secretAuctions/${player.hostCode}`,
        state: { secretAuctionsNumber: 1 },
      });
    } else if (location.state.englishAuctionsNumber === 2) {
      // 2
      history.push({
        pathname: `/secondPricedSealedBidAuctions/${player.hostCode}`,
        state: { secondPricedSealedBidAuctions: 1 },
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
        let currentBudget = 100;
        if (totalAmountByTeam && totalAmountByTeam[player.teamName] >= 0) {
          currentBudget = totalAmountByTeam[player.teamName];
        }
        setTempBudget(getTempBudget(currentBudget, player.teamName, previousBidDetails.current));
      }
    });
  }, [previousBidDetails]);

  useEffect(() => {
    socket.on('renderEnglishAuctionsResults', (data) => {
      console.log('english auction number', location.state.englishAuctionsNumber);
      console.log('data in render english auction results', data);
      setClassifyPoints(data.classifyPoints.classify);
      if (!englishAuctionResults) {
        setEnglishAuctionResults(data.englishAutionBids);
      }
    });
  }, []);

  useEffect(() => {
    let currentBudget = 100;
    if (totalAmountByTeam && totalAmountByTeam[player.teamName] >= 0) {
      currentBudget = totalAmountByTeam[player.teamName];
    }
    setTempBudget(getTempBudget(currentBudget, player.teamName, previousBidDetails.current));

    const { hashmap } = fetchHashmapAndPaintingsArray(buyingLeaderboardData, player);
    setIncreaseClassifyPoints(hashmap);
  }, []);

  const setBidAmt = (auctionId) => {
    const bidInput = bidInputRef.current[auctionId].current.value;
    const currentAuction = auctions.artifacts.filter((auction) => parseInt(auction.id, 10) === parseInt(auctionId, 10));
    const bidInputError = validateCurrentBid(bidInput, tempBudget);
    if (bidInputError) {
      setBidAmtError({
        ...bidAmtError,
        [auctionId]: bidInputError,
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
        artist: currentAuction[0]?.artist,
        name: currentAuction[0]?.name,
        country: currentAuction[0]?.country,
        dateCreated: currentAuction[0]?.dateCreated,
        player,
        bidAmount: bidInput,
        bidAt: +new Date(),
        bidTeam: player.teamName,
        bidColor: player.teamColor,
        englishAuctionsNumber: location.state.englishAuctionsNumber,
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
      <Header player={player} auctionTimer={englishAuctionTimer} auctionResults={englishAuctionResults} tempBudget={tempBudget} />
      <div className={classes.leaderboardcontainer}>
        <Leaderboard classifyPoints={classifyPoints} showAuctionResults={englishAuctionResults} goToNextAuctions={goToNextAuctions} />
        <ResultAccordion setIncreaseClassifyPoints={setIncreaseClassifyPoints} />
      </div>
      {auctions
        && auctions.artifacts.map((auction) => {
          const previousBid = previousBidDetails.current[auction.id];
          return (
            <Card
              key={auction.id}
              className={!englishAuctionTimer && false ? classes.disabledcardroot : classes.cardroot}
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
              <Typography variant="h6" style={{ marginTop: '0.5rem' }}>
                Art Movement:
                {' '}
                {auction.artMovementName}
                {increaseClassifyPoints && increaseClassifyPoints[auction.artMovementName] && <p className="gentle-shake">+5 classify points</p>}
              </Typography>
              {!englishAuctionResults && (
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
                      disabled={(previousBid && previousBid.bidTeam === player.teamName) || englishAuctionResults}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        endAdornment: <InputAdornment position="end">M</InputAdornment>,
                      }}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setBidAmt(auction.id)}
                      disabled={(!englishAuctionTimer && false) || (previousBid && previousBid.bidTeam === player.teamName)}
                    >
                      Bid
                    </Button>
                    {previousBid && previousBid.bidAmount && previousBid.bidTeam !== player.teamName && (
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
