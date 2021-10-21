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
import userContext from '../../global/userContext';
import { socket } from '../../global/socket';
import LeaderBoard from '../LeaderBoard';
import SimpleRating from '../Rating';
import RoundsInfo from '../RoundsInfo';
import leaderboardContext from '../../global/leaderboardContext';
import BuyingBarChart from '../visualizations/BuyingBarChart';
import BonusAuctionBanner from '../visualizations/BonusAuctionBanner';
import { ALL_PAY_AUCTIONS_TEXT } from '../../global/constants';

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    width: 350,
    padding: 20,
    display: 'flex',
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

function AllPayAuctions({ newAuctionObj, renderNextAuction, totalNumberOfPaintings }) {
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
  const { leaderboardData } = useContext(leaderboardContext);

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
    if (auctionObj) {
      socket.emit('startAuctionsTimer', { player, currentAuctionId: auctionObj.id });
      setAuctionTimerEnded(false);
      setLive(true);
    }
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

  const getNextAuction = () => {
    renderNextAuction();
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
      <Button onClick={getNextAuction} size="large" className={classes.nextbtn} fullWidth disabled={isDisableNextBtn}>
        Click for next auction
      </Button>
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
                  * The highest bid will win but all teams will pay the price that they bid
                </p>
              </div>
              {/* <div className={classes.timercontainer}>
                <p className={classes.timercaption}>Time Remaining</p>
                <div className={classes.timer}>{auctionTimer && auctionTimer.minutes}</div>
                <div className={classes.timer}>{auctionTimer && auctionTimer.seconds}</div>
              </div> */}
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
            <BonusAuctionBanner text={ALL_PAY_AUCTIONS_TEXT} />
          </div>
        </div>
      </div>
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
