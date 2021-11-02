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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import axios from 'axios';
import userContext from '../../global/userContext';
import { socket } from '../../global/socket';
import LeaderBoard from '../LeaderBoard';
import SimpleRating from '../Rating';
import RoundsInfo from '../RoundsInfo';
import leaderboardContext from '../../global/leaderboardContext';
import BuyingBarChart from '../visualizations/BuyingBarChart';
import BonusAuctionBanner from '../visualizations/BonusAuctionBanner';
import { SECOND_PRICED_SEALED_BID_TEXT } from '../../global/constants';
import auctionContext from '../../global/auctionContext';

const useStyles = makeStyles((theme) => ({
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
  appbar: {
    backgroundColor: '#0fc',
    flexGrow: 1,
    position: 'relative',
  },
  timercontent: {
    display: 'none',
    margin: '0 auto',
    fontWeight: '700',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    color: '#000000',
    fontSize: '22px',
  },
}));

function SecondPriceSealedBid({
  totalNumberOfPaintings, getNextAuctionObj,
}) {
  const classes = useStyles();
  const [live, setLive] = useState(false);
  const { player } = useContext(userContext);
  const [auctionObj, setAuctionObj] = useState();
  const [currentBid, setCurrentBid] = useState();
  const [auctionTimer, setAuctionTimer] = useState({});
  const [hasAuctionTimerEnded, setAuctionTimerEnded] = useState(false);
  const [bidAmtError, setBidAmtError] = useState();
  const { leaderboardData } = useContext(leaderboardContext);
  const { currentAuctionData } = useContext(auctionContext);

  const getRemainingTime = () => {
    if (Object.keys(auctionTimer).length <= 0) {
      setAuctionTimerEnded(true);
      return;
    }
    const total = parseInt(auctionTimer.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      setAuctionTimerEnded(true);
      setLive(false);
      setAuctionTimer({});
    } else {
      const value = {
        total,
        minutes,
        seconds,
      };
      setAuctionTimer(value);
    }
  };

  useEffect(() => {
    if (currentAuctionData && currentAuctionData.currentAuctionObj) {
      setAuctionTimerEnded(false);
      setLive(true);
      setAuctionObj(currentAuctionData.currentAuctionObj);
      setBidAmtError(null);
    }
  }, [currentAuctionData]);

  useEffect(() => {
    async function fetchTimerValue() {
      const { data } = await axios.get(`https://localhost:3001/buying/auctionTimer/${player.hostCode}/${auctionObj.id}`);
      setAuctionTimer(data.currentAuctionObjTimer);
    }
    if (auctionObj && Object.keys(auctionTimer).length === 0) {
      fetchTimerValue();
    }
  }, [auctionObj, auctionTimer, player.hostCode]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (auctionTimer) {
      const interval = setInterval(() => getRemainingTime(), 1000);
      return () => clearInterval(interval);
    }
  });

  useEffect(() => {
    if (hasAuctionTimerEnded) {
      getNextAuctionObj(auctionObj.id);
    }
  }, [hasAuctionTimerEnded]);

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
        paintingQuality: auctionObj.paintingQuality,
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

  return (
    <div className={classes.root}>
      {auctionObj && (
      <AppBar className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6" className={classes.timercontent}>
            Time Remaining in Auction:
            {' '}
            {auctionTimer && auctionTimer.minutes}
            :
            {auctionTimer && auctionTimer.seconds}
          </Typography>
        </Toolbar>
      </AppBar>
      )}
      {auctionObj && <RoundsInfo label={`Round ${auctionObj.id} of ${totalNumberOfPaintings}`} />}
      <LeaderBoard hasAuctionTimerEnded={hasAuctionTimerEnded} />
      <div style={{ display: 'flex' }}>
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
                <p>
                  * The highest bid will win but the winner will pay the amount of the second highest bid
                </p>
              </div>
            </CardActions>
          </Card>
        </div>
        )}
        <div style={{ display: 'flex', maxWidth: '400px' }}>
          {/* Render bar chart */}
          { leaderboardData && leaderboardData.totalPointsAvg
          && (
          <div style={{ marginTop: '350px' }}>
            <BuyingBarChart results={leaderboardData.totalPointsAvg} labels={Object.keys(leaderboardData.totalPointsAvg)} />
          </div>
          )}
          {/* Render bonus auction banner */}
          <div style={{ width: '300px', height: '150px', position: 'absolute' }}>
            <BonusAuctionBanner text={SECOND_PRICED_SEALED_BID_TEXT} />
          </div>
        </div>
      </div>
    </div>
  );
}

SecondPriceSealedBid.defaultProps = {
  totalNumberOfPaintings: 1,
  getNextAuctionObj: () => {},
};

SecondPriceSealedBid.propTypes = {
  totalNumberOfPaintings: PropTypes.number,
  getNextAuctionObj: PropTypes.func,
};

export default SecondPriceSealedBid;