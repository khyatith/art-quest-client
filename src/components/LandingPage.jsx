import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import AppBar from '@material-ui/core/AppBar';
import LiveAuctions from './LiveAuctions';
import { socket } from '../global/socket';
import userContext from '../global/userContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    padding: 50,
  },
  imageList: {
    width: 900,
    height: 800,
  },
  media: {
    height: '200px', // 16:9
  },
  appbar: {
    backgroundColor: '#2ECC71',
  },
  startauctionsbtndiv: {
    marginLeft: '45%',
    marginTop: '100px',
    display: 'block',
    position: 'relative',
  },
  startbtn: {
    width: '200px',
    height: '60px',
    '&.MuiButton-label': {
      fontWeight: '700',
      fontSize: '18px',
    },
  },
  timerwrapper: {
    margin: '0 auto',
  },
  timercontent: {
    fontWeight: '700',
    color: '#000000',
    fontSize: '22px',
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
  const [gameState, setGameState] = useState({
    auctions: {
      artifacts: [],
    },
  });
  const [startAuctions, setStartAuctions] = useState(false);
  const [landingPageTimerValue, setLandingPageTimerValue] = useState({
    total: '0',
    minutes: '00',
    seconds: '00',
  });
  const { player, setPlayer } = useContext(userContext);

  useEffect(() => {
    setTimeout(() => {
      socket.emit('startLandingPageTimer', 10);
    }, 5000);
  }, []);

  useEffect(() => {
    socket.on('gameState', (gameState) => {
      setGameState(JSON.parse(gameState));
    });
  }, []);

  useEffect(() => {
    socket.on('landingPageTimerValue', (value) => {
      setLandingPageTimerValue(value);
    });
  }, []);

  const startLiveAuction = (currentAuctionObj) => {
    socket.removeListener('landingPageTimerValue');
    setStartAuctions(true);
    socket.emit('startLiveAuctions', { auctions: currentAuctionObj, client: player });
  };

  const renderArtifacts = () => {
    const { auctions } = gameState;
    return (
      <div className={classes.root}>
        <ImageList rowHeight={200} gap={20} className={classes.imageList}>
          {auctions.artifacts.map((item) => (
            <ImageListItem key={item.id}>
              <img src={item.imageURL} alt={item.name} />
              <ImageListItemBar
                title={item.name}
                subtitle={(
                  <span>
                    by:
                    {item.artist}
                  </span>
)}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    );
  };

  return (
    <>
      {!startAuctions ? (
        <div>
          <AppBar position="fixed" className={classes.appbar}>
            <div className={classes.timerwrapper}>
              <p className={classes.timercontent}>
                Auction starts in:
                {' '}
                {landingPageTimerValue && landingPageTimerValue.minutes}
                :
                {landingPageTimerValue && landingPageTimerValue.seconds}
              </p>
            </div>
          </AppBar>
          <div className={classes.startauctionsbtndiv}>
            <Button variant="contained" color="secondary" className={classes.startbtn} onClick={() => startLiveAuction(null)}>
              Start Auctions
            </Button>
          </div>
          {renderArtifacts()}
        </div>
      ) : (
        <LiveAuctions getNextAuctionObj={startLiveAuction} />
      )}
    </>
  );
}

export default LandingPage;
