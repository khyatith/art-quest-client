import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { socket } from "../global/socket";
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import LiveAuctions from './LiveAuctions';
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
  },
  startauctionsbtndiv: {
    marginLeft: '45%',
    marginTop: '100px',
    display: 'block',
    position: 'relative'
  },
  startbtn: {
    width: '200px',
    height: '60px',
    "&.MuiButton-label": {
      fontWeight: '700',
      fontSize: '18px'
    }
  },
  timerwrapper: {
		margin: '0 auto',
  },
  timercontent: {
    fontWeight: '700',
    color: '#000000',
    fontSize: '22px'
  }
}));

function LandingPage() {
	const classes = useStyles();
	const [gameState, setGameState] = useState({
		auctions: {
			artifacts: [],
		},
  });
  const [startAuctions, setStartAuctions] = useState(false);
  const [landingPageTimerValue, setLandingPageTimerValue] = useState({
    total: '0',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    setTimeout(() => {
      socket.emit("startLandingPageTimer", 10);
    }, 5000);
  }, []);

	useEffect(() => {
		socket.on("gameState", gameState => {
			setGameState(JSON.parse(gameState));
    });
  }, []);

  useEffect(() => {
    socket.on("landingPageTimerValue", value => {
      setLandingPageTimerValue(value);
    });
  }, []);
  
  const startLiveAuction = (currentAuctionObj) => {
    socket.removeListener('landingPageTimerValue');
    setStartAuctions(true);
    socket.emit("startLiveAuctions", currentAuctionObj);
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
        <div>
          <AppBar position="fixed" className={classes.appbar}>
          <div className={classes.timerwrapper}>
            <p className={classes.timercontent}>Auction starts in: {landingPageTimerValue && landingPageTimerValue.minutes}:{landingPageTimerValue && landingPageTimerValue.seconds}</p>
          </div>
          </AppBar>
          <div className={classes.startauctionsbtndiv}>
            <Button variant="contained" color="secondary" className={classes.startbtn} onClick={() => startLiveAuction(null)}>Start Auctions</Button>
          </div>
          {renderArtifacts()}
        </div>
        :
        <LiveAuctions getNextAuctionObj={startLiveAuction} />
      }
    </>
  )
}

export default LandingPage;
