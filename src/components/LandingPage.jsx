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
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

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
    margin: '0 auto',
    textAlign: 'center',
    width: '100%',
    fontWeight: 700,
    color: '#922B21',
    backgroundColor: '#FADBD8',
    padding: '15px',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10, 10, 10),
  },
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
  const { player } = useContext(userContext);

  //states
	const [gameState, setGameState] = useState({
		auctions: {
			artifacts: [],
		},
  });
  const [startAuctions, setStartAuctions] = useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [isGalleryFullScreen, setIsGalleryFullscreen] = useState(false);
  const [hasLandingPageTimerEnded, setHasLandingPageTimerEnded] = useState(false);
  const [landingPageTimerValue, setLandingPageTimerValue] = useState({
    total: '0',
    minutes: '00',
    seconds: '00'
  });

  //hooks and methods
  useEffect(() => {
    setTimeout(() => {
      socket.emit("startLandingPageTimer", 10);
    }, 5000);
  }, []);

  useEffect(() => {
    socket.on("landingPageTimerEnded", () => {
      setHasLandingPageTimerEnded(true);
      handleOpenModal();
      socket.removeListener('landingPageTimerValue');
    });
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
  
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const startLiveAuction = (currentAuctionObj) => {
    setStartAuctions(true);
    socket.emit("startLiveAuctions", currentAuctionObj);
  }

  const _onScreenChange = (fullScreenElement) => {
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

  const renderStartAuctionModal = () => {
    return(
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.paper}>
            <Button variant="contained" color="secondary" className={classes.startbtn} onClick={() => startLiveAuction(null)}>Start Auctions</Button>
          </div>
        </Fade>
      </Modal>
    )
  }

	return (
    <>
      {
        !startAuctions ?
        (
          hasLandingPageTimerEnded ?
          renderStartAuctionModal()
          :
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
            <Typography variant="subtitle1" className={classes.titlecontent}>
              Welcome to the world's best painting exhibition. Paintings can be bought once the auction begin.
            </Typography>
            {/* <div className={classes.startauctionsbtndiv}>
              <Button variant="contained" color="secondary" className={classes.startbtn} onClick={() => startLiveAuction(null)}>Start Auctions</Button>
            </div> */}
            <div className={classes.imagegallerywrapper}>
              {renderArtifacts()}
            </div>
          </div>
        )
        :
        <LiveAuctions getNextAuctionObj={startLiveAuction} />
      }
    </>
  )
}

export default LandingPage;
