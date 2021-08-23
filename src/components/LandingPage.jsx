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

function LandingPage() {
	const classes = useStyles();
	const [gameState, setGameState] = useState({
		auctions: {
			artifacts: [],
		},
	});

	useEffect(() => {
		socket.on("gameState", gameState => {
			setGameState(JSON.parse(gameState));
		});
	}, []);

	const renderArtifacts = () => {
		let { auctions } = gameState;
		return auctions.artifacts.map(artifact => {
			return (
				<Card key={artifact.id}>
					<CardHeader title={artifact.name} />
					<CardMedia className={classes.media} component="img" image={`${artifact.imageURL}`} title={artifact.name} />
					<CardActions disableSpacing>
						<Button variant="contained" color="secondary">
							Nominate
						</Button>
					</CardActions>
				</Card>
			);
		});
	};
	//return <div></div>;
	return <div className={classes.root}>{renderArtifacts()}</div>;
}

export default LandingPage;
