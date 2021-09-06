/* eslint-disable react-perf/jsx-no-new-function-as-prop */
import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { Typography, TextField } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { socket } from '../../global/socket';
import userContext from '../../global/userContext';

const useStyles = makeStyles((theme) => ({
  root: {
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
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: '#1C2833',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10, 10, 10),
    textAlign: 'center',
  },
  nextbtn: {
    backgroundColor: '#0fc',
    color: '#000',
    margin: '0 auto',
  },
  winmessage: {
    color: '#0fc',
    fontSize: '30px',
  },
  teammessage: {
    color: '#fff',
  },
}));

function FirstPriceSealedBid({ newAuctionObj, renderNextAuction }) {
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
  const [bidWinner, setBidWinner] = useState();

  useEffect(() => {
    if (newAuctionObj) {
      setAuctionObj(newAuctionObj);
    }
  }, [newAuctionObj]);

  useEffect(() => {
    setLive(false);
    setTimeout(() => {
      socket.emit('startAuctionsTimer', 1);
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
      // eslint-disable-next-line max-len
      setBidWinner(calculatedBidWinner);
    });
  }, []);

  useEffect(() => {
    socket.on('setLiveStyles', (team) => {
      if (player.teamName === team) {
        setLive(false);
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

  const getNextAuction = () => {
    renderNextAuction();
  };

  const renderBidWinner = () => {
    const { bidAmount, bidTeam } = bidWinner;
    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade>
          <div className={classes.paper}>
            <div>
              <p className={classes.winmessage}>
                CONGRATULATIONS!!
                {' '}
                <p className={classes.teammessage}>
                  Team
                  {' '}
                  {bidTeam}
                  {' '}
                  won for
                </p>
                <p className={classes.teammessage}>
                  {auctionObj.name}
                  {' '}
                  for
                </p>
                <p>
                  {bidAmount}
                </p>
              </p>
            </div>
            <Button
              variant="contained"
              color="secondary"
              fullWidth="true"
              className={classes.nextbtn}
              onClick={getNextAuction}
            >
              Next
            </Button>
          </div>
        </Fade>
      </Modal>
    );
  };

  return (
    <div className={classes.root}>
      {auctionObj && (
      <>
        <Card key={auctionObj.id}>
          <CardHeader className={classes.titlestyle} title={auctionObj.name} subheader={`Created By: ${auctionObj.artist}`} />
          <CardMedia className={classes.media} component="img" image={`${auctionObj.imageURL}`} title={auctionObj.name} />
          <CardContent className={classes.cardcontentstyle}>
            <Typography component="h6" variant="h6">
              {`Bid should begin from : $${auctionObj.originalValue}`}
            </Typography>
          </CardContent>
          <CardActions className={classes.cardactionsstyle}>
            <div>
              <TextField
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
            </div>
            <div className={classes.timercontainer}>
              <p className={classes.timercaption}>Time Remaining</p>
              <div className={classes.timer}>
                {auctionTimer && auctionTimer.minutes}
              </div>
              <div className={classes.timer}>
                {auctionTimer && auctionTimer.seconds}
              </div>
            </div>
          </CardActions>
        </Card>
      </>
      )}
      {bidWinner && renderBidWinner()}
    </div>
  );
}

export default FirstPriceSealedBid;
