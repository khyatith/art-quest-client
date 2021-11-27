/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import '../global/ImageGallery.module.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ImageGallery from 'react-image-gallery';
import axios from 'axios';
import userContext from '../global/userContext';
import LiveAuctions from './LiveAuctions';
import Header from './Header';
import { socket } from '../global/socket';
import load from '../assets/load.webp';
import { API_URL } from '../global/constants';

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: '#76e246',
    flexGrow: 1,
  },
  timercontent: {
    display: 'none',
    margin: '0 auto',
    fontWeight: '700',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    color: '#051207',
    fontSize: '22px',
  },
  playerdiv: {
    fontWeight: 700,
    color: '#051207',
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
  const [totalNumberOfPaintings, setTotalNumberOfPaintings] = useState();

  // states

  const [isGalleryFullScreen, setIsGalleryFullscreen] = useState(false);
  const [hasLandingPageTimerEnded, setHasLandingPageTimerEnded] = useState(false);
  const [landingPageTimerValue, setLandingPageTimerValue] = useState({});

  const getRemainingTime = () => {
    if (Object.keys(landingPageTimerValue).length <= 0) {
      setHasLandingPageTimerEnded(true);
      return;
    }
    const total = parseInt(landingPageTimerValue.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      setHasLandingPageTimerEnded(true);
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setLandingPageTimerValue(value);
    }
  };

  // hooks and methods
  useEffect(() => {
    async function fetchTimerValue() {
      const sesStr = JSON.parse(sessionStorage.getItem('user'));
      const { data } = await axios.get(`${API_URL}/buying/timer/${sesStr.hostCode}`);
      setLandingPageTimerValue(data.landingPageTimerValue);
    }
    if (Object.keys(landingPageTimerValue).length === 0) {
      fetchTimerValue();
    }
  }, [landingPageTimerValue]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (landingPageTimerValue) {
      const interval = setInterval(() => getRemainingTime(), 1000);
      return () => clearInterval(interval);
    }
  });

  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem('allAuction')) !== null) {
      setTotalNumberOfPaintings(JSON.parse(sessionStorage.getItem('allAuction')).auctions.artifacts.length);
    }
  }, []);

  useEffect(() => {
    socket.on('landingPageTimerValue', ({ timerValue }) => {
      setLandingPageTimerValue(timerValue);
    });
  }, []);

  const onScreenChange = (fullScreenElement) => {
    setIsGalleryFullscreen(fullScreenElement);
  };

  const renderArtifacts = () => {
    if (JSON.parse(sessionStorage.getItem('allAuction')) === null) {
      return (
        <div style={{ marginTop: '12%', marginLeft: '43%' }}>
          {' '}
          <img src={load} alt="loading..." />
          {' '}
        </div>
      );
    }
    const { auctions } = JSON.parse(sessionStorage.getItem('allAuction'));
    const imageGalleryArr = auctions.artifacts.reduce((acc, item) => {
      const {
        imageURL, artist, name,
      } = item;
      acc.push({
        original: imageURL,
        thumbnail: imageURL,
        originalHeight: !isGalleryFullScreen && '500px',
        fullScreen: imageURL,
        description: `${name}, Created By: ${artist}`,
      });
      return acc;
    }, []);
    return (
      <ImageGallery
        items={imageGalleryArr}
        onScreenChange={onScreenChange}
        {...IMAGE_GALLERY_SETTINGS}
      />
    );
  };

  return (
    <>
      {
        // eslint-disable-next-line no-nested-ternary
        hasLandingPageTimerEnded
          ? <LiveAuctions totalNumberOfPaintings={totalNumberOfPaintings} allAuctions={JSON.parse(sessionStorage.getItem('allAuction'))} fromLP />
          : (
            <div>
              <Header />
              <AppBar position="fixed" className={classes.appbar}>
                <Toolbar>
                  <Typography variant="h6" className={classes.timercontent}>
                    Auction starts in:
                    {' '}
                    {landingPageTimerValue && landingPageTimerValue.minutes}
                    :
                    {landingPageTimerValue && landingPageTimerValue.seconds}
                  </Typography>
                  {player
                    && (
                      <div className={classes.playerdiv}>
                        <p>
                          {JSON.parse(sessionStorage.getItem('user')).playerName}
                          , Team&nbsp;
                          {JSON.parse(sessionStorage.getItem('user')).teamName}
                          ,
                          {' '}
                          {JSON.parse(sessionStorage.getItem('user')).playerId}
                        </p>
                      </div>
                    )}
                </Toolbar>
              </AppBar>
              <Typography variant="subtitle1" className={classes.titlecontent}>
                Welcome to the world&#39;s best painting exhibition. Paintings can be bought once the auction begin.
              </Typography>
              <div className={classes.imagegallerywrapper}>
                {renderArtifacts()}
              </div>
            </div>
          )
      }
    </>
  );
}

export default LandingPage;
