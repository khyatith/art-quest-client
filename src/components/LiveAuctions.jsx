import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { socket } from "../global/socket";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { Typography } from "@material-ui/core";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	root: {
		width: 500,
		padding: 100,
		margin: "0 30%",
	},
	media: {
		height: "200px", // 16:9
	},
}));

function LiveAuctions({ getNextAuctionObj }) {
	const classes = useStyles();
  const [auctionObj, setAuctionObj] = useState();
  const [currentBid, setCurrentBid] = useState();
  const [auctionTimer, setAuctionTimer] = useState({
    total: 0,
    minutes: 0,
    seconds: 0
  });
  const [bidWinner, setBidWinner] = useState();

	useEffect(() => {
    socket.removeListener('landingPageTimerValue');
    socket.on("startNextAuction", auctionObj => {
      if (auctionObj) {
        setAuctionObj(auctionObj);
      }
    });
  }, [auctionObj]);
  
  useEffect(() => {
    setTimeout(() => {
      socket.emit("startAuctionsTimer", 2);
    }, 10000);
  }, [auctionObj]);

  useEffect(() => {
    socket.on('auctionTimerValue', timerValue => {
      setAuctionTimer(timerValue);
    });
  }, [auctionTimer]);

  useEffect(() => {
    socket.on("displayBidWinner", bidWinner => {
      console.log('bidWinner', bidWinner);
      setBidWinner(bidWinner);
    });
  }, [auctionTimer])

  const nextAuctionObj = () => {
    getNextAuctionObj(auctionObj);
  }

  const setBidAmt = () => {
    const bidInfo = {
      auctionType: auctionObj.auctionType,
      auctionObj: auctionObj,
      bidAmount: currentBid,
      bidAt: + new Date()
    };
    socket.emit("addNewBid", bidInfo);
  }

  const setCurrentBidAmt = (e) => {
    setCurrentBid(e.target.value);
  }

	return (
		<div className={classes.root}>
			{auctionObj && (
				<>
					<Card key={auctionObj.id}>
						<CardHeader title={auctionObj.name} />
						<CardMedia className={classes.media} component="img" image={`${auctionObj.imageURL}`} title={auctionObj.name} />
						<CardContent>
							<Typography color="textSecondary">Original price:{auctionObj.originalValue}</Typography>
							{/* <Typography>Winning Bid: {auctionObj && auctionObj.bid.buyingPrice}</Typography>
							<Typography>Winning Team: {auctionObj && auctionObj.bid.buyingTeam}</Typography> */}
						</CardContent>
						<CardActions disableSpacing>
							<TextField type="number" name="bidAmount" placeholder="Bidding Amount" variant="outlined" onChange={setCurrentBidAmt} />
							<Button variant="contained" color="secondary" onClick={setBidAmt}>
								Bid
							</Button>
              <div>Bid time remaining: {auctionTimer && auctionTimer.minutes}:{ auctionTimer && auctionTimer.seconds}</div>
						</CardActions>
					</Card>
				</>
			)}
			<Button onClick={nextAuctionObj}>Next</Button>
      { bidWinner && <div>Bid winner is {JSON.stringify(bidWinner)}</div>}
		</div>
	);
}

export default LiveAuctions;
