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
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import { socket } from '../../global/socket';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';
import { getTempBudgetForSecretAuctions, validateCurrentBid } from '../../global/helpers';
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
    paddingTop: '0px',
    paddingLeft: '30px',
    display: 'flex',
  },
}));

const SecondPricedSealedBidAuction = () => {
  const classes = useStyles();
  const location = useLocation();
  const [secondPriceAuctionTimer, setSecondPriceAuctionTimer] = useState();
  const [secondPriceAuctionResults, setSecondPriceAuctionResults] = useState();
  const [classifyPoints, setClassifyPoints] = useState({});
  const [tempBudget, setTempBudget] = useState();
  const [isFetched, setIsFetched] = useState(false);
  const [bidAmtError, setBidAmtError] = useState();
  const history = useHistory();
  const player = JSON.parse(sessionStorage.getItem('user'));
  const { buyingLeaderboardData } = useContext(buyingLeaderboardContext);
  const { totalAmountByTeam } = buyingLeaderboardData;
  const [isFirstBid, setIsFirstBid] = useState(false);
  const allAuctionsObj = JSON.parse(sessionStorage.getItem('allAuction'));
  const secondPriceAuctions = allAuctionsObj.secondPricedSealedBidAuctions1;
  const bidInputRef = useRef(
    secondPriceAuctions.artifacts.reduce((acc, a) => {
      /* eslint-disable  no-param-reassign */
      acc = {
        ...acc,
        [a.id]: createRef(),
      };
      return acc;
    }, {}),
  );

  const liveStyles = useRef(
    secondPriceAuctions.artifacts.reduce((acc, a) => {
      /* eslint-disable  no-param-reassign */
      acc = {
        ...acc,
        [a.id]: createRef(),
      };
      return acc;
    }, {}),
  );

  const getRemainingTime = () => {
    const total = parseInt(secondPriceAuctionTimer.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      if (!isFetched && Object.keys(classifyPoints).length === 0) {
        setIsFetched(true);
        socket.emit('secondPriceAuctionTimerEnded', player.hostCode);
      }
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setSecondPriceAuctionTimer(value);
    }
  };

  const goToNextAuctions = () => {
    if (location.state.secondPricedSealedBidAuctions === 1) {
      history.push({
        pathname: `/englishAuction/${player.hostCode}`,
        state: { englishAuctionsNumber: 3 },
      });
    } else {
      history.push(`/buying/results/${player.hostCode}`);
    }
  };

  useEffect(() => {
    socket.on('renderSecondPriceAuctionsResult', (data) => {
      console.log('data in render second price auction result', data);
      if (!secondPriceAuctionResults && data && data.result) {
        setSecondPriceAuctionResults(data.result);
      }
      if (!classifyPoints) {
        console.log('classifyPoints', classifyPoints);
        setClassifyPoints(data.classifyPoints);
      }
    });
    if (secondPriceAuctionResults) {
      setTimeout(goToNextAuctions, 20000);
    }
  }, []);

  useEffect(() => {
    async function fetchTimerValue() {
      const { data } = await axios.get(`${API_URL}/buying/secondPricedTimer/${player.hostCode}/${location.state.secondPricedSealedBidAuctions}`);
      setSecondPriceAuctionTimer(data.secondPriceAuctionTimer);
    }
    if (isFirstBid) {
      fetchTimerValue();
    }
  }, [player.hostCode, isFirstBid]);

  useEffect(() => {
    if (isFirstBid) {
      socket.emit('biddingStarted', player.hostCode);
    }
  }, [isFirstBid, player.hostCode]);
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (secondPriceAuctionTimer) {
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
    socket.on('setSecondPricedLiveStyles', (data) => {
      const { teamName, auctionId, bidAmount } = data;
      const currentLiveStateForAuction = liveStyles.current[auctionId].current;
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
      let currentBudget = 100;
      if (totalAmountByTeam && totalAmountByTeam[player.teamName] >= 0) {
        currentBudget = totalAmountByTeam[player.teamName];
      }
      setTempBudget(getTempBudgetForSecretAuctions(currentBudget, player.teamName, liveStyles.current));
    });
  }, []);

  useEffect(() => {
    let currentBudget = 100;
    if (totalAmountByTeam && totalAmountByTeam[player.teamName] >= 0) {
      currentBudget = totalAmountByTeam[player.teamName];
    }
    setTempBudget(getTempBudgetForSecretAuctions(currentBudget, player.teamName, liveStyles.current));
  }, []);

  const setBidAmt = (auctionId) => {
    const bidInput = bidInputRef.current[auctionId].current.value;
    const currentAuction = secondPriceAuctions.artifacts.filter((auction) => parseInt(auction.id, 10) === parseInt(auctionId, 10));
    const bidInputError = validateCurrentBid(bidInput, tempBudget);
    if (bidInputError) {
      setBidAmtError({
        ...bidAmtError,
        [auctionId]: bidInputError,
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
      imageURL: currentAuction[0].imageURL,
      artMovement: currentAuction[0]?.artMovementName,
      artMovementId: currentAuction[0]?.artMovementId,
      artist: currentAuction[0]?.artist,
      name: currentAuction[0]?.name,
      player,
      bidAmount: bidInput,
      bidAt: +new Date(),
      bidTeam: player.teamName,
      bidColor: TEAM_COLOR_MAP[player.teamName],
    };
    if (!isFirstBid) {
      setIsFirstBid(true);
    }
    socket.emit('addSecondPriceAuctionBid', bidInfo);
  };

  return (
    <div className={classes.root}>
      <Header player={player} auctionTimer={secondPriceAuctionTimer} auctionResults={secondPriceAuctionResults} tempBudget={tempBudget} />
      <div className={classes.leaderboardcontainer}>
        <Leaderboard classifyPoints={classifyPoints} showAuctionResults={secondPriceAuctionResults} goToNextAuctions={goToNextAuctions} />
        <ResultAccordion />
      </div>
      {secondPriceAuctions
      && secondPriceAuctions.artifacts.map((auction) => {
        const liveStylesForCurrentAuction = liveStyles && liveStyles.current[`${auction.id}`].current;
        const winner = secondPriceAuctionResults && secondPriceAuctionResults[`${auction.id}`] && secondPriceAuctionResults[`${auction.id}`].bidTeam;
        return (
          <Card
            key={auction.id}
            className={classes.cardroot}
            style={{ border: winner && `4px solid ${TEAM_COLOR_MAP[winner]}` }}
          >
            <CardHeader title={auction.name} subheader={`${auction.artist}, ${auction.country}, ${auction.dateCreated}`} />
            <CardMedia className={classes.media} component="img" image={`${auction.imageURL}`} title={auction.name} />
            <Typography variant="h6" style={{ marginTop: '0.5rem' }}>
              Art Movement:
              {auction.artMovementName}
            </Typography>
            <CardActions className={classes.cardactionsstyle}>
              {!secondPriceAuctionResults && (
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
                    disabled={liveStylesForCurrentAuction && Object.keys(liveStylesForCurrentAuction).includes(player.teamName)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      endAdornment: <InputAdornment position="end">M</InputAdornment>,
                    }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={liveStylesForCurrentAuction && Object.keys(liveStylesForCurrentAuction).includes(player.teamName)}
                    onClick={() => setBidAmt(auction.id)}
                  >
                    Bid
                  </Button>
                </div>
              )}
              <div className={classes.bottomcontainer}>
                <div className={classes.lastbidcontainer}>
                  {liveStylesForCurrentAuction
                  && Object.entries(liveStylesForCurrentAuction).map(([key, value]) => {
                    const bidAmt = winner && value;
                    return (
                      <>
                        <div
                          style={{
                            borderRadius: '50%',
                            backgroundColor: TEAM_COLOR_MAP[key],
                            width: '20px',
                            height: '20px',
                            margin: '0 15px',
                            display: 'inline-block',
                            textAlign: 'center',
                          }}
                        >
                          {bidAmt
                          && (
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
                  {winner && (
                    <>
                      <div
                        style={{
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
                          {secondPriceAuctionResults[`${auction.id}`].bidAmount}
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

export default SecondPricedSealedBidAuction;
