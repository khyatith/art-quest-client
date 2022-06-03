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
import { useLocation } from 'react-router';
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
}));
// const auctions = [
//   {
//     id: 1,
//     paintingId: 2,
//     imageURL: 'https://firebasestorage.googleapis.com/v0/b/auctions-f601d.appspot.com/o/art-movements%2Fabstract%2Fbild-no-635.webp?alt=media&token=ae360b2a-73db-4d36-9642-a6b11527d2a7',
//     artMovement: 'abstract',
//     artMovementId: '3',
//     artist: 'Gerhard Richter',
//     name: 'Bild No. 635',
//     bidAmount: '2',
//     bidAt: 1653411772775,
//   },
//   {
//     id: 2,
//     paintingId: 1,
//     imageURL: 'https://firebasestorage.googleapis.com/v0/b/auctions-f601d.appspot.com/o/art-movements%2Fukiyo-e%2F32nd-station-of-takaido.jpeg?alt=media&token=2b6310a2-ab4d-458c-9e4b-c58fdd7c8a09',
//     artMovement: 'ukiyo-e',
//     artMovementId: '4',
//     artist: 'Utagawa Hiroshige',
//     name: '53 stations of Tokaido',
//     bidAmount: '12',
//     bidAt: 1653388906587,
//   },
//   {
//     id: 3,
//     paintingId: 2,
//     imageURL: 'https://firebasestorage.googleapis.com/v0/b/auctions-f601d.appspot.com/o/art-movements%2Fabstract%2Fbild-no-635.webp?alt=media&token=ae360b2a-73db-4d36-9642-a6b11527d2a7',
//     artMovement: 'abstract',
//     artMovementId: '3',
//     artist: 'Gerhard Richter',
//     name: 'Bild No. 635',
//     bidAmount: '2',
//     bidAt: 1653411772775,
//   },
//   {
//     id: 4,
//     paintingId: 1,
//     imageURL: 'https://firebasestorage.googleapis.com/v0/b/auctions-f601d.appspot.com/o/art-movements%2Fukiyo-e%2F32nd-station-of-takaido.jpeg?alt=media&token=2b6310a2-ab4d-458c-9e4b-c58fdd7c8a09',
//     artMovement: 'ukiyo-e',
//     artMovementId: '4',
//     artist: 'Utagawa Hiroshige',
//     name: '53 stations of Tokaido',
//     bidAmount: '12',
//     bidAt: 1653388906587,
//   },
//   {
//     id: 5,
//     paintingId: 2,
//     imageURL: 'https://firebasestorage.googleapis.com/v0/b/auctions-f601d.appspot.com/o/art-movements%2Fabstract%2Fbild-no-635.webp?alt=media&token=ae360b2a-73db-4d36-9642-a6b11527d2a7',
//     artMovement: 'abstract',
//     artMovementId: '3',
//     artist: 'Gerhard Richter',
//     name: 'Bild No. 635',
//     bidAmount: '2',
//     bidAt: 1653411772775,
//   },
//   {
//     id: 6,
//     paintingId: 1,
//     imageURL: 'https://firebasestorage.googleapis.com/v0/b/auctions-f601d.appspot.com/o/art-movements%2Fukiyo-e%2F32nd-station-of-takaido.jpeg?alt=media&token=2b6310a2-ab4d-458c-9e4b-c58fdd7c8a09',
//     artMovement: 'ukiyo-e',
//     artMovementId: '4',
//     artist: 'Utagawa Hiroshige',
//     name: '53 stations of Tokaido',
//     bidAmount: '12',
//     bidAt: 1653388906587,
//   },
//   {
//     id: 7,
//     paintingId: 2,
//     imageURL: 'https://firebasestorage.googleapis.com/v0/b/auctions-f601d.appspot.com/o/art-movements%2Fabstract%2Fbild-no-635.webp?alt=media&token=ae360b2a-73db-4d36-9642-a6b11527d2a7',
//     artMovement: 'abstract',
//     artMovementId: '3',
//     artist: 'Gerhard Richter',
//     name: 'Bild No. 635',
//     bidAmount: '2',
//     bidAt: 1653411772775,
//   },
//   {
//     id: 8,
//     paintingId: 1,
//     imageURL: 'https://firebasestorage.googleapis.com/v0/b/auctions-f601d.appspot.com/o/art-movements%2Fukiyo-e%2F32nd-station-of-takaido.jpeg?alt=media&token=2b6310a2-ab4d-458c-9e4b-c58fdd7c8a09',
//     artMovement: 'ukiyo-e',
//     artMovementId: '4',
//     artist: 'Utagawa Hiroshige',
//     name: '53 stations of Tokaido',
//     bidAmount: '12',
//     bidAt: 1653388906587,
//   },
// ];
function AuctionPhase() {
  const classes = useStyles();
  const player = JSON.parse(sessionStorage.getItem('user'));
  const [auctions, setAuctions] = useState([]);
  const [timerValue, setTimerValue] = useState('');
  const [englishAuctionTimer, setEnglishAuctionTimer] = useState();
  const [englishAuctionResults, setEnglishAuctionResults] = useState();
  const [bidAmtError, setBidAmtError] = useState();
  const [startTimer, setStartTimer] = useState(false);

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

  //   const history = useHistory();
  const location = useLocation();

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
    getAuctionItems().then((res) => console.log(res)).catch((e) => console.log(e));
  }, []);

  const setBidAmt = (auctionId) => {
    console.log('=>', bidInputRef, auctionId);
    const bidInput = bidInputRef.current[auctionId].current.value;
    const currentAuction = auctions.filter((auction) => parseInt(auction.id, 10) === parseInt(auctionId, 10));
    console.log(previousBidDetails);
    const isValidCurrentBid = validateCurrentBid(bidInput);
    if (!isValidCurrentBid) {
      setBidAmtError({
        ...bidAmtError,
        [auctionId]: 'Your bid should be a valid number',
      });
      return;
    }
    const prevBidAmt = previousBidDetails.current[auctionId] && previousBidDetails.current[auctionId].bidAmount;
    console.log(previousBidDetails, previousBidDetails[auctionId], prevBidAmt, auctionId);
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
        artMovement: currentAuction[0]?.artMovementName,
        artMovementId: currentAuction[0]?.artMovementId,
        artist: currentAuction[0]?.artist,
        name: currentAuction[0]?.name,
        player,
        bidAmount: bidInput,
        bidAt: +new Date(),
        bidTeam: player.teamName,
        bidColor: player.teamColor,
        englishAuctionsNumber: location.state.englishAuctionsNumber,
      };
      // console.log('bidding !!');
      //   if (!isFirstBid) {
      //     setIsFirstBid(true);
      //   }
      // socket.emit('addEnglishAuctionBid', bidInfo);
    }
  };
  const getRemainingTime = () => {
    const total = parseInt(timerValue.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      // socket.emit('nominatedAuctionEnded', { hostCode: player.hostCode });
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
  // useEffect(() => {
  //   if (startTimer) {
  //     socket.emit('startNominatedAuctionTimer', {
  //       hostCode: player.hostCode,
  //     });
  //   }
  // }, [startTimer]);
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
      console.log('starting Timer for nominatedAuction');
      if (!startTimer) {
        setStartTimer(true);
      }
    });
  }, []);

  return (
    <>
      <LocationHeader timerValue={timerValue} cityData={location.state.cityData} />
      <div style={{
        width: '90%', margin: '20px',
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
                      disabled={(previousBid && (previousBid?.bidTeam === player.teamName)) || englishAuctionResults}
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
              {englishAuctionResults && englishAuctionResults[auction.id] && (
                <div className={classes.bottomcontainer}>
                  <div className={classes.lastbidcontainer} style={{ backgroundColor: `${englishAuctionResults[auction.id].bidColor}` }}>
                    <p className={classes.lastbidby}>
                      Won by
                      {' '}
                      {`Team ${englishAuctionResults[auction.id]?.bidTeam}`}
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
    </>
  );
}

export default AuctionPhase;
