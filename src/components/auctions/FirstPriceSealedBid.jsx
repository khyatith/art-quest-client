import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { Typography, TextField } from '@material-ui/core';
import { socket } from '../../global/socket';
import userContext from '../../global/userContext';

const useStyles = makeStyles(() => ({
  root: {
    width: 500,
    padding: 100,
    margin: '0 30%',
  },
  media: {
    height: '200px', // 16:9
  },
}));

function FirstPriceSealedBid({ newAuctionObj }) {
  const classes = useStyles();
  const [live, setLive] = useState(false);
  const { player, setPlayer } = useContext(userContext);
  const [auctionObj, setAuctionObj] = useState();
  const [currentBid, setCurrentBid] = useState();
  const [auctionTimer, setAuctionTimer] = useState({
    total: 0,
    minutes: 0,
    seconds: 0,
  });
  const [bidWinner, setBidWinner] = useState();

  useEffect(() => {
    if (newAuctionObj) {
      setAuctionObj(newAuctionObj);
    }
  }, [newAuctionObj]);

  useEffect(() => {
    setLive(false);
    setTimeout(() => {
      socket.emit('startAuctionsTimer', { auctionType: 1, client: player });
      setLive(true);
    }, 10000);
  }, [auctionObj]);

  useEffect(() => {
    socket.on('auctionTimerValue', (timerValue) => {
      setAuctionTimer(timerValue);
    });
  }, [auctionTimer]);

  useEffect(() => {
    socket.on('displayBidWinner', (calculatedBidWinner) => {
      setBidWinner(calculatedBidWinner);
    });
  }, [auctionTimer]);

  useEffect(() => {
    socket.on('setLiveStyles', (team) => {
      if (player.teamName === team) {
        setLive(false);
      } else {
        console.log('not your team');
      }
    });
  }, [player.teamName]);

  const setBidAmt = () => {
    const bidInfo = {
      auctionType: auctionObj.auctionType,
      auctionObj,
      bidAmount: currentBid,
      bidAt: +new Date(),
      player,
    };
    socket.emit('addNewBid', bidInfo);
  };

  const setCurrentBidAmt = (e) => {
    setCurrentBid(e.target.value);
  };

  return (
    <div className={classes.root}>
      {auctionObj && (
      <>
        <Card key={auctionObj.id}>
          <CardHeader title={auctionObj.name} />
          <CardMedia className={classes.media} component="img" image={`${auctionObj.imageURL}`} title={auctionObj.name} />
          <CardContent>
            <Typography color="textSecondary">
              Original price:
              {auctionObj.originalValue}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            {live && (
            <div>
              <TextField type="number" name="bidAmount" placeholder="Bidding Amount" variant="outlined" onChange={setCurrentBidAmt} />
              <Button variant="contained" color="secondary" onClick={setBidAmt}>
                Bid
              </Button>
            </div>
            )}
            <div>
              Bid time remaining:
              {' '}
              {auctionTimer && auctionTimer.minutes}
              :
              {auctionTimer && auctionTimer.seconds}
            </div>
          </CardActions>
        </Card>
      </>
      )}
      {bidWinner && (
      <div>
        Bid winner is
        {' '}
        {JSON.stringify(bidWinner)}
      </div>
      )}
    </div>
  );
}

export default FirstPriceSealedBid;
