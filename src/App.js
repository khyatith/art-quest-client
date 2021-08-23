import { BrowserRouter, Switch, Route } from "react-router-dom";
import { socket } from "./global/socket";
import React, { useEffect } from "react";
import LaunchScreen from "./components/lauchScreen";
import StagingScreen from "./components/StagingScreen";
import Game from "./components/Game";

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={LaunchScreen} />
				<Route path="/staging/:code" exact component={StagingScreen} />
				<Route path="/game/:code">
					<Game gameState={window.gameStateGlobal} />
				</Route>
			</Switch>
		</BrowserRouter>
	);
}

export default App;
