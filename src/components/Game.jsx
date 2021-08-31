import React, { useEffect } from "react";
import LandingPage from "./LandingPage";
import Header from "./Header";
import { socket } from "../global/socket";

function Game() {

  useEffect(() => {
    socket.emit("startLandingPageTimer", 10);
  }, []);

	return (
		<div>
      <Header />
			<LandingPage />
		</div>
	);
}
export default Game;
