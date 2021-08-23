import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { socket } from "../global/socket";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
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

function LiveAuctions() {
	const classes = useStyles();
	const [artifact, setArtifact] = useState();
	const [gameState, setGameState] = useState({
		auctions: {
			artifacts: [],
		},
	});

	useEffect(() => {
		socket.on("gameState", state => {
			console.log(state);
			setGameState(JSON.parse(state));
		});
	}, [gameState]);

	const renderArtifacts = () => {
		let { auctions } = gameState;
		setArtifact(auctions.artifacts[0]);
		return (
			<Card key={artifact.id}>
				<CardHeader title={artifact.name} />
				<CardMedia className={classes.media} component="img" image={`${artifact.imageURL}`} title={artifact.name} />
				<CardContent>
					<Typography color="textSecondary">Original price:{artifact.originalValue}</Typography>
					<Typography>Winning Bid: {artifact.bid.buyingPrice}</Typography>
					<Typography>Winning Team: {artifact.bid.buyingTeam}</Typography>
				</CardContent>
				<CardActions disableSpacing>
					<TextField name="bidAmount" placeholder="Bidding Amount" variant="outlined" />
					<Button variant="contained" color="secondary">
						Bid
					</Button>
				</CardActions>
			</Card>
		);
	};
	return <div></div>;
	//return <div className={classes.root}>{setInterval(renderArtifacts(), 6000)}</div>;
}

export default LiveAuctions;
