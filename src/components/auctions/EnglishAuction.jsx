/* eslint-disable react/jsx-one-expression-per-line */
import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { Typography, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import userContext from '../../global/userContext';
import { socket } from '../../global/socket';
import LeaderBoard from '../LeaderBoard';
import SimpleRating from '../Rating';
import RoundsInfo from '../RoundsInfo';

const useStyles = makeStyles(() => ({
  cardRoot: {
    width: 400,
    padding: 20,
    // margin: '0 30%',
  },
  media: {
    height: '350px', // 16:9
  },
  titlestyle: {
    textAlign: 'center',
    color: '#212F3C',
    '& .MuiCardHeader-subheader': {
      color: '#212F3C',
      lineHeight: '1.9',
      fontSize: '18px',
    },
  },
  cardcontentstyle: {
    textAlign: 'center',
  },
  cardactionsstyle: {
    textAlign: 'center',
    display: 'block',
    padding: '0px',
  },
  textfieldstyle: {
    marginRight: '10px',
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
  timercontainer: {
    textAlign: 'left',
  },
  lastbidcontainer: {
    textAlign: 'center',
    flex: '1',
    marginRight: '20px',
    backgroundColor: '#fff',
    width: '50px',
    marginLeft: '80px',
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
  timercaption: {
    marginLeft: '10px',
    color: '#ffffff',
    lineHeight: '1.2px',
  },
  timer: {
    backgroundColor: '#333',
    color: '#0fc',
    fontSize: '40px',
    width: '50px',
    marginLeft: '10px',
    textAlign: 'center',
    display: 'inline-block',
    padding: '10px 10px 0px 10px',
  },
  nextbtn: {
    backgroundColor: '#0fc',
    color: '#000',
    fontWeight: 700,
    '& .Mui-disabled': {
      backgroundColor: '#cccccc',
      color: '#616A6B',
    },
  },
}));

function EnglishAuction({ newAuctionObj, renderNextAuction, totalNumberOfPaintings }) {
  const classes = useStyles();
  const [live, setLive] = useState(false);
  const { player } = useContext(userContext);
  const [auctionObj, setAuctionObj] = useState();
  const [auctionTimer, setAuctionTimer] = useState();
  const [currentBid, setCurrentBid] = useState();
  const [previousBidDetails, setPreviousBidDetails] = useState();
  const [isDisableNextBtn, setDisableNextBtn] = useState(true);
  const [hasAuctionTimerEnded, setAuctionTimerEnded] = useState(false);
  const [bidAmtError, setBidAmtError] = useState();

  useEffect(() => {
    if (newAuctionObj) {
      setAuctionTimerEnded(false);
      setDisableNextBtn(true);
      setAuctionObj(newAuctionObj);
      setBidAmtError(null);
    }
  }, [newAuctionObj]);

  useEffect(() => {
    if (auctionObj) {
      socket.emit('startAuctionsTimer', { player, currentAuctionId: auctionObj.id });
    }
  }, [auctionObj]);

  useEffect(() => {
    socket.on('auctionTimerValue', (timerValue) => {
      setAuctionTimer(timerValue);
      setLive(true);
      setAuctionTimerEnded(false);
      if (timerValue.total <= 1000) {
        setAuctionTimerEnded(true);
        setDisableNextBtn(false);
      }
    });
  }, []);

  useEffect(() => {
    socket.on('auctionPageTimerEnded', () => {
      setPreviousBidDetails(null);
      setLive(false);
      setAuctionTimerEnded(true);
    });
  });

  const setCurrentBidAmt = (e) => {
    setCurrentBid(e.target.value);
  };

  useEffect(() => {
    socket.on('setPreviousBid', (previousBid) => {
      setAuctionTimerEnded(false);
      if (previousBid) {
        setPreviousBidDetails({ bidAmount: previousBid.bidAmount, bidTeam: previousBid.bidTeam, bidColor: previousBid.bidColor });
      }
    });
  });

  const setBidAmt = () => {
    const prevBidAmt = previousBidDetails && previousBidDetails.bidAmount;
    const desiredBid = parseInt(prevBidAmt, 10) + 5000;
    if (prevBidAmt && currentBid < desiredBid) {
      setBidAmtError(`Your bid should be more than ${desiredBid}`);
    } else {
      setBidAmtError(null);
      const bidInfo = {
        auctionType: auctionObj.auctionType,
        auctionId: auctionObj.id,
        paintingQuality: auctionObj.paintingQuality,
        auctionObj,
        player,
        bidAmount: currentBid,
        bidAt: +new Date(),
        bidTeam: player.teamName,
        bidColor: player.teamColor,
      };
      socket.emit('addNewBid', bidInfo);
    }
  };

  const getNextAuction = () => {
    renderNextAuction();
    setDisableNextBtn(true);
    setPreviousBidDetails({
      bidTeam: null,
      bidAmount: 0,
    });
  };

  return (
    <div className={classes.root}>
      <Button onClick={getNextAuction} size="large" className={classes.nextbtn} fullWidth disabled={isDisableNextBtn}>
        Click for next auction
      </Button>
      {auctionObj && <RoundsInfo label={`Round ${auctionObj.id} of ${totalNumberOfPaintings}`} />}
      <LeaderBoard hasAuctionTimerEnded={hasAuctionTimerEnded} />
      {auctionObj && (
        <div className={classes.cardRoot}>
          <Card key={auctionObj.id}>
            <CardHeader className={classes.titlestyle} title={auctionObj.name} subheader={`Created By: ${auctionObj.artist}`} />
            <CardMedia className={classes.media} component="img" image={`${auctionObj.imageURL}`} title={auctionObj.name} />
            <CardContent className={classes.cardcontentstyle}>
              <p>Painting Quality</p>
              <SimpleRating rating={parseFloat(auctionObj.paintingQuality)} />
              <Typography component="h6" variant="h6">
                {`Opening bid : $${auctionObj.originalValue}`}
              </Typography>
            </CardContent>
            <CardActions className={classes.cardactionsstyle}>
              <div>
                <TextField
                  error={!!bidAmtError}
                  helperText={bidAmtError && bidAmtError}
                  className={classes.textfieldstyle}
                  size="small"
                  disabled={!live}
                  type="number"
                  name="bidAmount"
                  placeholder="Bidding Amount"
                  variant="outlined"
                  onChange={setCurrentBidAmt}
                />
                <Button disabled={!live} variant="contained" color="secondary" onClick={setBidAmt}>
                  Bid
                </Button>
                { previousBidDetails && previousBidDetails.bidAmount
                  && (
                  <p>
                    * Your bid cannot be less than {parseInt(previousBidDetails.bidAmount, 10) + 5000}
                  </p>
                  )}
              </div>
              <div className={classes.bottomcontainer}>
                <div className={classes.timercontainer}>
                  <p className={classes.timercaption}>Time Remaining</p>
                  <div className={classes.timer}>{auctionTimer && auctionTimer.minutes}</div>
                  <div className={classes.timer}>{auctionTimer && auctionTimer.seconds}</div>
                </div>
                {previousBidDetails && previousBidDetails.bidTeam && previousBidDetails.bidAmount ? (
                  <div className={classes.lastbidcontainer} style={{ backgroundColor: `${previousBidDetails.bidColor}` }}>
                    <p className={classes.lastbidby}>Last Bid By: {`Team ${previousBidDetails.bidTeam}`}</p>
                    <p className={classes.lastbidamount}>Last Bid Amount: {previousBidDetails.bidAmount}</p>
                  </div>
                ) : (
                  <div className={classes.lastbidcontainer}>
                    <p className={classes.lastbidby}>Highest bid will show here</p>
                  </div>
                )}
              </div>
            </CardActions>
          </Card>
        </div>
      )}
    </div>
  );
}

export default EnglishAuction;
