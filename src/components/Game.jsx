import React, { useEffect, useState } from "react";
import LandingPage from "../components/LandingPage";
import LiveAuctions from "./LiveAuctions";
import { socket } from "../global/socket";
function Game() {
	return (
		<div>
			{/* <LandingPage /> */}
			<LiveAuctions />
		</div>
	);
}
export default Game;
