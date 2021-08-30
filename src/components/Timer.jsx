import React, { useEffect, useState } from "react";
import { socket } from "../global/socket";

function Timer({ sourcePage }) {

  const [currentTime, setCurrentTime] = useState();

  useEffect(() => {
    socket.on("landingPageTimerValue", value => {
      setCurrentTime(value);
    });
  });

	return (
		<div>
      <p>Auction starts in: {currentTime && currentTime.minutes}:{currentTime && currentTime.seconds}</p>
		</div>
	);
}
export default Timer;
