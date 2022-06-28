/* eslint-disable react/jsx-boolean-value */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useRef,
  createRef,
  useCallback,
} from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Leaderboard from '../../buying/Leaderboard';
import LocationHeader from '../LocationHeader/LocationHeader';
import { validateCurrentBid } from '../../../global/helpers';
import { TEAM_COLOR_MAP, API_URL } from '../../../global/constants';
import { socket } from '../../../global/socket';
import SellToMarketPhase from './SellToMarketPhase';

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
    paddingTop: '100px',
    paddingLeft: '500px',
  },
  auction_paintings: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '5px auto',
    width: '90%',
  },
  sell_to_market_outer_container: {
    display: 'grid',
    gridTemplateColumns: '3fr 2fr',
  },
  'sell_to_market-container': {
    display: 'flex',
    flexDirection: 'column',
    width: '580px',
    margin: '10px auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  'painting-container': {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    // width: '90%',
    height: '450px',
    background: '#FFFFFF',
    border: ' 1px solid #000000',
    borderRadius: '10px',
    margin: '5px',
    overflow: 'visible !important',
  },
  'painting-img_container': {
    width: '100%',
    height: '350px',
    position: 'relative',
  },
  'painting-art_movement': {
    bottom: '-15px',
    left: '5px',
    fontSize: '2rem',
    position: 'absolute',
    color: 'white',
    fontWeight: '800',
    textShadow: '0px 4px 20px #000000',
  },
  'live_update-container': {
    display: 'flex',
    border: 'white solid 2px',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: '700px',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflowY: 'scroll',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    background: '#F8F5F4',
    borderRadius: '20px',
  },
  mssg_container: {
    display: 'grid',
    width: '100%',
    margin: '5px auto',
    justifyContent: 'center',
    alignItems: 'center',
    gridTemplateColumns: '4fr 6fr',
    '& > p': {
      fontSize: '1.2rem',
    },
  },
  painting_img: {
    width: '20rem',
    height: '15rem',
  },
}));

