/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MoreDetailsModal from './MoreDetailsModal';
import load from '../../assets/load.webp';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';
import { socket } from '../../global/socket';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme,
  },
  appbar: {
    height: 130,
    marginBottom: '50px',
  },
  timercontent: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    flexGrow: 1,
    textAlign: 'center',
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    marginRight: theme.spacing(2),
  },
  headerText: {
    marginLeft: '35%',
  },
  imageList: {
    // width: 500,
    height: 500,
    margin: '30px !important',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  imagelistitem: {
    '&:hover': { transform: 'scale3d(1.05, 1.05, 1)' },
    cursor: 'pointer',
  },
  playercontent: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    fontSize: '22px',
    position: 'absolute',
    right: '0',
    marginRight: '10px',
  },
  imagelistitembar: {
    height: '80px',
    '&.MuiImageListItemBar-titleWrap': {
      marginTop: '-10px',
    },
  },
  artiststyle: {
    marginTop: '0px',
    marginBottom: '5px',
  },
}));

const LandingPage = () => {
  const classes = useStyles();
  const history = useHistory();
  // const [hasLandingPageTimerEnded, setHasLandingPageTimerEnded] = useState(false);
  const [landingPageTimerValue, setLandingPageTimerValue] = useState();
  const player = JSON.parse(sessionStorage.getItem('user'));
  const [favoritedItems, setFavoritedItems] = useState();
  const [favoritedByMyTeam, setFavoritedByMyTeam] = useState([]);
  const [openModalForPainting, setOpenModalForPainting] = useState();
  const [selectedPaintingDetails, setSelectedPaintingDetails] = useState();

  const getRemainingTime = () => {
    const total = parseInt(landingPageTimerValue.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      const sesStr = JSON.parse(sessionStorage.getItem('user'));
      socket.emit('landingPageTimerEnded', JSON.stringify(sesStr));
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setLandingPageTimerValue(value);
    }
  };

  useEffect(() => {
    async function fetchTimerValue() {
      const sesStr = JSON.parse(sessionStorage.getItem('user'));
      const { data } = await axios.get(`${API_URL}/buying/timer/${sesStr.hostCode}`);
      setLandingPageTimerValue(data.landingPageTimerValue);
    }
    if (!landingPageTimerValue) {
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
    socket.on('updatedFavorites', (data) => {
      setFavoritedItems(data);
    });
  });

  useEffect(() => {
    socket.on('redirectToNextPage', () => {
      history.push(`/englishAuction/${player.hostCode}`);
    });
  }, []);

  const addToFavorites = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    let result = favoritedItems;
    if (!result || !result[itemId]) {
      result = {
        ...result,
        [itemId]: [player.teamName],
      };
    } else {
      console.log('inside result', result, itemId);
      result[`${itemId}`].push(player.teamName);
    }
    if (!favoritedByMyTeam.includes(itemId)) {
      setFavoritedByMyTeam((existingIds) => [...existingIds, itemId]);
    }
    socket.emit('addtofavorites', { favoritedItems: result, roomCode: player.hostCode });
  };

  const seeMoreDetails = (e, itemId) => {
    e.preventDefault();
    const { allPaintings } = JSON.parse(sessionStorage.getItem('allAuction'));
    const selectedPainting = allPaintings.filter((item) => item.id === itemId);
    setSelectedPaintingDetails(selectedPainting[0]);
    setOpenModalForPainting(itemId);
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
    const { allPaintings } = JSON.parse(sessionStorage.getItem('allAuction'));
    return (
      <>
        <ImageList rowHeight={250} cols={4} className={classes.imageList}>
          {allPaintings && allPaintings.map((item) => (
            <ImageListItem key={item.id} className={classes.imagelistitem} onClick={(e) => seeMoreDetails(e, item.id)}>
              <img src={item.imageURL} alt={item.name} />
              <ImageListItemBar
                className={classes.imagelistitembar}
                title={item.name}
                subtitle={(
                  <span>
                    <h4 className={classes.artiststyle}>{item.artist}</h4>
                    {
                      favoritedItems && favoritedItems[item.id] && favoritedItems[item.id].map((team) => (
                        <div style={{
                          borderRadius: '50%',
                          backgroundColor: TEAM_COLOR_MAP[team],
                          width: '15px',
                          height: '15px',
                          marginTop: '10px',
                          marginBottom: '5px',
                          display: 'inline-block',
                          marginRight: '2px',
                        }}
                        />
                      ))
                    }
                  </span>
                )}
                actionIcon={(
                  <IconButton aria-label={`info about ${item.name}`} className={classes.icon} onClick={(e) => addToFavorites(e, item.id)}>
                    { favoritedByMyTeam && favoritedByMyTeam.length > 0 && favoritedByMyTeam.includes(item.id)
                      ? <FavoriteIcon color="secondary" />
                      : <FavoriteBorder /> }
                  </IconButton>
                )}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </>
    );
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.appbar} position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            ART QUEST
          </Typography>
          <Typography className={classes.timercontent} variant="h5" noWrap>
            Auctions start in:
            {' '}
            {landingPageTimerValue && landingPageTimerValue.minutes}
            :
            {landingPageTimerValue && landingPageTimerValue.seconds}
          </Typography>
          <Typography variant="h6" className={classes.playercontent}>
            {player.playerName}
            ,
            {' '}
            Team
            {' '}
            {player.teamName}
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container item xs={12} spacing={3}>
        { renderArtifacts() }
      </Grid>
      { openModalForPainting && <MoreDetailsModal
        openModal
        selectedPaintingDetails={selectedPaintingDetails}
        setOpenModalForPainting={setOpenModalForPainting}
      /> }
    </div>
  );
};

export default LandingPage;
