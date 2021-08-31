import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	wrapper: {
		margin: '0 auto',
  },
  content: {
    fontWeight: '700',
    color: '#000000',
    fontSize: '22px'
  }
}));

function Timer({ timerValue }) {
  const classes = useStyles();

  const [currentTime, setCurrentTime] = useState();

  useEffect(() => {
    setCurrentTime(timerValue);
  });

	return (
		<div className={classes.wrapper}>
      <p className={classes.content}>Auction starts in: {currentTime && currentTime.minutes}:{currentTime && currentTime.seconds}</p>
		</div>
	);
}
export default Timer;