function AuctionPhase() {
  const classes = useStyles();
  const player = JSON.parse(sessionStorage.getItem('user'));
  const [auctions, setAuctions] = useState([]);
  const [timerValue, setTimerValue] = useState('');
  const [englishAuctionTimer, setEnglishAuctionTimer] = useState();
  const [nominatedAuctionResult, setNominatedAuctionResult] = useState();
  const [bidAmtError, setBidAmtError] = useState();
  const [startTimer, setStartTimer] = useState(true);
  const [sendResultEventOnce, setSendResultEventOnce] = useState(false);
  const [updateLBOnce, setUpdateLBOnce] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [sellToMarketPainting, setSellToMarketPainting] = useState({});
  const [showMarketPainting, setShowMarketPainting] = useState(false);
  const [cityData, setCityData] = useState(false);
  const [showOtherTeamsUpdates, setShowOtherTeamsUpdates] = useState(false);
  const bidInputRef = useCallback((function () {
    const val = auctions.reduce((acc, a) => {
    /* eslint-disable  no-param-reassign */
      acc = {
        ...acc,
        [a.id]: createRef(),
      };
      return acc;
    }, {});
    return { current: val };
  }()), [auctions]);

  const previousBidDetails = useCallback((function () {
    const val = auctions.reduce((acc, a) => {
    /* eslint-disable  no-param-reassign */
      acc = {
        ...acc,
        [a.id]: createRef(),
      };
      acc[a.id] = { bidAmount: +a.bidAmount };
      return acc;
    }, {});
    return { current: val };
  }()), [auctions]);

  useEffect(() => {
    const getAuctionItems = async () => {
      const tmp = [];
      try {
        const apiURL = `buying/getNominatedForAuctionItems?roomId=${player.hostCode}&locationId=${player.currentLocation}&roundId=${player.roundId}`;
        const { data } = await axios.get(`${API_URL}/${apiURL}`);
        const parsedAuction = data.auctions;
        const teams = Object.keys(parsedAuction);
        teams.forEach((t) => {
          parsedAuction[t].forEach((item) => {
            const tmpItem = { ...item, nominatedBy: t, id: item.paintingId };
            tmp.push(tmpItem);
          });
        });
        setAuctions(tmp);
      } catch (e) {
        console.log(e);
      }
      return tmp;
    };
    getAuctionItems().catch((e) => console.log(e));
  }, []);

  const setBidAmt = (auctionId) => {
    const bidInput = bidInputRef.current[auctionId].current.value;
    const currentAuction = auctions.filter((auction) => parseInt(auction.id, 10) === parseInt(auctionId, 10));
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
      if (!startTimer) {
        socket.emit('startNominatedAuctionTimer', {
          hostCode: player.hostCode,
        });
        setStartTimer(true);
      }
      const bidInfo = {
        auctionType: currentAuction[0].auctionType,
        auctionId: currentAuction[0].id,
        imageURL: currentAuction[0].imageURL,
        artMovement: currentAuction[0]?.artMovement,
        artMovementId: currentAuction[0]?.artMovementId,
        artist: currentAuction[0]?.artist,
        name: currentAuction[0]?.name,
        player,
        bidAmount: bidInput,
        bidAt: +new Date(),
        bidTeam: player.teamName,
        bidColor: player.teamColor,
        nominatedAuctionNumber: player.roundId,
        nominatedBy: currentAuction[0].nominatedBy,
      };
      socket.emit('nominatedAuctionBids', bidInfo);
    }
  };

  useEffect(() => {
    if (sendResultEventOnce) {
      const updateLeaderBoard = async () => {
        await axios
          .get(`${API_URL}/buying/updateLeaderBoardAfterNominationAuction?roomId=${player.hostCode}`)
          .then((res) => {
          })
          .catch((e) => console.log(e));
      };

      if (!updateLBOnce) {
        setUpdateLBOnce(true);
        updateLeaderBoard().then(async () => {
          setTimeout(() => {
            socket.emit('sellingResultsTimerEnded', { player });
          }, 5000);
          await axios.post(`${API_URL}/buying/updateRoundId`, { roomId: player.hostCode, roundId: player.roundId });
        }).catch((e) => console.log(e));
      }
    }
  }, [sendResultEventOnce]);

  useEffect(() => {
    socket.on('renderNominatedAuctionResult', (data) => {
      // setClassifyPoints(data.classifyPoints.classify);
      if (!nominatedAuctionResult) {
        setNominatedAuctionResult(data.nominatedAuctionBids);
      }
    });
    // return (() => {
    //   socket.off('renderNominatedAuctionResult');
    // });
  }, []);

  useEffect(() => {
    socket.on('startNextRound', () => {
      history.push(`/sell/location/${player.playerId}`);
    });
  }, []);
  useEffect(() => {
    socket.on('setNominatedAuction', (previousBid) => {
      if (previousBid) {
        previousBidDetails.current[`${previousBid.auctionId}`] = {
          bidAmount: previousBid.bidAmount,
          bidTeam: previousBid.bidTeam,
          bidColor: previousBid.bidColor,
        };
      }
    });
  }, [previousBidDetails]);
  const getRemainingTime = async () => {
    const total = parseInt(timerValue.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000 && !sendResultEventOnce) {
      socket.emit('nominatedAuctionTimerEnded', { roomId: player.hostCode, nominatedAuctionNumber: player.roundId });
      setSendResultEventOnce(true);
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setTimerValue(value);
    }
  };
  useEffect(() => {
    let interval;
    if (timerValue && startTimer) {
      interval = setTimeout(() => getRemainingTime(), 1000);
    }
    return () => clearInterval(interval);
  }, [timerValue]);
  useEffect(() => {
    const getTimer = async () => {
      await axios
        .get(`${API_URL}/buying/startNominatedAuction?roomId=${player.hostCode}`)
        .then((newData) => {
          if (newData?.data?.nominatedAuctionTimerValue) {
            setTimerValue(newData.data.nominatedAuctionTimerValue);
          }
        })
        .catch((e) => console.log(e));
    };
    if (startTimer) {
      getTimer();
    }
  }, [startTimer]);
  useEffect(() => {
    socket.on('nominatedAuctionStarted', () => {
      if (!startTimer) {
        setStartTimer(true);
      }
    });
  }, []);
  useEffect(() => {
    if (location.state?.sellToMarketPainting) {
      setSellToMarketPainting(location.state?.sellToMarketPainting);
    }
    if (location.state?.cityData) {
      setCityData(location.state?.cityData);
    }
    if (location.state?.showOtherTeamsUpdates) {
      setShowOtherTeamsUpdates(location.state?.showOtherTeamsUpdates);
    }
  }, [location.state?.sellToMarketPainting, location.state?.cityData, location.state?.showOtherTeamsUpdates]);

  return (
    <>
      <LocationHeader timerValue={timerValue} cityData={cityData} timerEnded={updateLBOnce} user={player} />
      <div style={{
        width: '90%', margin: '20px', paddingTop: '70px',
      }}
      >
        <Leaderboard showAuctionResults={false} goToNextAuctions={false} maxWidth={true} />
      </div>
      <div className={classes.auction_paintings}>
        {auctions.length > 0 && auctions.map((auction) => {
          const previousBid = previousBidDetails?.current[auction.id];
          if (!previousBid) return <></>;
          return (
            <Card
              key={auction.id}
              className={(!englishAuctionTimer && false) ? classes.disabledcardroot : classes.cardroot}
              style={{ border: previousBid?.bidTeam && `4px solid ${TEAM_COLOR_MAP[previousBid?.bidTeam]}`, textAlign: 'center' }}
            >
              <Typography
                variant="h6"
                style={{
                  display: 'flex', marginTop: '0.5rem', justifyContent: 'center', color: 'black', background: `${TEAM_COLOR_MAP[auction?.nominatedBy]}`, textShadow: 'white 0px 0px 10px',
                }}
              >
                <span style={{ textShadow: 'white 0px 0px 10px' }}>
                  {`Nominated By ${auction?.nominatedBy} Team`}
                </span>
              </Typography>
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
              <Typography variant="h6" style={{ display: 'flex', marginTop: '0.5rem', justifyContent: 'center' }}>
                Art Movement:
                {' '}
                {auction.artMovement}
              </Typography>
              { !nominatedAuctionResult && (
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
                      disabled={(previousBid && (previousBid?.bidTeam === player.teamName)) || nominatedAuctionResult}
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
                    && (previousBid?.bidTeam === player.teamName))}
                    >
                      Bid
                    </Button>
                    { previousBid
                && previousBid?.bidAmount
                && (previousBid?.bidTeam !== player.teamName
                )
                    && (
                    <p>
                      * Your bid cannot be less than
                      {' '}
                      {`$${parseInt(previousBid?.bidAmount, 10) + 2}M`}
                    </p>
                    )}
                    { (previousBid?.bidAmount && (previousBid?.bidTeam === player.teamName))
                    && (
                      <p>
                        * Waiting for bids from other teams
                      </p>
                    )}
                  </div>
                  <div className={classes.bottomcontainer}>
                    { previousBid && previousBid?.bidTeam && previousBid?.bidAmount ? (
                      <div className={classes.lastbidcontainer} style={{ backgroundColor: `${previousBid.bidColor}` }}>
                        <p className={classes.lastbidby}>
                          Last Bid By:
                          {`Team ${previousBid?.bidTeam}`}
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
              {nominatedAuctionResult && nominatedAuctionResult[auction.id] && (
                <div className={classes.bottomcontainer}>
                  <div className={classes.lastbidcontainer} style={{ backgroundColor: `${nominatedAuctionResult[auction.id].bidColor}` }}>
                    <p className={classes.lastbidby}>
                      Won by
                      {' '}
                      {`Team ${nominatedAuctionResult[auction.id]?.bidTeam}`}
                      {' '}
                      for
                      {' '}
                      {`$${parseInt(nominatedAuctionResult[auction.id].bidAmount, 10)}M`}
                    </p>
                  </div>
                </div>
              )}
              {nominatedAuctionResult && !nominatedAuctionResult[auction.id] && (
                <div className={classes.bottomcontainer}>
                  <div className={classes.lastbidcontainer}>
                    <p className={classes.lastbidby}>
                      No bids were placed
                    </p>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      {/* {((sellToMarketPainting && Object.keys(sellToMarketPainting).length > 0) || (auctions.length === 0)) */}
      {location.state?.showOtherTeamsUpdates && <SellToMarketPhase sellToMarketPainting={sellToMarketPainting} player={player} timerValue={timerValue} classes={classes} setShowMarketPainting={setShowMarketPainting} />}
    </>
  );
}

export default AuctionPhase;
