import React, { useEffect, useState } from "react";
import { socket } from "../global/socket";

function Timer() {

  const [currentTime, setCurrentTime] = useState();

  useEffect(() => {
    socket.on("timerValue", value => {
      console.log('value', value);
      setCurrentTime(value);
    });
  }, []);

	return (
		<div>
      <p>Auction starts in: {currentTime && currentTime.minutes}:{currentTime && currentTime.seconds}</p>
		</div>
	);
}
export default Timer;
