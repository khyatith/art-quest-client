import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { socket } from "../global/socket";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import LiveAuctions from './LiveAuctions';
import Timer from "../components/Timer";

const useStyles = makeStyles(theme => ({
	root: {
		width: 500,
		padding: 100,
		margin: "0 30%",
	},
	media: {
		height: "200px", // 16:9
	},
}));

function LandingPage() {
	const classes = useStyles();
	const [gameState, setGameState] = useState({
		auctions: {
			artifacts: [],
		},
  });
  const [hasTimerEnded, setHasTimerEnded] = useState(false);
  const [startAuctions, setStartAuctions] = useState(false);
  const [timerEndMessage, setTimerEndMessage] = useState(null);

  // useEffect(() => {
  //   socket.on("landingPageTimerEnds", message => {
  //     console.log('inside landing page timer ends');
  //     setTimerEndMessage(message);
  //     setHasTimerEnded(true);
  //   });
  // }, [hasTimerEnded]);

	useEffect(() => {
		socket.on("gameState", gameState => {
			setGameState(JSON.parse(gameState));
    });
  }, []);
  
  const startLiveAuction = (currentAuctionObj) => {
    if (!currentAuctionObj || !currentAuctionObj.newState || currentAuctionObj.auctionState === 2) {
      setStartAuctions(true);
      socket.emit("startLiveAuctions");
    }
  }

	const renderArtifacts = () => {
    let { auctions } = gameState;
		return auctions.artifacts.map(artifact => {
			return (
				<Card key={artifact.id}>
					<CardHeader title={artifact.name} />
					<CardMedia className={classes.media} component="img" image={`${artifact.imageURL}`} title={artifact.name} />
					<CardActions disableSpacing>
						<Button variant="contained" color="secondary" onClick={startLiveAuction}>
							Nominate
						</Button>
					</CardActions>
				</Card>
			);
		});
	};

	return (
    <>
      {
        !startAuctions ?
        <div className={classes.root}>
          <>
            {<Timer sourcePage={'landing'} />}
            {renderArtifacts()}
          </>
        </div>
        :
        <LiveAuctions getNextAuctionObj={startLiveAuction} />
      }
    </>
  )
}

export default LandingPage;
