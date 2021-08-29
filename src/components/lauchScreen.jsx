import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router";
import { socket } from "../global/socket";
import userContext from "../global/userContext";

const useStyles = makeStyles(theme => ({
	root: {
		width: 300,
		padding: 100,
		margin: "0 30%",
	},
	form: {
		margin: "0 0 20px 0px",
		width: 245,
	},
}));

function LaunchScreen() {
	const classes = useStyles();
	const history = useHistory();
	const { player, setPlayer } = useContext(userContext);

	const handleCreate = () => {
		socket.emit("createRoom", JSON.stringify(player));
		history.push("/staging/" + player.playerId);
	};

	const handleChange = event => {
		const { name, value } = event.target;
		setPlayer(prevValues => {
			return {
				...prevValues,
				[name]: value,
			};
		});
		if (player.playerId === "") {
			let uid = getRandomString(6);
			setPlayer(prevValues => {
				return {
					...prevValues,
					playerId: uid,
				};
			});
		}
	};

	const handleJoin = () => {
		socket.emit("joinRoom", JSON.stringify(player));
		history.push("/staging/" + player.hostCode);
	};

	function getRandomString(length) {
		var randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var result = "";
		for (var i = 0; i < length; i++) {
			result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
		}
		return result;
	}

	return (
		<div className={classes.root}>
			<h1>Auction Game</h1>
			<TextField className={classes.form} name="playerName" label="Player Name" variant="outlined" onChange={handleChange} />
			<TextField className={classes.form} name="teamName" label="Team Name" variant="outlined" onChange={handleChange} />
			<Button className={classes.form} variant="contained" color="primary" onClick={handleCreate}>
				Create Game
			</Button>
			<Typography className={classes.form}>Or</Typography>
			<TextField className={classes.form} name="hostCode" label="Game Code" variant="outlined" onChange={handleChange} />
			<Button className={classes.form} variant="contained" color="primary" onClick={handleJoin}>
				Join Game
			</Button>
		</div>
	);
}

export default LaunchScreen;
