import React, { useEffect } from "react";
import LandingPage from "../components/LandingPage";
import { socket } from "../global/socket";

function Game() {

  useEffect(() => {
    socket.emit("startLandingPageTimer", 10);
  });

	return (
		<div>
			<LandingPage />
		</div>
	);
}
export default Game;
