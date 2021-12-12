/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import { socket } from '../../global/socket';

const useStyles = makeStyles((theme) => ({
  media: {
    height: '200px', // 16:9
  },
  root: {
    width: '85%',
    margin: 'auto',
  },
  maingrid: {
    padding: '20px',
    width: '100%',
    textAlign: 'center',
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
    margin: '0 10px 10px 10px',
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

const NewBonusAuctionResult = ({ auctionObj }) => {
  const classes = useStyles();
  const previousBidDetails = useRef();

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

  return (
    <div className={classes.root}>
      <Grid className={classes.maingrid} container spacing={3}>
        {auctionObj && (
          <Grid item xs={12}>
            <h3>{auctionObj.name}</h3>
            <Card key={auctionObj.id}>
              {/* <CardHeader className={classes.titlestyle} title={auctionObj.name} subheader={`Created By: ${auctionObj.artist}`} /> */}
              <CardMedia className={classes.media} component="img" image={`${auctionObj.imageURL}`} title={auctionObj.name} />
              <CardActions className={classes.cardactionsstyle}>
                <div className={classes.bottomcontainer}>
                  {previousBidDetails.current && previousBidDetails.current.bidTeam && previousBidDetails.current.bidAmount ? (
                    <div className={classes.lastbidcontainer} style={{ backgroundColor: `${previousBidDetails.current.bidColor}` }}>
                      <p className={classes.lastbidby}>{`Won By: Team ${previousBidDetails.current.bidTeam}`}</p>
                      <p className={classes.lastbidamount}>Bid Value: {`$${parseInt(previousBidDetails.current.bidAmount, 10)}M`}</p>
                    </div>
                  ) : (
                    <div className={classes.lastbidcontainer}>
                      <p className={classes.lastbidby}>No team bid for this painting</p>
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

export default NewBonusAuctionResult;
