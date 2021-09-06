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
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Confetti from 'react-confetti';
import useWindowSize from '../../hooks/use-window-size';
import userContext from '../../global/userContext';
import { socket } from '../../global/socket';
import leaderboardImg from '../../assets/leaderboardimg.png';

const useStyles = makeStyles((theme) => ({
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
  leaderboardroot: {
    float: 'right',
    margin: '0px',
    backgroundColor: '#1C2833',
    color: '#0fc',
    position: 'fixed',
    right: 0,
    width: '300px',
  },
  leaderboardheaderstyle: {
    '& .MuiCardHeader-title': {
      fontWeight: 700,
      fontSize: '20px',
    },
  },
  avatar: {
    height: '80px',
    width: '80px',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    color: '#ffffff',
    top: '20px',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  listroot: {
    width: '100%',
    maxWidth: '36ch',
    // backgroundColor: theme.palette.background.paper,
  },
  teamdetails: {
    color: '#ffffff',
  },
}));

function FirstPriceSealedBid({ newAuctionObj, renderNextAuction }) {
  const classes = useStyles();
  const windowSize = useWindowSize();
  const [live, setLive] = useState(false);
  const [expanded, setExpandedLeaderboard] = React.useState(false);
  const { player } = useContext(userContext);
  const [auctionObj, setAuctionObj] = useState();
  const [currentBid, setCurrentBid] = useState();
  const [auctionTimer, setAuctionTimer] = useState({
    total: 0,
    minutes: 0,
    seconds: 0,
  });
  const [bidWinner, setBidWinner] = useState();
  const [isDisableNextBtn, setDisableNextBtn] = useState(true);

  const handleExpandLeaderboardClick = () => {
    setExpandedLeaderboard(!expanded);
  };

  useEffect(() => {
    if (newAuctionObj) {
      setDisableNextBtn(true);
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
      if (timerValue.total <= 1000) {
        setDisableNextBtn(false);
        setExpandedLeaderboard(true);
      }
      setAuctionTimer(timerValue);
    });
  }, [auctionTimer]);

  useEffect(() => {
    socket.on('displayBidWinner', (calculatedBidWinner) => {
      setBidWinner(calculatedBidWinner);
    });
  }, [bidWinner]);

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

  const renderConfetti = () => {
    if (player.teamName === bidWinner.bidTeam && !isDisableNextBtn) {
      return (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
        />
      );
    }
    return <></>;
  };

  const renderWinner = () => (
    <>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {!bidWinner
              && (
              <Typography component="subtitle2" variant="subtitle2">
                There are no winners announced yet. Please wait for auctions to begin
              </Typography>
              )}
          { bidWinner && (
          <>
            {renderConfetti()}
            <List className={classes.listroot}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="artifact-img" src={bidWinner.auctionObj.imageURL} />
                </ListItemAvatar>
                <ListItemText
                  primary={bidWinner.auctionObj.name}
                  secondary={(
                    <>
                      <Typography
                        component="p"
                        variant="body2"
                        className={classes.teamdetails}
                        color="#ffffff"
                      >
                        Won by:
                        {' '}
                        Team
                        {' '}
                        {bidWinner.bidTeam}
                      </Typography>
                      <Typography
                        component="p"
                        variant="body2"
                        className={classes.teamdetails}
                        color="#ffffff"
                      >
                        Paid:
                        {' '}
                        {bidWinner.bidAmount}
                      </Typography>
                    </>
                  )}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </List>
          </>
          )}
        </CardContent>
      </Collapse>
    </>
  );

  return (
    <div className={classes.root}>
      <Button onClick={getNextAuction} size="large" className={classes.nextbtn} fullWidth disabled={isDisableNextBtn}>Click for next auction</Button>
      <Card className={classes.leaderboardroot}>
        <CardHeader
          title="Result"
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar} src={leaderboardImg} />
          }
          action={(
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandLeaderboardClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
          className={classes.leaderboardheaderstyle}
        />
        {
          expanded && renderWinner()
        }
      </Card>
      {auctionObj && (
      <div className={classes.cardRoot}>
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
      </div>
      )}
    </div>
  );
}

export default FirstPriceSealedBid;
