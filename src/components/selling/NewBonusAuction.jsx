/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { Typography, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { socket } from '../../global/socket';
import SimpleRating from '../Rating';
import { validateCurrentBid } from '../../global/helpers';

const useStyles = makeStyles((theme) => ({
  media: {
    height: '200px', // 16:9
  },
  root: {
    width: '100%',
  },
  maingrid: {
    padding: '20px',
    width: '100%',
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
  appbar: {
    backgroundColor: '#76e246',
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
    color: '#051207',
    fontSize: '22px',
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
  playerdiv: {
    fontWeight: 700,
    color: '#051207', // green color
  },
}));

const NewBonusAuction = ({ auctionObj }) => {
  const classes = useStyles();
  const bidInputRef = useRef();
  const previousBidDetails = useRef();
  const player = JSON.parse(sessionStorage.getItem('user'));
  const [bidAmtError, setBidAmtError] = useState(null);

  useEffect(() => {
    socket.on('setPreviousBid', (previousBid) => {
      if (previousBid) {
        previousBidDetails.current = {
          bidAmount: previousBid.bidAmount,
          bidTeam: previousBid.bidTeam,
          bidColor: previousBid.bidColor,
        };
      }
    });
  }, [previousBidDetails]);

  const setBidAmt = () => {
    const bidInput = bidInputRef.current.value;
    const isValidCurrentBid = validateCurrentBid(bidInput);
    if (!isValidCurrentBid) {
      setBidAmtError('Your bid should be a valid number');
      return;
    }
    const prevBidAmt = previousBidDetails.current && previousBidDetails.current.bidAmount;
    const desiredBid = prevBidAmt ? parseInt(prevBidAmt, 10) + 2 : auctionObj.originalValue;
    if (bidInput < desiredBid) {
      setBidAmtError(`Your bid should be more than ${desiredBid}`);
    } else {
      setBidAmtError(null);
      const bidInfo = {
        auctionType: auctionObj.auctionType,
        auctionId: auctionObj.id,
        paintingQuality: auctionObj.paintingQuality,
        auctionObj,
        player,
        bidAmount: bidInput,
        bidAt: +new Date(),
        bidTeam: player.teamName,
        bidColor: player.teamColor,
      };
      socket.emit('addNewBid', bidInfo);
    }
  };

  return (
    <div className={classes.root}>
      <Grid className={classes.maingrid} container spacing={3}>
        {auctionObj && (
          <Grid item xs={12}>
            <Card key={auctionObj.id}>
              <CardHeader className={classes.titlestyle} title={auctionObj.name} subheader={`Created By: ${auctionObj.artist}`} />
              <CardMedia className={classes.media} component="img" image={`${auctionObj.imageURL}`} title={auctionObj.name} />
              <CardContent className={classes.cardcontentstyle}>
                <p>Painting Quality</p>
                <SimpleRating rating={parseFloat(auctionObj.paintingQuality)} />
                <Typography component="h6" variant="h6">
                  {`Opening bid : $${auctionObj.originalValue}M`}
                </Typography>
              </CardContent>
              <CardActions className={classes.cardactionsstyle}>
                <div>
                  <TextField
                    inputRef={bidInputRef}
                    error={!!bidAmtError}
                    helperText={bidAmtError && bidAmtError}
                    className={classes.textfieldstyle}
                    size="small"
                    name="bidAmount"
                    placeholder="Enter your bid"
                    variant="outlined"
                    disabled={previousBidDetails.current && previousBidDetails.current.bidTeam === player.teamName}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      endAdornment: <InputAdornment position="end">M</InputAdornment>,
                    }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={setBidAmt}
                    disabled={previousBidDetails.current && previousBidDetails.current.bidTeam === player.teamName}
                  >
                    Bid
                  </Button>
                  {previousBidDetails.current && previousBidDetails.current.bidAmount && previousBidDetails.current.bidTeam !== player.teamName && (
                    <p>* Your bid cannot be less than {`$${parseInt(previousBidDetails.current.bidAmount, 10) + 2}M`}</p>
                  )}
                  {previousBidDetails.current && previousBidDetails.current.bidAmount && previousBidDetails.current.bidTeam === player.teamName && (
                    <p>* Waiting for bids from other teams</p>
                  )}
                </div>
                <div className={classes.bottomcontainer}>
                  {previousBidDetails.current && previousBidDetails.current.bidTeam && previousBidDetails.current.bidAmount ? (
                    <div className={classes.lastbidcontainer} style={{ backgroundColor: `${previousBidDetails.current.bidColor}` }}>
                      <p className={classes.lastbidby}>Last Bid By: {`Team ${previousBidDetails.current.bidTeam}`}</p>
                      <p className={classes.lastbidamount}>Last Bid Amount: {`$${parseInt(previousBidDetails.current.bidAmount, 10)}M`}</p>
                    </div>
                  ) : (
                    <div className={classes.lastbidcontainer}>
                      <p className={classes.lastbidby}>Highest bid will show here</p>
                    </div>
                  )}
                </div>
              </CardActions>
            </Card>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default NewBonusAuction;
