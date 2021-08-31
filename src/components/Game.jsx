import React, { useEffect } from "react";
import LandingPage from "./LandingPage";
import Header from "./Header";
import { socket } from "../global/socket";

function Game() {

	return (
		<div>
      <Header />
			<LandingPage />
		</div>
	);
}
export default Game;
