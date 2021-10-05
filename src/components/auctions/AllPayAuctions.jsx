/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react-perf/jsx-no-new-function-as-prop */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { Typography, TextField } from '@material-ui/core';
import userContext from '../../global/userContext';
import { socket, leaderboardSocket } from '../../global/socket';
import LeaderBoard from '../LeaderBoard';
import SimpleRating from '../Rating';

const useStyles = makeStyles(() => ({
  cardRoot: {
    width: 500,
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
  timercontainer: {
    height: '100px',
    position: 'static',
    bottom: '0',
    borderTop: '1px solid #cccccc',
    margin: '20px 0px 0px 0px !important',
    textAlign: 'left',
    backgroundColor: '#1C2833',
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

function AllPayAuctions({ newAuctionObj, renderNextAuction }) {
  const classes = useStyles();
  const [live, setLive] = useState(false);
  const { player } = useContext(userContext);
  const [auctionObj, setAuctionObj] = useState();
  const [currentBid, setCurrentBid] = useState();
  const [auctionTimer, setAuctionTimer] = useState({
    total: 0,
    minutes: 0,
    seconds: 0,
  });
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
    setLive(false);
    setTimeout(() => {
      if (auctionObj) {
        socket.emit('startAuctionsTimer', { player, currentAuctionId: auctionObj.id });
        setAuctionTimerEnded(false);
        setLive(true);
      }
    }, 10000);
  }, [auctionObj, player]);

  useEffect(() => {
    socket.on('auctionTimerValue', (timerValue) => {
      setAuctionTimer(timerValue);
      setAuctionTimerEnded(false);
      if (timerValue.total <= 1000) {
        setDisableNextBtn(false);
        setAuctionTimerEnded(true);
      }
    });
  }, []);

  useEffect(() => {
    socket.on('auctionPageTimerEnded', () => {
      setAuctionTimerEnded(true);
    });
  });

  useEffect(() => {
    if (hasAuctionTimerEnded) {
      leaderboardSocket.emit('getLeaderBoard', player);
    }
  });

  useEffect(() => {
    socket.on('setLiveStyles', (team) => {
      if (player.teamName === team) {
        setLive(false);
      }
    });
  }, [player.teamName]);

  const setBidAmt = () => {
    if (currentBid < auctionObj.originalValue) {
      setBidAmtError(`Your bid should be more than ${currentBid}`);
    } else {
      setBidAmtError(null);
      const bidInfo = {
        auctionType: auctionObj.auctionType,
        auctionId: auctionObj.id,
        auctionObj,
        bidAmount: currentBid,
        bidAt: +new Date(),
        bidTeam: player.teamName,
        player,
      };
      socket.emit('addNewBid', bidInfo);
    }
  };

  const setCurrentBidAmt = (e) => {
    setCurrentBid(e.target.value);
  };

  const getNextAuction = () => {
    renderNextAuction();
  };

  return (
    <div className={classes.root}>
      <Button onClick={getNextAuction} size="large" className={classes.nextbtn} fullWidth disabled={isDisableNextBtn}>
        Click for next auction
      </Button>
      <LeaderBoard hasAuctionTimerEnded={hasAuctionTimerEnded} />
      {auctionObj && (
        <div className={classes.cardRoot}>
          <Card key={auctionObj.id}>
            <CardHeader className={classes.titlestyle} title={auctionObj.name} subheader={`Created By: ${auctionObj.artist}`} />
            <CardMedia className={classes.media} component="img" image={`${auctionObj.imageURL}`} title={auctionObj.name} />
            <CardContent className={classes.cardcontentstyle}>
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
                <p>
                  * The highest bid will win but all teams will pay the price that they bid
                </p>
              </div>
              <div className={classes.timercontainer}>
                <p className={classes.timercaption}>Time Remaining</p>
                <div className={classes.timer}>{auctionTimer && auctionTimer.minutes}</div>
                <div className={classes.timer}>{auctionTimer && auctionTimer.seconds}</div>
              </div>
            </CardActions>
          </Card>
        </div>
      )}
    </div>
  );
}

AllPayAuctions.defaultProps = {
  newAuctionObj: {},
  renderNextAuction: () => {},
};

AllPayAuctions.propTypes = {
  newAuctionObj: PropTypes.objectOf(PropTypes.any),
  renderNextAuction: PropTypes.func,
};

export default AllPayAuctions;
