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

function LiveAuctions({ gameState, getNextAuctionObj }) {
	const classes = useStyles();
	const [artifact, setArtifact] = useState();
	const [auctionObj, setAuctionObj] = useState();

	useEffect(() => {
		socket.on("startNextAuction", auctionObj => {
			setAuctionObj(auctionObj);
		});
	}, [auctionObj]);

	return (
		<div className={classes.root}>
			{auctionObj && (
				<>
					<Card key={auctionObj.id}>
						<CardHeader title={auctionObj.name} />
						<CardMedia className={classes.media} component="img" image={`${auctionObj.imageURL}`} title={auctionObj.name} />
						<CardContent>
							<Typography color="textSecondary">Original price:{auctionObj.originalValue}</Typography>
							<Typography>Winning Bid: {auctionObj.bid.buyingPrice}</Typography>
							<Typography>Winning Team: {auctionObj.bid.buyingTeam}</Typography>
						</CardContent>
						<CardActions disableSpacing>
							<TextField name="bidAmount" placeholder="Bidding Amount" variant="outlined" />
							<Button variant="contained" color="secondary">
								Bid
							</Button>
						</CardActions>
					</Card>
				</>
			)}
			<Button onClick={getNextAuctionObj}>Next</Button>
		</div>
	);
}

export default LiveAuctions;
