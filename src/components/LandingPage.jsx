import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import '../global/ImageGallery.module.css';
import "react-image-gallery/styles/css/image-gallery.css";
import Button from "@material-ui/core/Button";
import { socket } from "../global/socket";
import LiveAuctions from './LiveAuctions';
import AppBar from '@material-ui/core/AppBar';
import userContext from "../global/userContext";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ImageGallery from 'react-image-gallery';

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
    backgroundColor: '#2ECC71',
    flexGrow: 1,
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
  timercontent: {
    display: 'none',
    margin: '0 auto',
    fontWeight: '700',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    color: '#000000',
    fontSize: '22px'
  },
  playerdiv: {
    fontWeight: 700
  },
  imagegallerywrapper: {
    marginTop: '50px',
  },
  titlecontent: {
    margin: '30px auto',
    width: '500px',
    fontWeight: 700,
    color: '#008080',
    backgroundColor: '#40E0D0',
    padding: '20px',
    borderRadius: '10px'
  }
}));

const IMAGE_GALLERY_SETTINGS = {
  showIndex: false,
  showBullets: true,
  infinite: true,
  showThumbnails: true,
  showFullscreenButton: true,
  showGalleryFullscreenButton: true,
  showPlayButton: true,
  showGalleryPlayButton: true,
  showNav: true,
  isRTL: false,
  slideDuration: 450,
  slideInterval: 2000,
  slideOnThumbnailOver: false,
  thumbnailPosition: 'left',
  showVideo: {},
  useWindowKeyDown: true,
};

function LandingPage() {
	const classes = useStyles();
	const [gameState, setGameState] = useState({
		auctions: {
			artifacts: [],
		},
  });
  const [startAuctions, setStartAuctions] = useState(false);
  const { player } = useContext(userContext);
  const [isGalleryFullScreen, setIsGalleryFullscreen] = useState(false);
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

  const _onScreenChange = (fullScreenElement) => {
    console.log('inside fullscreen element', fullScreenElement)
    console.debug('isFullScreen?', !!fullScreenElement);
    setIsGalleryFullscreen(fullScreenElement);
  }

  const renderArtifacts = () => {
    let { auctions } = gameState;
    const imageGalleryArr = auctions.artifacts.reduce((acc, item) => {
      const { imageURL, artist, name, id } = item;
      acc.push({
        original: imageURL,
        thumbnail: imageURL,
        originalHeight: !isGalleryFullScreen && '500px',
        fullScreen: imageURL,
        description: `${name}, Created By: ${artist}`
      });
      return acc;
    }, []);
    return <ImageGallery items={imageGalleryArr} onScreenChange={_onScreenChange} {...IMAGE_GALLERY_SETTINGS} />;
  }

	return (
    <>
      {
        !startAuctions ?
        <div>
          <AppBar position="fixed" className={classes.appbar}>
            <Toolbar>
              <Typography variant="h6" className={classes.timercontent}>
                Auction starts in: {landingPageTimerValue && landingPageTimerValue.minutes}:{landingPageTimerValue && landingPageTimerValue.seconds}
              </Typography>
              { player &&
                <div className={classes.playerdiv}>
                  <p>{player.playerName}, Team {player.teamName}, {player.playerId}</p>
                </div>
              }
            </Toolbar>
          </AppBar>
          <Typography variant="h6" className={classes.titlecontent}>
            Welcome to the world's best painting exhibition. Paintings can be bought once the auction begin.
          </Typography>
          {/* <div className={classes.startauctionsbtndiv}>
            <Button variant="contained" color="secondary" className={classes.startbtn} onClick={() => startLiveAuction(null)}>Start Auctions</Button>
          </div> */}
          <div className={classes.imagegallerywrapper}>
            {renderArtifacts()}
          </div>
        </div>
        :
        <LiveAuctions getNextAuctionObj={startLiveAuction} />
      }
    </>
  )
}

export default LandingPage;
