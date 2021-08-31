import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { socket } from "../global/socket";
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import LiveAuctions from './LiveAuctions';
import Timer from "./Timer";
import AppBar from '@material-ui/core/AppBar';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    padding: 50
  },
  imageList: {
    width: 900,
    height: 800,
  },
	media: {
		height: "200px", // 16:9
  },
  appbar: {
    backgroundColor: '#2ECC71'
  }
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
  const [landingPageTimerValue, setLandingPageTimerValue] = useState({
    minutes: '00',
    seconds: '00'
  });

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

  useEffect(() => {
    socket.on("landingPageTimerValue", value => {
      console.log('value', value);
      setLandingPageTimerValue(value);
    });
  });
  
  const startLiveAuction = (currentAuctionObj) => {
    if (!currentAuctionObj || !currentAuctionObj.newState || currentAuctionObj.auctionState === 2) {
      setStartAuctions(true);
      socket.emit("startLiveAuctions");
    }
  }
  
  const renderArtifacts = () => {
    let { auctions } = gameState;
    return (
      <div className={classes.root}>
        <ImageList rowHeight={200} gap={20} className={classes.imageList}>
          {auctions.artifacts.map((item) => {
            return (
              <ImageListItem key={item.id}>
                <img src={item.imageURL} alt={item.name} />
                <ImageListItemBar
                  title={item.name}
                  subtitle={<span>by: {item.artist}</span>}
                  // actionIcon={
                  //   <IconButton aria-label={`info about ${item.name}`} className={classes.icon}>
                  //     <InfoIcon />
                  //   </IconButton>
                  // }
                />
              </ImageListItem>
            )
          })}
        </ImageList>
      </div>
    )
  }

	return (
    <>
      {
        !startAuctions ?
        <div className={classes.root}>
          <AppBar position="fixed" className={classes.appbar}>
            <Timer timerValue={landingPageTimerValue} />
          </AppBar>
          {renderArtifacts()}
        </div>
        :
        <LiveAuctions getNextAuctionObj={startLiveAuction} />
      }
    </>
  )
}

export default LandingPage;
