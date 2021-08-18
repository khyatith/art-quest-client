import { BrowserRouter, Switch, Route } from "react-router-dom";
import { socket } from "./global/socket";
import React, { useEffect, useState } from "react";
import LaunchScreen from "./components/lauchScreen";
import StagingScreen from "./components/StagingScreen";

function App() {
	useEffect(() => {
		socket.on("gameState", handleGameState);
	}, [window.gameStateGlobal]);

	const handleGameState = gameState => {
		gameState = JSON.parse(gameState);
		window.gameStateGlobal = gameState;
		console.log(window.gameStateGlobal);
	};

	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={LaunchScreen} />
				<Route path="/staging/:code" exact component={StagingScreen} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
